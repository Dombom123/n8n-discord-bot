const axios = require('axios');

const webhookUrl = 'https://n8n.drivebeta.de/webhook-test/7290e8f0-868d-465c-aede-07592dd59860';

// Sample data that your Discord bot sends
const sampleMessageData = {
  messageId: "1398355784135606342",
  content: "Hello from Discord! This is a test message.",
  author: {
    id: "123456789012345678",
    username: "dombom69",
    displayName: "dombom69"
  },
  channelId: "1396581118928617584",
  guildId: "1396221102459715594",
  timestamp: new Date().toISOString(),
  attachments: []
};

async function testWebhook() {
  try {
    console.log('Sending test data to webhook...');
    console.log('Data:', JSON.stringify(sampleMessageData, null, 2));
    
    const response = await axios.post(webhookUrl, sampleMessageData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Success! Response:', response.status, response.data);
  } catch (error) {
    console.log('❌ Error:', error.response && error.response.status, error.response && error.response.data || error.message);
  }
}

testWebhook(); 