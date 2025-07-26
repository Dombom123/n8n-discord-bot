const axios = require('axios');

// Using webhook.site for testing (this will give you a public URL to see the data)
const testWebhookUrl = 'https://webhook.site/your-unique-url'; // We'll get a real one

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

async function getTestWebhook() {
  try {
    console.log('Getting a test webhook URL...');
    const response = await axios.get('https://webhook.site/token');
    const token = response.data;
    const webhookUrl = `https://webhook.site/${token}`;
    
    console.log('✅ Test webhook URL:', webhookUrl);
    console.log('\n📋 Sample data structure:');
    console.log(JSON.stringify(sampleMessageData, null, 2));
    
    console.log('\n🚀 Sending test data...');
    const webhookResponse = await axios.post(webhookUrl, sampleMessageData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Data sent successfully!');
    console.log('📊 Check the webhook URL to see the received data');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

getTestWebhook(); 