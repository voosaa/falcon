# Falcon Insiders Club - Fair-Launch Telegram Bot

A Telegram bot for fair-launch token distribution with randomized ordering and timed releases. This bot ensures a fair distribution of new token launches for the Falcon Insiders Club.

## Features

- User registration through Telegram
- Admin-controlled token distribution
- Randomized fair-launch mechanism
- 5-minute interval between token link distributions
- Database integration with Supabase
- Webhook-based deployment

## Prerequisites

- Node.js v18 or higher
- A Telegram bot token (get one from [@BotFather](https://t.me/BotFather))
- Supabase account and project

## Project Structure

```
/
├── bot/              # Command handlers
├── database/         # Supabase client & migrations
├── utils/            # Helper functions
├── config/           # Constants and configuration
├── supabase/         # Supabase migrations
├── .env              # Environment variables (create from .env.example)
├── index.js          # Main entry point
└── package.json      # Dependencies and scripts
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd falcon-insiders-club
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory using the provided `.env.example` as a template:

```bash
cp .env.example .env
```

Edit the `.env` file and fill in your own values:

```
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
ADMIN_USER_IDS=123456789,987654321  # Comma-separated list of admin user IDs

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

# Deployment Configuration
BOT_WEBHOOK_DOMAIN=https://your-bot-domain.com
BOT_WEBHOOK_PATH=/webhook
PORT=3000

# App Configuration
PUMP_FUN_URL=https://pump.fun/token/
MINUTES_BETWEEN_SENDS=5
```

### 4. Set Up Supabase

1. Create a new Supabase project at [app.supabase.com](https://app.supabase.com)
2. Get your project URL and API key from the Supabase dashboard
3. Run the migration scripts in the `supabase/migrations` folder:
   - Use the Supabase dashboard SQL editor
   - Run each file in order

Alternatively, you can use the Supabase CLI to apply migrations:

```bash
supabase db push
```

### 5. Run the Bot Locally

For development (using polling):

```bash
npm run dev
```

For production (using webhook):

```bash
NODE_ENV=production npm start
```

## Deployment

### Vercel

1. Create a new project on Vercel
2. Link your repository
3. Add environment variables from your `.env` file
4. Deploy the project

### Heroku

1. Create a new app on Heroku
2. Link your repository
3. Add environment variables from your `.env` file
4. Deploy the project

### DigitalOcean App Platform

1. Create a new app on DigitalOcean App Platform
2. Link your repository
3. Add environment variables from your `.env` file
4. Deploy the project

## Bot Commands

| Command    | Description                           | Access Level |
|------------|---------------------------------------|--------------|
| /start     | Start the bot and see welcome message | Everyone     |
| /info      | Learn how the fair-launch works       | Everyone     |
| /register  | Join the Falcon Insiders Club         | Everyone     |
| /status    | Check distribution status             | Everyone     |
| /help      | Show available commands               | Everyone     |
| /launch    | Begin token distribution              | Admin only   |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.