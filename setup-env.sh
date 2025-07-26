#!/bin/bash

echo "Setting up environment variables..."

# Create .env file with the provided values
cat > .env << EOF
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_GUILD_ID=your_discord_guild_id_here
DISCORD_CHANNEL_ID=your_discord_channel_id_here

# n8n Webhook Configuration
N8N_WEBHOOK_URL=your_n8n_webhook_url_here

# Server Configuration
PORT=3000
NODE_ENV=development
EOF

echo "Environment file created! You can now start the bot with: npm run dev" 