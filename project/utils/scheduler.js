const { deliveryDb } = require('../database/deliveries');
const { config } = require('../config');

/**
 * Scheduler for managing token link distribution
 */
class Scheduler {
  constructor(bot) {
    this.bot = bot;
    this.scheduledTasks = [];
    this.tokenUrl = config.pumpFunBaseUrl;
    this.minutesBetween = config.minutesBetweenSends;
  }

  /**
   * Schedule messages to be sent to users at intervals
   * @param {Array} users - Array of user objects
   * @returns {Number} Total minutes required for distribution
   */
  scheduleDistribution(users) {
    // Clear any previously scheduled tasks
    this.clearScheduledTasks();
    
    let delayMinutes = 0;
    const tokenLinkSuffix = this.generateTokenId();
    
    users.forEach(user => {
      // Schedule message delivery with increasing delays
      const task = setTimeout(async () => {
        await this.sendTokenLink(user, tokenLinkSuffix);
      }, delayMinutes * 60 * 1000);
      
      // Store the task reference for potential cancellation
      this.scheduledTasks.push(task);
      
      // Increment delay for the next user
      delayMinutes += this.minutesBetween;
    });
    
    // Return total minutes required for the distribution
    return delayMinutes;
  }

  /**
   * Clear all scheduled tasks
   */
  clearScheduledTasks() {
    this.scheduledTasks.forEach(task => clearTimeout(task));
    this.scheduledTasks = [];
  }

  /**
   * Generate a random token ID for the Pump.fun URL
   * @returns {String} Random token ID
   */
  generateTokenId() {
    // Generate random characters for the token ID
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.random() * chars.length);
    }
    return result;
  }

  /**
   * Send a token link to a user and record the delivery
   * @param {Object} user - User object
   * @param {String} tokenSuffix - Token ID for the URL
   */
  async sendTokenLink(user, tokenSuffix) {
    try {
      const tokenLink = `${this.tokenUrl}${tokenSuffix}`;
      
      // Prepare message text
      const messageText = config.messages.tokenDelivery.replace(
        '{tokenLink}', 
        tokenLink
      );
      
      // Send message to user
      await this.bot.telegram.sendMessage(user.chat_id, messageText, {
        parse_mode: 'Markdown'
      });
      
      // Record the delivery in the database
      await deliveryDb.recordDelivery(user.id, tokenLink);
      
      console.log(`Token link sent to user ${user.username || user.chat_id}`);
    } catch (error) {
      console.error(`Error sending token link to user ${user.id}:`, error);
    }
  }
}

module.exports = { Scheduler };