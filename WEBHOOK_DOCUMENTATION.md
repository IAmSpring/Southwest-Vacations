# Webhook Documentation for Southwest Vacations

This document provides information about the webhook system used for deployment notifications and other integrations.

## Overview

The webhook system enables automated notifications when the Southwest Vacations application is deployed to GitHub Pages. It also supports other event-driven integrations with external services.

## Webhook Server

The application includes a simple webhook server that can receive and process events from GitHub's webhook system. When deployments are successful, the server can trigger notifications and update deployment status.

### Setup

1. Start the webhook server:

   ```bash
   npm run webhook
   ```

2. For development with auto-restart:
   ```bash
   npm run webhook:dev
   ```

## GitHub Webhook Configuration

To configure GitHub to send webhook notifications:

1. Go to your repository settings on GitHub
2. Select "Webhooks" from the left sidebar
3. Click "Add webhook"
4. Configure the webhook:
   - Payload URL: Enter your webhook server URL (e.g., `https://your-server.com/webhook`)
   - Content type: Select `application/json`
   - Secret: Create a secure secret and save it
   - Events: Select "Workflow runs" and "Deployments"
   - Active: Check this box to enable the webhook

## Webhook Payload

The webhook server processes the following types of events:

- `workflow_run`: Triggered when a GitHub Actions workflow completes
- `deployment_status`: Triggered when a deployment status changes

For successful deployments, the server generates a standardized payload:

```json
{
  "event": "deployment_success",
  "status": "success",
  "repository": "username/repository-name",
  "ref": "main",
  "commitSha": "abc123..."
}
```

## Integration with GitHub Pages

When a GitHub Pages deployment succeeds:

1. GitHub sends a webhook notification to the webhook server
2. The server verifies the signature using the shared secret
3. For successful deployments, it logs the event and updates the deployment status
4. Notifications are sent to configured services (if enabled)

## Configuration

Configure the webhook system by setting environment variables:

| Variable         | Description                                      | Default               |
| ---------------- | ------------------------------------------------ | --------------------- |
| `PORT`           | Port for the webhook server                      | 3000                  |
| `WEBHOOK_SECRET` | Secret for GitHub webhook signature verification | "your-webhook-secret" |

## Webhook Handlers

You can extend the webhook functionality by modifying the following files:

- `webhook-server.js`: Main webhook server
- `scripts/webhook-handler.js`: Contains the logic for processing webhooks

## Testing Webhooks

To test the webhook system locally:

1. Start the webhook server:

   ```bash
   npm run webhook:dev
   ```

2. Use a tool like ngrok to expose your local server:

   ```bash
   ngrok http 3000
   ```

3. Configure GitHub to use the ngrok URL as the webhook payload URL

4. Make a test commit to trigger the webhook
