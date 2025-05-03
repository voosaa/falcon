const { config } = require('../config');
const { userDb } = require('../database/users');
const { deliveryDb } = require('../database/deliveries');
const { fisherYatesShuffle } = require('../utils/shuffle');
const { Scheduler } = require('../utils/scheduler');

// Initialize scheduler
let scheduler = null;

/**
 * Setup bot commands
 * @param {Object} bot - Telegraf bot instance
 */
function setupCommands(bot) {
  // Initialize scheduler with bot instance
  scheduler = new Scheduler(bot);

  // Start command
  bot.command('start', async (ctx) => {
    await ctx.replyWithMarkdown(config.messages.welcome);
  });

  // Info command
  bot.command('info', async (ctx) => {
    await ctx.replyWithMarkdown(config.messages.info);
  });

  // Register command
  bot.command('register', async (ctx) => {
    const chatId = ctx.chat.id;
    const username = ctx.from.username;
    
    // Check if user is already registered
    const isRegistered = await userDb.isUserRegistered(chatId);
    
    if (isRegistered) {
      await ctx.replyWithMarkdown(config.messages.alreadyRegistered);
      return;
    }
    
    // Register the user
    const result = await userDb.registerUser(chatId, username);
    
    if (result.success) {
      await ctx.replyWithMarkdown(config.messages.registered);
    } else {
      await ctx.reply(`Error: ${result.message}`);
    }
  });

  // Help command
  bot.command('help', async (ctx) => {
    await ctx.replyWithMarkdown(config.messages.help);
  });

  // Status command
  bot.command('status', async (ctx) => {
    try {
      // Get registration and delivery stats
      const registeredUsers = await userDb.getUserCount();
      const linksSent = await deliveryDb.getDeliveryCount();
      const isDistributing = await deliveryDb.isDistributionInProgress();
      
      // Calculate progress percentage if distribution is in progress
      let progress = 0;
      let statusMessage = 'No active distribution at this time.';
      
      if (registeredUsers > 0 && linksSent > 0) {
        progress = Math.min(100, Math.round((linksSent / registeredUsers) * 100));
        
        if (isDistributing) {
          statusMessage = `Distribution in progress. Please wait for your link!`;
        } else {
          statusMessage = `Last distribution completed. Stay tuned for the next launch!`;
        }
      }
      
      // Send status message
      const message = config.messages.statusMessage
        .replace('{registeredUsers}', registeredUsers)
        .replace('{linksSent}', linksSent)
        .replace('{progress}', progress)
        .replace('{statusMessage}', statusMessage);
      
      await ctx.replyWithMarkdown(message);
    } catch (error) {
      console.error('Error getting status:', error);
      await ctx.reply('Error retrieving status information.');
    }
  });

  // Launch command (admin only)
  bot.command('launch', async (ctx) => {
    try {
      const userId = ctx.from.id;
      
      // Check if user is an admin
      if (!isAdmin(userId)) {
        await ctx.replyWithMarkdown(config.messages.notAdmin);
        return;
      }
      
      // Get all registered users
      const users = await userDb.getAllUsers();
      
      if (!users || users.length === 0) {
        await ctx.reply('No registered users found.');
        return;
      }
      
      // Shuffle users using Fisher-Yates algorithm
      const shuffledUsers = fisherYatesShuffle(users);
      
      // Schedule distribution
      const totalMinutes = scheduler.scheduleDistribution(shuffledUsers);
      
      // Notify about launch
      const launchMessage = config.messages.launchStarted
        .replace('{totalUsers}', shuffledUsers.length)
        .replace('{totalMinutes}', totalMinutes);
      
      await ctx.replyWithMarkdown(launchMessage);
      
      console.log(`Launch initiated by admin ${userId} for ${shuffledUsers.length} users`);
    } catch (error) {
      console.error('Error launching distribution:', error);
      await ctx.reply('Error launching token distribution.');
    }
  });

  // Setup command list for Telegram
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot and see welcome message' },
    { command: 'info', description: 'Learn how the fair-launch system works' },
    { command: 'register', description: 'Join the Falcon Insiders Club' },
    { command: 'status', description: 'Check current distribution status' },
    { command: 'help', description: 'Show available commands' },
  ]);

  // Handle other messages
  bot.on('message', async (ctx) => {
    await ctx.reply('I only respond to commands. Use /help to see available commands.');
  });

  return bot;
}

/**
 * Check if a user is an admin
 * @param {Number} userId - Telegram user ID
 * @returns {Boolean} True if user is an admin
 */
function isAdmin(userId) {
  return config.adminUserIds.includes(userId);
}

module.exports = { setupCommands };