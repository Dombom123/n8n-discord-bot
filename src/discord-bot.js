const { Client, GatewayIntentBits, Events } = require('discord.js');
const logger = require('./logger');
const WebhookClient = require('./webhook-client');

class DiscordBot {
  constructor(token, guildId, channelId, webhookUrl) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    this.guildId = guildId;
    this.channelId = channelId;
    this.webhookClient = new WebhookClient(webhookUrl);
    this.token = token;

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Bot ready event
    this.client.on(Events.ClientReady, () => {
      logger.info('Discord bot is ready!', {
        botName: this.client.user.tag,
        guildId: this.guildId,
        channelId: this.channelId
      });
    });

    // Message create event
    this.client.on(Events.MessageCreate, async (message) => {
      try {
        logger.info('Message received (debug)', {
          messageId: message.id,
          channelId: message.channelId,
          guildId: message.guildId,
          author: message.author.username,
          isBot: message.author.bot,
          content: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
        });

        // Ignore bot messages
        if (message.author.bot) {
          logger.info('Ignoring bot message', { messageId: message.id });
          return;
        }

        // Only process messages from the specified channel
        if (message.channelId !== this.channelId) {
          logger.info('Message from different channel', { 
            messageId: message.id, 
            receivedChannelId: message.channelId, 
            expectedChannelId: this.channelId 
          });
          return;
        }

        // Only process messages from the specified guild
        if (message.guildId !== this.guildId) {
          logger.info('Message from different guild', { 
            messageId: message.id, 
            receivedGuildId: message.guildId, 
            expectedGuildId: this.guildId 
          });
          return;
        }

        logger.info('Processing message for n8n', {
          messageId: message.id,
          author: message.author.username,
          content: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
        });

        // Send message to n8n webhook
        await this.webhookClient.sendMessage(message);

      } catch (error) {
        logger.error('Error processing message', {
          messageId: message.id,
          error: error.message
        });
      }
    });

    // Error handling
    this.client.on('error', (error) => {
      logger.error('Discord client error', { error: error.message });
    });

    // Disconnect handling
    this.client.on('disconnect', () => {
      logger.warn('Discord bot disconnected');
    });
  }

  async start() {
    try {
      await this.client.login(this.token);
      logger.info('Discord bot login successful');
    } catch (error) {
      logger.error('Failed to login to Discord', { error: error.message });
      throw error;
    }
  }

  async stop() {
    try {
      await this.client.destroy();
      logger.info('Discord bot stopped');
    } catch (error) {
      logger.error('Error stopping Discord bot', { error: error.message });
    }
  }

  getStatus() {
    return {
      isReady: this.client.isReady(),
      guildId: this.guildId,
      channelId: this.channelId,
      botName: this.client.user?.tag || 'Not logged in'
    };
  }
}

module.exports = DiscordBot; 