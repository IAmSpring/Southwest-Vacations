// Test API authentication
import fetch from 'node-fetch';

// API base URL
const API_URL = 'http://localhost:4000';

async function testApi() {
  console.log('Testing API authentication...');
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint:');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log(`Health status: ${healthData.status}`);
    
    // Attempt login
    console.log('\n2. Testing login:');
    const loginResponse = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123',
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log(`Login response: ${loginResponse.status === 200 ? 'Success' : 'Failed'}`);
    
    if (!loginData.token) {
      throw new Error('Login failed - no token returned');
    }
    
    const token = loginData.token;
    console.log(`Token received: ${token.substring(0, 10)}...`);
    
    // Test getting trips with authentication
    console.log('\n3. Testing trips endpoint:');
    const tripsResponse = await fetch(`${API_URL}/api/trips`);
    const tripsData = await tripsResponse.json();
    console.log(`Found ${tripsData.length} trips`);
    
    // Test user profile with authentication
    console.log('\n4. Testing profile endpoint with authentication:');
    const profileResponse = await fetch(`${API_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (profileResponse.status === 200) {
      const profileData = await profileResponse.json();
      console.log(`Profile retrieved: ${profileData.email}`);
    } else {
      console.log(`Profile request failed: ${profileResponse.status}`);
    }
    
    console.log('\nAPI tests completed!');
  } catch (error) {
    console.error('Error during API tests:', error);
  }
}

// Run the tests
testApi(); 