require('dotenv').config();
const DiscordBot = require('./discord-bot');
const logger = require('./logger');

// Validate required environment variables
const requiredEnvVars = [
  'DISCORD_TOKEN',
  'DISCORD_GUILD_ID', 
  'DISCORD_CHANNEL_ID',
  'N8N_WEBHOOK_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error('Missing required environment variables', { missingVars });
  process.exit(1);
}

// Create Discord bot instance
const bot = new DiscordBot(
  process.env.DISCORD_TOKEN,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_CHANNEL_ID,
  process.env.N8N_WEBHOOK_URL
);

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    await bot.stop();
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { error: error.message });
    process.exit(1);
  }
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
  gracefulShutdown('unhandledRejection');
});

// Start the bot
async function startBot() {
  try {
    logger.info('Starting n8n Discord bot...');
    await bot.start();
    
    // Log status every 5 minutes
    setInterval(() => {
      const status = bot.getStatus();
      logger.info('Bot status check', status);
    }, 5 * 60 * 1000);
    
  } catch (error) {
    logger.error('Failed to start bot', { error: error.message });
    process.exit(1);
  }
}

// Start the application
startBot(); 