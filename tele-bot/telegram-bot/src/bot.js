const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create a new bot instance
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Ensure the temp_videos directory exists
const tempVideosDir = path.join(__dirname, 'temp_videos');
if (!fs.existsSync(tempVideosDir)) {
    fs.mkdirSync(tempVideosDir);
}

// Listen for incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const response = 'Hello! I am your Telegram bot. How can I assist you today?';

    // Send a response to the user
    bot.sendMessage(chatId, response);

    // Send a request to the server to get video data
    try {
        const serverResponse = await axios.get('https://e89d-2405-201-680a-c177-a4b5-3af1-8547-9137.ngrok-free.app/videos');
        const videoData = serverResponse.data;
        console.log('Video data:', videoData);

        // Send video files to the user
        for (const category in videoData) {
            for (const video of videoData[category]) {
                const videoUrl = `https://e89d-2405-201-680a-c177-a4b5-3af1-8547-9137.ngrok-free.app/video/${category}/${video}`;
                const videoPath = path.join(tempVideosDir, `${category}_${video}`);

                // Download the video file
                const videoResponse = await axios({
                    url: videoUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                // Save the video file locally
                const writer = fs.createWriteStream(videoPath);
                videoResponse.data.pipe(writer);

                writer.on('finish', async () => {
                    // Send the video file to the user
                    try {
                        await bot.sendVideo(chatId, videoPath);
                        // Inform the user that the video will be deleted in 1 hour
                        bot.sendMessage(chatId, 'The video will be deleted in 1 hour.');

                        // Schedule the video file for deletion after 1 hour
                        setTimeout(() => {
                            fs.readdir(tempVideosDir, (err, files) => {
                                if (err) {
                                    console.error('Error reading temp_videos directory:', err);
                                    return;
                                }
                                files.forEach(file => {
                                    const filePath = path.join(tempVideosDir, file);
                                    fs.unlink(filePath, (err) => {
                                        if (err) {
                                            console.error('Error deleting video file:', err);
                                        } else {
                                            console.log(`Video file deleted: ${filePath}`);
                                        }
                                    });
                                });
                            });
                        }, 3600000); // 1 hour in milliseconds
                    } catch (err) {
                        console.error('Error sending video:', err);
                        bot.sendMessage(chatId, 'Sorry, there was an error sending the video.');
                    }
                });

                writer.on('error', (err) => {
                    console.error('Error writing video file:', err);
                    bot.sendMessage(chatId, 'Sorry, there was an error downloading the video.');
                });
            }
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
        bot.sendMessage(chatId, 'Sorry, I could not retrieve the video data.');
    }
});

// Log when the bot is started
console.log('Bot is up and running...');