# Southwest Airlines Vacations App AI Assistant Guide

This document outlines how to use and interact with the Southwest Airlines Vacations AI Assistant, which is powered by OpenAI's API using GPT-4o.

## Overview

The AI Assistant is designed to help users and administrators navigate the Southwest Airlines Vacations application. It provides assistance with:

1. Finding and booking flights, hotels, and car rentals
2. Answering questions about bookings and reservations
3. Providing information about destinations and travel options
4. Guiding users through checkout processes
5. Assisting admins with system analysis and debugging

## Architecture Overview

The AI Assistant system consists of two distinct components:

1. **User-Facing Assistant**: Integrated directly into the Southwest Vacations UI as a chat bubble in the bottom right corner. This assistant has access to vectorized documentation and travel information to help general users.

2. **Admin-Only Assistant**: Enhanced version with access to the codebase repository, system diagnostics, and user conversation analytics. Only accessible via the admin portal and provides deeper technical assistance.

## JSON Response Format

The AI Assistant returns responses in a structured JSON format to enable rich UI experiences. The response structure includes:

```json
{
  "message": "The main response text from the assistant",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "status": "success",
  "timestamp": "2023-06-18T15:30:45.123Z"
}
```

- **message**: The primary text response from the assistant
- **suggestions**: An array of follow-up questions or options for the user
- **status**: Indicates whether the response was successful ('success' or 'error')
- **timestamp**: ISO timestamp of when the response was generated

## Technical Implementation

### Backend API Routes

The AI Assistant backend provides the following API endpoints:

1. **Thread Management**:

   - `GET /api/ai/threads` - Get all threads for the current user
   - `POST /api/ai/threads` - Create a new conversation thread
   - `GET /api/ai/threads/:threadId` - Get a specific thread with messages

2. **Message Handling**:

   - `POST /api/ai/threads/:threadId/messages` - Send a message and get AI response

3. **Admin Analytics**:
   - `GET /api/admin/ai/threads` - Get all user threads (admin only)
   - `GET /api/admin/ai/threads/:threadId` - Get detailed thread data (admin only)

### Frontend Integration

The frontend implementation renders the JSON response in a chat bubble interface where:

1. The `message` is displayed as the main chat bubble text
2. The `suggestions` are displayed as clickable chips below the message
3. The UI handles both text and JSON responses gracefully

#### Components

- `AIAssistant.tsx`: Main component with chat bubble UI
- `AdminChatHistory.tsx`: Admin view of conversation analytics
- `AIAssistantContext.tsx`: Context provider for state management

## User vs. Admin Experience

- **Regular Users**: Can access general vacation information and personal booking assistance
- **Admin Users**: Have additional capabilities for analytics, debugging, and system monitoring
  - Admins can view all user conversations via the Admin Dashboard
  - Admins have access to analytics about common questions and issues
  - Admins can analyze patterns to improve the AI Assistant's responses

## Environment Configuration

The AI Assistant requires the following environment variables to be set:

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_ASSISTANT_ID`: The ID of your created assistant (default: asst_Le5hAPkk1mriAIVsRK06qGsm)

These can be configured in your `.env` file.

## Testing & Deployment

### Automated Tests

We provide comprehensive test scripts that verify:

1. Thread creation
2. Message sending and receiving
3. Admin access to thread data
4. Error handling and fallback responses

### Test Commands

- `npm run test-ai-assistant`: Run all AI assistant tests
- `npm run dev:ai`: Start only the AI backend for testing
- `npm run clean-start`: Run the complete clean startup sequence with tests

### System Startup Checks

During system startup, the AI Assistant undergoes the following health checks:

1. Thread creation verification
2. Message exchange verification
3. Response format validation
4. Admin access validation
5. Authentication checks

## OpenAI Playground Testing Commands

To test the AI Assistant in the OpenAI Playground, use these example prompts:

1. Basic greeting with JSON format:

   ```
   Hello! Can you tell me about your abilities in JSON format?
   ```

2. Flight booking inquiry:

   ```
   I'd like to book a flight to Hawaii in JSON format please
   ```

3. Hotel information request:

   ```
   What hotels do you recommend in Las Vegas? Return in JSON format.
   ```

4. Admin capability testing:
   ```
   I'm an admin and need to analyze user conversations. Can you explain how I can do that? (JSON response please)
   ```

## Best Practices

1. **Include "JSON" in your prompts**: When using the OpenAI playground, include the word "JSON" in your prompts to ensure the response format is set correctly.

2. **Be specific with questions**: The more specific your question, the more detailed and helpful the response will be.

3. **Leverage suggested follow-ups**: The suggestions provided in the response can help guide the conversation in useful directions.

4. **Admin features**: Don't expose admin capabilities to regular users. The assistant is programmed to avoid mentioning admin features to non-admin users.

## User Experience Enhancements

The AI Assistant includes several UX improvements:

1. **Personalization**: The assistant remembers user preferences and search history to provide tailored recommendations
2. **Interactive Elements**: Users can interact with the assistant through clickable suggestion chips
3. **Mobile Responsiveness**: The chat bubble UI adapts seamlessly to mobile devices
4. **Accessibility Support**: The assistant interface includes ARIA attributes and keyboard navigation
5. **Progressive Enhancement**: The assistant will fall back to basic text responses if JSON parsing fails

## Future Enhancements

Future versions of the AI Assistant will include:

1. Integration with the booking system for real-time availability checking
2. Personalized recommendations based on user history
3. Multi-language support
4. Voice interface options
5. Image recognition for destination identification
6. Calendar view integration for flexible date suggestions
7. Regional special offers based on user location
8. Advanced search filtering via natural language
9. Loyalty program integration
10. Travel restriction and requirement information

## Troubleshooting

If you encounter issues with the AI Assistant:

1. Verify the OpenAI API key is valid and has sufficient quota
2. Check that the Assistant ID is correctly set in the environment variables
3. Examine the backend logs for any API errors
4. Ensure the frontend is properly parsing the JSON responses
5. Verify network connectivity to the OpenAI API

For development issues, use the `clean-start` script to ensure a proper environment setup.
