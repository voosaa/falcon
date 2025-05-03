/**
 * Configuration settings for the Falcon Insiders Club bot
 */

const config = {
  // Time intervals
  minutesBetweenSends: process.env.MINUTES_BETWEEN_SENDS || 5,
  
  // URLs and external resources
  pumpFunBaseUrl: process.env.PUMP_FUN_URL || 'https://pump.fun/token/',
  
  // Admin configuration
  adminUserIds: process.env.ADMIN_USER_IDS ? 
    process.env.ADMIN_USER_IDS.split(',').map(id => Number(id)) : 
    [],
  
  // Messages
  messages: {
    welcome: `
🦅 *Welcome to the Falcon Insiders Club!* 🦅

We distribute new token launches in a fair, randomized order with a 5-minute delay between members.
This ensures steady growth until Raydium listing, with no unfair advantage to anyone.

Use /register to join the club!
Use /help to see all available commands.
    `,
    info: `
*🦅 Falcon Insiders Club: How It Works 🦅*

Our fair-launch system works like this:

1️⃣ Register using /register command
2️⃣ When a new token launches, all members receive the buy link
3️⃣ Links are sent in random order, 5 minutes apart
4️⃣ This prevents pump & dump, ensuring steady growth

*Community Rules:*
• Don't sell during Phase 2 distribution
• Hold until Raydium listing
• Help the project grow by inviting friends

*Official Links:*
• Website: [falconinsiders.club](https://falconinsiders.club)
• Twitter: [@FalconInsiders](https://twitter.com/FalconInsiders)
• Telegram: [t.me/FalconInsidersClub](https://t.me/FalconInsidersClub)
    `,
    registered: `
✅ *You're in!* 

You've successfully registered for the Falcon Insiders Club.
We'll send your token link when the next launch begins.

*Remember:*
• Links are distributed in random order
• Each member receives their link 5 minutes apart
• Hold until Raydium listing for maximum gains

Use /status to check the current distribution status.
    `,
    alreadyRegistered: `
👑 You're already registered with Falcon Insiders Club.

Use /status to check the current distribution status.
    `,
    help: `
*Available Commands:*

/start - Welcome message and overview
/info - Learn how the fair-launch system works
/register - Join the Falcon Insiders Club
/status - Check registration and distribution status
/help - Show this help message

*Admin Commands:*
/launch - Begin token distribution (admin only)
    `,
    tokenDelivery: `
🎉 *Falcon Alert!* 🎉

Here's your early access token link: {tokenLink}

❗️ *Important Reminders:*
• Hold until Raydium listing, then consider selling a portion
• Don't sell during Phase 2
• Stay active, invite friends, and help the project grow

Together we fly! 🦅
    `,
    launchStarted: `
🚀 *Phase 2 Started!* 🚀

Token distribution has begun. Links will be sent to {totalUsers} registered members over the next {totalMinutes} minutes.

Each member will receive their link in a random order with a 5-minute delay between sends.

*Remember the community rules:*
• Don't sell during Phase 2
• Hold until Raydium listing
• Help the project grow
    `,
    notAdmin: `
⛔ This command is restricted to admin users only.
    `,
    statusMessage: `
*Falcon Insiders Club Status:*

👥 Total registered users: {registeredUsers}
🔗 Links distributed: {linksSent}
⏱️ Distribution progress: {progress}%

{statusMessage}
    `
  }
};

module.exports = { config };