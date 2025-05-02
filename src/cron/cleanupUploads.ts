import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

// Define the uploads folder path
const uploadsDir = path.join(__dirname, '../../uploads');

// Runs every Sunday at 2:00 AM
cron.schedule('0 2 * * 0', () => {
  console.log('Running weekly cleanup job for uploads folder...');

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads folder:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log(`Deleted file: ${file}`);
        }
      });
    });
  });
});
