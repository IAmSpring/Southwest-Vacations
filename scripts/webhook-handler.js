/**
 * Webhook handler script for GitHub Pages deployment
 * This script processes webhook notifications from GitHub Actions
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  // Where deployment logs are stored
  logFile: path.join(process.cwd(), 'logs', 'deployments.log'),
  
  // User activity logs
  userActivityLog: path.join(process.cwd(), 'logs', 'user-activity.log'),
  
  // Notification targets (could be Discord, Slack, email services, etc.)
  notificationTargets: [
    // Add your notification endpoints here
    // Example: { type: 'discord', url: 'https://discord.com/api/webhooks/...' }
  ],
  
  // Admin and manager notification settings
  adminNotifications: {
    enabled: true,
    emailAddresses: [
      'admin@southwestvacations.com',
      'manager@southwestvacations.com',
      'supervisor@southwestvacations.com'
    ],
    notifyOnEvents: ['booking', 'user_registration', 'deployment', 'payment']
  },
  
  // Deployment status tracking file
  statusFilePath: path.join(process.cwd(), 'data', 'deployment-status.json')
};

// Ensure logs directory exists
const logsDir = path.dirname(CONFIG.logFile);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Ensure data directory exists for status file
const statusDir = path.dirname(CONFIG.statusFilePath);
if (!fs.existsSync(statusDir)) {
  fs.mkdirSync(statusDir, { recursive: true });
}

/**
 * Log message to file
 * @param {string} message - Message to log
 * @param {string} logFile - Path to log file
 */
function logMessage(message, logFile = CONFIG.logFile) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  
  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error(`Error writing to log file: ${error.message}`);
  }
}

/**
 * Update deployment status
 * @param {Object} data - Deployment status data
 */
function updateDeploymentStatus(data) {
  try {
    const statusData = {
      lastDeployment: {
        timestamp: new Date().toISOString(),
        status: data.status,
        repository: data.repository,
        ref: data.ref,
        commitSha: data.commitSha || 'unknown'
      },
      deploymentHistory: []
    };
    
    // Read existing history if available
    if (fs.existsSync(CONFIG.statusFilePath)) {
      const existingData = JSON.parse(fs.readFileSync(CONFIG.statusFilePath, 'utf8'));
      
      // Add current deployment to history (limited to last 10)
      if (existingData.lastDeployment) {
        existingData.deploymentHistory.unshift(existingData.lastDeployment);
        statusData.deploymentHistory = existingData.deploymentHistory.slice(0, 9);
      }
    }
    
    fs.writeFileSync(CONFIG.statusFilePath, JSON.stringify(statusData, null, 2));
    logMessage(`Updated deployment status: ${data.status}`);
    
    // Notify admins about deployment
    if (CONFIG.adminNotifications.enabled && 
        CONFIG.adminNotifications.notifyOnEvents.includes('deployment')) {
      notifyAdmins('deployment', {
        type: 'deployment',
        status: data.status,
        repository: data.repository,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logMessage(`Error updating deployment status: ${error.message}`);
  }
}

/**
 * Send notification to external services
 * @param {Object} data - Webhook data
 */
function sendNotifications(data) {
  CONFIG.notificationTargets.forEach(target => {
    if (target.type === 'discord') {
      sendDiscordNotification(target.url, data);
    }
    // Additional notification types can be implemented here
  });
}

/**
 * Notify administrators and managers
 * @param {string} eventType - Type of event (booking, user_registration, etc.)
 * @param {Object} eventData - Event details
 */
function notifyAdmins(eventType, eventData) {
  // Log the admin notification
  logMessage(`Admin notification: ${eventType} - ${JSON.stringify(eventData)}`, CONFIG.userActivityLog);
  
  // For real implementation, send emails to admins
  CONFIG.adminNotifications.emailAddresses.forEach(email => {
    logMessage(`Would send email to ${email} about ${eventType}`, CONFIG.userActivityLog);
    // In a real implementation, call an email service here
  });
  
  // Also send to notification targets if configured
  if (CONFIG.notificationTargets.length > 0) {
    const notificationData = {
      type: 'admin_notification',
      eventType,
      eventData,
      timestamp: new Date().toISOString()
    };
    
    sendNotifications(notificationData);
  }
}

/**
 * Track user activity for admin reporting
 * @param {Object} data - User activity data
 */
function trackUserActivity(data) {
  try {
    // Log the user activity
    const { userId, action, details } = data;
    logMessage(`User ${userId} performed ${action}: ${JSON.stringify(details)}`, CONFIG.userActivityLog);
    
    // Notify admins for specific types of activities
    if (CONFIG.adminNotifications.enabled && 
        (action === 'booking' || action === 'payment' || action === 'registration')) {
      
      if (CONFIG.adminNotifications.notifyOnEvents.includes(action)) {
        notifyAdmins(action, data);
      }
    }
  } catch (error) {
    logMessage(`Error tracking user activity: ${error.message}`);
  }
}

/**
 * Send notification to Discord
 * @param {string} webhookUrl - Discord webhook URL
 * @param {Object} data - Webhook data
 */
function sendDiscordNotification(webhookUrl, data) {
  if (!webhookUrl) return;
  
  let title, description, color;
  
  // Format based on notification type
  if (data.type === 'admin_notification') {
    title = `Admin Alert: ${data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1)}`;
    description = `Event: ${data.eventType}\nDetails: ${JSON.stringify(data.eventData)}`;
    color = 15844367; // Gold color for admin notifications
  } else {
    title = `Deployment ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`;
    description = `Repository: ${data.repository}\nBranch: ${data.ref}`;
    color = data.status === 'success' ? 3066993 : 15158332;
  }
  
  const payload = {
    embeds: [{
      title,
      description,
      color,
      timestamp: new Date().toISOString()
    }]
  };
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  const req = https.request(webhookUrl, requestOptions, (res) => {
    if (res.statusCode === 204) {
      logMessage('Discord notification sent successfully');
    } else {
      logMessage(`Discord notification failed with status code: ${res.statusCode}`);
    }
  });
  
  req.on('error', (error) => {
    logMessage(`Error sending Discord notification: ${error.message}`);
  });
  
  req.write(JSON.stringify(payload));
  req.end();
}

/**
 * Process webhook data
 * @param {Object} data - Webhook data
 */
function processWebhook(data) {
  logMessage(`Received webhook: event=${data.event}, status=${data.status}, repo=${data.repository}`);
  
  // Handle different types of webhook events
  if (data.event === 'deployment_success' && data.status === 'success') {
    updateDeploymentStatus(data);
    sendNotifications(data);
  } else if (data.event === 'user_activity') {
    trackUserActivity(data);
  }
}

// For command-line testing
if (import.meta.url === `file://${process.argv[1]}`) {
  // Test deployment webhook
  const testDeploymentData = {
    event: 'deployment_success',
    status: 'success',
    repository: 'Southwest-Vacations',
    ref: 'refs/heads/main',
    commitSha: 'test123'
  };
  
  // Test user activity webhook
  const testUserActivity = {
    event: 'user_activity',
    userId: 'user123',
    action: 'booking',
    details: {
      bookingId: 'B12345',
      destination: 'Las Vegas',
      amount: 499.99,
      timestamp: new Date().toISOString()
    }
  };
  
  processWebhook(testDeploymentData);
  processWebhook(testUserActivity);
}

export {
  processWebhook,
  notifyAdmins,
  trackUserActivity
}; 