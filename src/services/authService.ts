import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

// Define user roles
export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  isEmployee: boolean;
  employeeId?: string;
  role?: string;
  permissions?: string[];
}

// Define JWT token payload
interface TokenPayload {
  id: string;
  name: string;
  email: string;
  isEmployee: boolean;
  employeeId?: string;
  role?: string;
  permissions?: string[];
  exp: number;
}

// Define authentication service
class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Initialize from localStorage if available
    this.token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
        this.user = null;
      }
    }
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post('/api/users/login', { email, password });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.user = response.data.user;

        // Store in localStorage
        if (this.token) {
          localStorage.setItem('token', this.token);
        }
        localStorage.setItem('user', JSON.stringify(this.user));

        // Set authorization header for future requests
        if (this.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }

        if (!this.user) {
          throw new Error('Login failed: No user data received');
        }

        return this.user;
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (!this.token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(this.token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logout();
      return false;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) return null;
    return this.user;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    if (!this.isAuthenticated() || !this.user) return false;
    return this.user.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    if (!this.isAuthenticated() || !this.user || !this.user.role) return false;
    return roles.includes(this.user.role);
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    if (!this.isAuthenticated() || !this.user || !this.user.permissions) return false;
    return this.user.permissions.includes(permission);
  }

  // Check if user has all specified permissions
  hasAllPermissions(permissions: string[]): boolean {
    if (!this.isAuthenticated() || !this.user || !this.user.permissions) return false;
    return permissions.every(permission => this.user!.permissions!.includes(permission));
  }

  // Check if user has any of the specified permissions
  hasAnyPermission(permissions: string[]): boolean {
    if (!this.isAuthenticated() || !this.user || !this.user.permissions) return false;
    return permissions.some(permission => this.user!.permissions!.includes(permission));
  }

  // Check if user is an employee
  isEmployee(): boolean {
    if (!this.isAuthenticated() || !this.user) return false;
    return this.user.isEmployee === true;
  }

  // Get the authentication token
  getToken(): string | null {
    return this.token;
  }

  // Setup interceptor for API calls
  setupInterceptors(): void {
    // Request interceptor
    axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          if (config.headers) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          // Unauthorized, token might be expired
          this.logout();
          window.location.href = '/login?expired=true';
        }
        return Promise.reject(error);
      }
    );
  }

  // Perform two-factor authentication
  async validateTwoFactor(code: string): Promise<boolean> {
    try {
      const response = await axios.post('/api/users/validate-2fa', {
        userId: this.user?.id,
        code,
      });

      return response.data.success === true;
    } catch (error) {
      console.error('Two-factor authentication error:', error);
      throw error;
    }
  }

  // Setup two-factor authentication
  async setupTwoFactor(): Promise<{ qrCodeUrl: string; secret: string }> {
    try {
      const response = await axios.post('/api/users/setup-2fa', {
        userId: this.user?.id,
      });

      return {
        qrCodeUrl: response.data.qrCodeUrl,
        secret: response.data.secret,
      };
    } catch (error) {
      console.error('Two-factor setup error:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
authService.setupInterceptors();

export default authService;
