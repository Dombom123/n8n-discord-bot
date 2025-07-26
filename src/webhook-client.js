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
      
      // Convert payload to URL parameters for GET request
      const params = new URLSearchParams();
      params.append('messageId', payload.messageId);
      params.append('content', payload.content);
      params.append('authorId', payload.author.id);
      params.append('authorUsername', payload.author.username);
      params.append('authorDisplayName', payload.author.displayName);
      params.append('channelId', payload.channelId);
      params.append('guildId', payload.guildId);
      params.append('timestamp', payload.timestamp);
      params.append('attachments', JSON.stringify(payload.attachments));

      const response = await axios.get(`${this.webhookUrl}?${params.toString()}`, {
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