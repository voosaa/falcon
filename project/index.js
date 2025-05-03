require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');
const { setupCommands } = require('./bot/commands');
const { initializeDatabase } = require('./database/init');
const { config } = require('./config');

// Initialize bot with token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Initialize database connection
initializeDatabase();

// Setup bot commands
setupCommands(bot);

// Webhook setup for production, polling for development
if (process.env.NODE_ENV === 'production') {
  // Express app for webhook
  const app = express();
  app.use(express.json());
  
  // Set webhook path
  const webhookPath = process.env.BOT_WEBHOOK_PATH || '/webhook';
  
  // Setup webhook handler
  app.use(webhookPath, (req, res) => {
    bot.handleUpdate(req.body, res);
  });
  
  // Start Express server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Express server is listening on ${PORT}`);
    
    // Set webhook
    const webhookUrl = `${process.env.BOT_WEBHOOK_DOMAIN}${webhookPath}`;
    bot.telegram.setWebhook(webhookUrl)
      .then(() => {
        console.log(`Webhook set to ${webhookUrl}`);
      })
      .catch(error => {
        console.error('Error setting webhook:', error);
      });
  });
} else {
  // Use polling for development
  bot.launch()
    .then(() => {
      console.log('Bot started in polling mode');
    })
    .catch(error => {
      console.error('Error starting bot:', error);
    });
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Export bot instance for testing or external use
module.exports = { bot };