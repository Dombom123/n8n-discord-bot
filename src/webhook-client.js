const axios = require('axios');
const logger = require('./logger');

class WebhookClient {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(messageData) {
    try {
      const payload = {
        messageId: messageData.id,
        content: messageData.content,
        author: {
          id: messageData.author.id,
          username: messageData.author.username,
          displayName: messageData.member?.displayName || messageData.author.username
        },
        channelId: messageData.channelId,
        guildId: messageData.guildId,
        timestamp: messageData.createdAt.toISOString(),
        attachments: messageData.attachments.map(attachment => ({
          id: attachment.id,
          filename: attachment.name,
          url: attachment.url,
          size: attachment.size
        }))
      };

      logger.info('Sending message to n8n webhook', { messageId: messageData.id });
      
      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      logger.info('Successfully sent message to n8n', { 
        messageId: messageData.id, 
        status: response.status 
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to send message to n8n webhook', {
        messageId: messageData.id,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  }
}

module.exports = WebhookClient; 