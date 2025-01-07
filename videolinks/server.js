const express = require('express');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const chokidar = require('chokidar');
const https = require('https');

// Replace these paths with the actual paths to your ffmpeg and ffprobe executables
const ffmpegPath = 'C:/ffmpeg/bin/ffmpeg.exe';
const ffprobePath = 'C:/ffmpeg/bin/ffprobe.exe';

const app = express();
const port = 8080; // Use any available port

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Define the folder containing videos and thumbnails
const videoFolder = path.join(__dirname, '../datavideos');
const thumbnailFolder = path.join(__dirname, 'thumbnails');

// Check if the folders exist
if (!fs.existsSync(videoFolder)) {
  console.error(`Folder not found: ${videoFolder}`);
  process.exit(1); // Exit the application if the folder does not exist
}
if (!fs.existsSync(thumbnailFolder)) {
  fs.mkdirSync(thumbnailFolder); // Create the thumbnails folder if it does not exist
}

// Set the paths for ffmpeg and ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

let categories = {};

// Function to create a thumbnail for a video
const createThumbnail = (video, category) => {
  const videoPath = path.join(videoFolder, category, video);
  const thumbnailPath = path.join(thumbnailFolder, `${category}_${video}.png`);
  if (!fs.existsSync(thumbnailPath)) {
    console.log(`Creating thumbnail for: ${category}/${video}`);
    // Use ffmpeg to create a thumbnail
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['50%'],
        filename: `${category}_${video}.png`,
        folder: thumbnailFolder,
        size: '120x90'
      })
      .on('end', () => {
        console.log(`Thumbnail created at: ${thumbnailPath}`);
      })
      .on('error', (err) => {
        console.error(`Error creating thumbnail for ${category}/${video}:`, err);
      });
  }
};

// Function to refresh the list of categories and videos
const refreshCategories = () => {
  categories = {};
  const categoryFolders = fs.readdirSync(videoFolder);
  categoryFolders.forEach(category => {
    const categoryPath = path.join(videoFolder, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
      categories[category] = fs.readdirSync(categoryPath).filter(file => file.endsWith('.mp4'));
      categories[category].forEach(video => {
        createThumbnail(video, category);
      });
    }
  });
};

// Initial refresh
refreshCategories();

// Watch for changes in the video folder using chokidar
const watcher = chokidar.watch(videoFolder, { persistent: true, depth: 2 });

watcher
  .on('add', (filePath) => {
    const relativePath = path.relative(videoFolder, filePath);
    const parts = relativePath.split(path.sep);
    if (parts.length === 2) {
      const [category, video] = parts;
      if (video.endsWith('.mp4')) {
        createThumbnail(video, category); // Create thumbnail for the new video
        refreshCategories(); // Refresh the list of categories and videos
      }
    }
  })
  .on('unlink', (filePath) => {
    const relativePath = path.relative(videoFolder, filePath);
    const parts = relativePath.split(path.sep);
    if (parts.length === 2) {
      const [category, video] = parts;
      const thumbnailPath = path.join(thumbnailFolder, `${category}_${video}.png`);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath); // Remove the corresponding thumbnail
      }
      refreshCategories(); // Refresh the list of categories and videos
    }
  })
  .on('unlinkDir', (dirPath) => {
    const category = path.relative(videoFolder, dirPath);
    const thumbnails = fs.readdirSync(thumbnailFolder).filter(file => file.startsWith(`${category}_`));
    thumbnails.forEach(thumbnail => {
      fs.unlinkSync(path.join(thumbnailFolder, thumbnail)); // Remove all thumbnails for the deleted category
    });
    refreshCategories(); // Refresh the list of categories and videos
  });

// Serve video files and thumbnails
app.use('/thumbnails', express.static(thumbnailFolder));

app.get('/', (req, res) => {
  refreshCategories(); // Refresh the list of categories before rendering
  res.render('index', { categories });
});

// Serve video data as JSON
app.get('/videos', (req, res) => {
  refreshCategories(); // Refresh the list of categories before sending data
  res.json(categories);
});

// Serve a specific video file
app.get('/video/:category/:video', (req, res) => {
  const videoPath = path.join(videoFolder, req.params.category, req.params.video);
  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).send('Video not found');
  }
});

app.get('/:category/:video', (req, res) => {
  const videoPath = path.join(videoFolder, req.params.category, req.params.video);
  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).send('Video not found');
  }
});

// Read the SSL certificate and key
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

// Start the HTTPS server
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
