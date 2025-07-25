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
        // Ignore bot messages
        if (message.author.bot) return;

        // Only process messages from the specified channel
        if (message.channelId !== this.channelId) return;

        // Only process messages from the specified guild
        if (message.guildId !== this.guildId) return;

        logger.info('Received message', {
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