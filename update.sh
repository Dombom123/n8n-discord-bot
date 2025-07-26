#!/bin/bash

echo "🔄 Updating n8n Discord bot..."

# Stop the current bot
echo "⏹️  Stopping bot..."
pkill -f "node src/index.js" || true
pkill -f "nodemon src/index.js" || true

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Start the bot
echo "🚀 Starting bot..."
npm start &

echo "✅ Bot updated and restarted!"
echo "📊 Check logs with: tail -f logs/combined.log" 