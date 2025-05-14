/**
 * Simple webhook server to handle GitHub deployment notifications
 * and user activity tracking for admin notifications
 */

import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { processWebhook, notifyAdmins } from './scripts/webhook-handler.js';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(bodyParser.json());

// Webhook secret from GitHub
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';
// API key for internal application use
const API_KEY = process.env.API_KEY || 'southwest-vacations-api-key';

// Verify GitHub webhook signature
function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Verify API key for internal requests
function verifyApiKey(req) {
  const apiKey = req.headers['x-api-key'];
  return apiKey === API_KEY;
}

// GitHub webhook endpoint
app.post('/webhook', (req, res) => {
  const event = req.headers['x-github-event'];
  
  // Add basic logging
  console.log(`Received ${event} event`);
  
  // Verify webhook signature (optional, depends on your GitHub settings)
  if (WEBHOOK_SECRET !== 'your-webhook-secret') {
    try {
      if (!verifySignature(req)) {
        console.error('Invalid signature');
        return res.status(401).send('Invalid signature');
      }
    } catch (err) {
      console.error('Error verifying signature:', err);
      return res.status(500).send('Error verifying signature');
    }
  }
  
  // Process the webhook based on the event type
  if (event === 'workflow_run' || event === 'workflow_job') {
    const { repository, workflow_run } = req.body;
    
    if (workflow_run && workflow_run.conclusion === 'success') {
      // For successful workflow runs, process as deployment
      processWebhook({
        event: 'deployment_success',
        status: 'success',
        repository: repository.full_name,
        ref: workflow_run.head_branch,
        commitSha: workflow_run.head_sha
      });
    }
  } else if (event === 'deployment' || event === 'deployment_status') {
    // Handle deployment events
    const { repository, deployment, deployment_status } = req.body;
    
    // Only process successful deployments
    if (deployment_status && deployment_status.state === 'success') {
      processWebhook({
        event: 'deployment_success',
        status: 'success',
        repository: repository.full_name,
        ref: deployment.ref,
        commitSha: deployment.sha
      });
    }
  }
  
  // Acknowledge receipt of webhook
  res.status(200).send('Webhook received');
});

// User activity endpoint (for internal application use)
app.post('/api/activity', (req, res) => {
  // Verify the API key for this internal endpoint
  if (!verifyApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { userId, action, details } = req.body;
  
  // Validate required fields
  if (!userId || !action) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Process user activity
  try {
    processWebhook({
      event: 'user_activity',
      userId,
      action,
      details: details || {}
    });
    
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error processing user activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin notification endpoint
app.post('/api/notify-admins', (req, res) => {
  // Verify the API key for this internal endpoint
  if (!verifyApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { eventType, eventData } = req.body;
  
  // Validate required fields
  if (!eventType || !eventData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Process admin notification
  try {
    notifyAdmins(eventType, eventData);
    
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Admin dashboard data endpoint
app.get('/api/admin/activity', (req, res) => {
  // Verify the API key for this internal endpoint
  if (!verifyApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const userActivityLog = path.join(process.cwd(), 'logs', 'user-activity.log');
    
    if (!fs.existsSync(userActivityLog)) {
      return res.status(200).json({ activities: [] });
    }
    
    // Read the last 100 lines of the log file
    const logContent = fs.readFileSync(userActivityLog, 'utf8');
    const logLines = logContent.split('\n').filter(line => line.trim()).slice(-100);
    
    // Parse the log lines into activity objects
    const activities = logLines.map(line => {
      try {
        const timestamp = line.match(/\[(.*?)\]/)[1];
        const message = line.replace(/\[.*?\]\s/, '');
        
        return {
          timestamp,
          message
        };
      } catch (err) {
        return null;
      }
    }).filter(Boolean);
    
    res.status(200).json({ activities });
  } catch (error) {
    console.error('Error getting activity data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
}); 