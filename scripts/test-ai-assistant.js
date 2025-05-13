import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
};

const ADMIN_USER = {
  email: 'admin@example.com',
  password: 'admin123'
};

// Base URL for the API
const API_URL = 'http://localhost:4000/api';

// Test script to verify AI Assistant functionality
async function testAIAssistant() {
  console.log('🔍 Testing AI Assistant functionality...');
  
  // Step 1: Login with test user
  console.log('\n📝 Step 1: Login as regular user');
  const testUserToken = await login(TEST_USER);
  if (!testUserToken) {
    console.error('❌ Test failed: Unable to login with test user');
    process.exit(1);
  }
  console.log('✅ Test user login successful');

  // Step 2: Create a new AI thread
  console.log('\n📝 Step 2: Create a new AI conversation thread');
  const thread = await createThread(testUserToken);
  if (!thread) {
    console.error('❌ Test failed: Unable to create a new thread');
    process.exit(1);
  }
  console.log(`✅ Thread created with ID: ${thread.id}`);

  // Step 3: Send a message to the AI assistant with a unique identifier
  const uniqueId = uuidv4().substring(0, 8);
  const testMessage = `This is a test message with unique ID: ${uniqueId}`;
  console.log(`\n📝 Step 3: Send a message with unique ID: ${uniqueId}`);
  
  const updatedThread = await sendMessage(testUserToken, thread.id, testMessage);
  if (!updatedThread) {
    console.error('❌ Test failed: Unable to send message to thread');
    process.exit(1);
  }
  
  // Verify the message was added to the thread
  const userMessage = updatedThread.messages.find(m => m.role === 'user' && m.content === testMessage);
  if (!userMessage) {
    console.error('❌ Test failed: User message not found in thread');
    process.exit(1);
  }
  
  // Verify the AI assistant responded
  const aiMessage = updatedThread.messages.find(m => m.role === 'assistant' && m.content);
  if (!aiMessage) {
    console.error('❌ Test failed: AI assistant did not respond');
    process.exit(1);
  }
  
  console.log('✅ Message sent and AI responded successfully');
  console.log(`🤖 AI response: "${aiMessage.content.substring(0, 60)}..."`);

  // Step 4: Login as admin to verify the conversation is visible
  console.log('\n📝 Step 4: Login as admin');
  const adminToken = await login(ADMIN_USER);
  if (!adminToken) {
    console.error('❌ Test failed: Unable to login with admin user');
    process.exit(1);
  }
  console.log('✅ Admin login successful');

  // Step 5: Get all threads as admin
  console.log('\n📝 Step 5: Fetch all threads as admin');
  const adminThreads = await getAllThreadsAsAdmin(adminToken);
  if (!adminThreads) {
    console.error('❌ Test failed: Unable to fetch threads as admin');
    process.exit(1);
  }
  
  // Verify the thread created by the test user is visible to admin
  const foundThread = adminThreads.find(t => t.id === thread.id);
  if (!foundThread) {
    console.error('❌ Test failed: Thread not found in admin view');
    process.exit(1);
  }
  console.log('✅ Thread is visible in admin view');

  // Step 6: Fetch the specific thread as admin
  console.log('\n📝 Step 6: Fetch specific thread details as admin');
  const adminThreadDetail = await getThreadAsAdmin(adminToken, thread.id);
  if (!adminThreadDetail) {
    console.error('❌ Test failed: Unable to fetch thread details as admin');
    process.exit(1);
  }
  
  // Verify the unique message is visible to admin
  const adminVisibleMessage = adminThreadDetail.messages.find(m => 
    m.role === 'user' && m.content === testMessage
  );
  
  if (!adminVisibleMessage) {
    console.error('❌ Test failed: User message with unique ID not found in admin view');
    process.exit(1);
  }
  
  console.log(`✅ Message with unique ID: ${uniqueId} is visible in admin view`);
  console.log('\n🎉 All tests passed successfully!');
}

// Helper functions for the tests
async function login(user) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
}

async function createThread(token) {
  try {
    const response = await fetch(`${API_URL}/ai/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Thread'
      })
    });

    if (!response.ok) {
      throw new Error(`Create thread failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create thread error:', error.message);
    return null;
  }
}

async function sendMessage(token, threadId, content) {
  try {
    const response = await fetch(`${API_URL}/ai/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error(`Send message failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Send message error:', error.message);
    return null;
  }
}

async function getAllThreadsAsAdmin(token) {
  try {
    const response = await fetch(`${API_URL}/admin/ai/threads`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get admin threads failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get admin threads error:', error.message);
    return null;
  }
}

async function getThreadAsAdmin(token, threadId) {
  try {
    const response = await fetch(`${API_URL}/admin/ai/threads/${threadId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Get admin thread details failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get admin thread details error:', error.message);
    return null;
  }
}

// Run the tests
testAIAssistant().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
}); 