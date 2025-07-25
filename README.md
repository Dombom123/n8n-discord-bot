# n8n Discord Bot

A Discord bot that listens for messages in a specified channel and forwards them to n8n via webhooks for workflow automation.

## Features

- Listens for messages in a Discord channel
- Forwards message data to n8n via webhooks
- Simple and lightweight design
- Easy deployment with Docker

## Setup

### 1. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Copy the bot token
5. Enable the following bot permissions:
   - Read Messages/View Channels
   - Send Messages
   - Read Message History
6. Invite the bot to your server with appropriate permissions

### 2. Environment Configuration

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required environment variables:
- `DISCORD_TOKEN`: Your Discord bot token
- `DISCORD_GUILD_ID`: Your Discord server ID
- `DISCORD_CHANNEL_ID`: The channel ID where the bot should listen
- `N8N_WEBHOOK_URL`: Your n8n webhook URL

### 3. Installation

```bash
npm install
```

### 4. Running the Bot

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## n8n Integration

The bot sends the following data structure to your n8n webhook:

```json
{
  "messageId": "1234567890123456789",
  "content": "Hello world!",
  "author": {
    "id": "123456789012345678",
    "username": "username",
    "displayName": "Display Name"
  },
  "channelId": "1234567890123456789",
  "guildId": "1234567890123456789",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Docker Deployment

```bash
# Build the image
docker build -t n8n-discord-bot .

# Run the container
docker run -d \
  --name n8n-discord-bot \
  --env-file .env \
  -p 3000:3000 \
  n8n-discord-bot
```

## Project Structure

```
├── src/
│   ├── index.js          # Main application entry point
│   ├── discord-bot.js    # Discord bot logic
│   ├── webhook-client.js # n8n webhook integration
│   └── logger.js         # Logging configuration
├── package.json
├── env.example
├── .gitignore
└── README.md
```

## License

MIT 