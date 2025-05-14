# Southwest Vacations Webhook System

This document explains how the webhook system works for broadcasting booking data changes from the Southwest Vacations booking application.

## Overview

The webhook system automatically notifies external services whenever booking data changes in the application. This enables real-time synchronization with other systems such as:

- External booking systems
- Analytics platforms
- Customer notification services
- Partner travel agencies
- Internal reporting tools

## How It Works

1. **Trigger**: When booking data files are modified and pushed to the main branch, a GitHub Actions workflow is triggered.
2. **Detection**: The workflow detects changes specifically to booking-related data files.
3. **Payload Creation**: A JSON payload is created containing information about the changes.
4. **Broadcast**: The payload is sent via HTTP POST to configured webhook endpoints.

## Webhook Payload

The webhook sends a JSON payload with the following structure:

```json
{
  "repository": "owner/repo-name",
  "commit_sha": "abc123...",
  "changed_booking_data": {
    // The actual changed booking data
  },
  "timestamp": "2023-05-15T12:34:56Z"
}
```

## Setting Up Webhook Recipients

To receive webhook notifications:

1. Create an endpoint that can receive HTTP POST requests
2. Add the webhook URL to the repository secrets:
   - Go to Repository Settings → Secrets and Variables → Actions
   - Add a new secret named `BOOKING_WEBHOOK_URL` with your endpoint URL
   - Add another secret named `WEBHOOK_SECRET` for secure webhook verification

## Verifying Webhook Authenticity

The webhook includes a signature in the `X-Hub-Signature-256` header. To verify the webhook:

1. Compute HMAC-SHA256 of the request body using your secret key
2. Compare it with the signature in the header

Example in Node.js:

```javascript
const crypto = require('crypto');

function verifyWebhook(body, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
```

## Testing Webhooks

You can manually trigger a webhook broadcast:

1. Go to the Actions tab in the GitHub repository
2. Select "Booking Data Webhook Broadcast" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Webhook Development Guidelines

When developing systems that consume these webhooks:

1. Implement proper error handling and retries
2. Verify the webhook signature for security
3. Process events idempotently (handle duplicate events gracefully)
4. Acknowledge receipt quickly, then process asynchronously
5. Implement rate limiting to handle potential high volumes

## Technical Details

- Webhooks are implemented using GitHub Actions
- The workflow file is located at `.github/workflows/webhook-broadcast.yml`
- Webhooks are only triggered on changes to booking data files
- The system uses the `distributhor/workflow-webhook` action to send webhooks 