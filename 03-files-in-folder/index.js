const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return console.error(`Error reading directory: ${err.message}`);
    }

    files.forEach(file => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
            
      fs.stat(filePath, (err, stats) => {
      if (err) {
        return console.error(`Error getting file stats: ${err.message}`);
      }
                
        const fileSizeInKB = stats.size / 1024;
        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, path.extname(file.name));
                
        console.log(`${fileName} - ${fileExt} - ${fileSizeInKB.toFixed(3)}kb`);
      });
    }
  });
});