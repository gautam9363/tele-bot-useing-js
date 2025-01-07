# Telegram Bot Project

This project is a simple Telegram bot built using Node.js. It utilizes the Telegram Bot API to interact with users and respond to messages.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd telegram-bot
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your bot token:
   ```
   BOT_TOKEN='your_bot_token_here'
   ```

## Configuration

The bot token is stored in the `.env` file. Make sure to replace `'your_bot_token_here'` with your actual Telegram bot token, which you can obtain by talking to [BotFather](https://t.me/botfather) on Telegram.

## Usage

To start the bot, run the following command:
```
node src/bot.js
```

The bot will listen for incoming messages and respond according to the defined behavior in `src/bot.js`.

## License

This project is licensed under the MIT License.