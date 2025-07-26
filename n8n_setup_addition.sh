#!/bin/bash

# ========================================
# Discord Bot Setup Section
# Add this to your n8n_setup.sh script
# ========================================

echo "🤖 Setting up Discord Bot..."

# Clone the Discord bot repository
if [ ! -d "n8n-discord-bot" ]; then
    echo "📥 Cloning Discord bot repository..."
    git clone https://github.com/Dombom123/n8n-discord-bot.git
    cd n8n-discord-bot
else
    echo "📁 Discord bot directory already exists, updating..."
    cd n8n-discord-bot
    git pull origin main
fi

# Install dependencies
echo "📦 Installing Discord bot dependencies..."
npm install

# Create environment file
echo "⚙️  Setting up environment variables..."
cp env.example .env

echo "✅ Discord bot setup complete!"
echo "📝 Edit .env file with your Discord credentials:"
echo "   - DISCORD_TOKEN"
echo "   - DISCORD_GUILD_ID" 
echo "   - DISCORD_CHANNEL_ID"
echo "   - N8N_WEBHOOK_URL"
echo ""
echo "🚀 Start the bot with: npm start"
echo "📊 Monitor logs with: tail -f logs/combined.log"

# Go back to parent directory
cd ..

echo "========================================" 