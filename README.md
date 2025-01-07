# BOTIS Project

Welcome to the BOTIS Project! This project consists of a Telegram bot and an Express server for managing and serving video files and their thumbnails.

## Features

- **Telegram Bot (bot.js):**
  - Listens for incoming messages and responds to users.
  - Retrieves video data from the server and sends video files to users.
  - Downloads video files and schedules their deletion after 1 hour.

- **Express Server (server.js):**
  - Serves video files and thumbnails.
  - Creates thumbnails for new videos using `ffmpeg`.
  - Watches for changes in the video directory using `chokidar` and updates accordingly.
  - Provides video data as JSON and serves specific video files.

## Folder Structure

BOTIS
├── datavideos
│   ├── download videos
│   │   ├── 5102361-hd_1920_1080_25fps.mp4
│   ├── my videos
│   │   ├── 5738746-hd_1920_1080_30fps.mp4
├── node_modules
├── tele-bot telegram-bot
│   ├── node_modules
│   ├── src
│   │   ├── temp_videos
│   │   ├── bot.js
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
├── videolinks
│   ├── node_modules
│   ├── public
│   │   ├── style.css
│   │   ├── thumbnails
│   │   │   ├── download videos_1109.mp4.png
│   │   │   ├── download videos_5102361-hd_1920_1080_25fps.mp4.png
│   │   │   ├── download videos_5738746-hd_1920_1080_30fps.mp4.png
│   │   │   ├── my videos_4225150-uhd_3840_2160_30fps.mp4.png
│   │   │   ├── my videos_4846656-hd_1920_1080_30fps.mp4.png
│   ├── views
│   │   ├── index.ejs
│   ├── nodemon.json
│   ├── package-lock.json
│   ├── package.json
│   ├── server.cert
│   ├── server.js
│   ├── server.key
├── .gitignore
├── package-lock.json
├── package.json
├── README.md



## Setup

### Prerequisites

- Node.js installed on your machine.
- `ffmpeg` and `ffprobe` installed and their paths configured.
- Telegram Bot API token (store it in a `.env` file).

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd BOTIS

# For the Telegram bot
cd tele-bot\ telegram-bot
npm install

# For the Express server
cd ..\videolinks
npm install

Create a .env file in the tele-bot\ telegram-bot directory with the following content:
BOT_TOKEN=your_telegram_bot_token


cd videolinks
node server.js

cd tele-bot\ telegram-bot\src
node bot.js

#Interact with your Telegram bot and use the provided web server to manage and serve video files and thumbnails.

License
This project is licensed under the MIT License.

Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

Acknowledgments
Thanks to the creators of node-telegram-bot-api, axios, ffmpeg, chokidar, and other libraries used in this project."# tele-bot-useing-js" 
