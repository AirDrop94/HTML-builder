const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {

    await fs.promises.rm(targetDir, { recursive: true, force: true });
    await fs.promises.mkdir(targetDir, { recursive: true });

    const files = await fs.promises.readdir(sourceDir);

    for (const file of files) {
        const sourceFile = path.join(sourceDir, file);
        const targetFile = path.join(targetDir, file);
        
        const stat = await fs.promises.stat(sourceFile);
        if (stat.isFile()) {
          await fs.promises.copyFile(sourceFile, targetFile);
        } else if (stat.isDirectory()) {
          await copyDir(sourceFile, targetFile);
        }
    }
      console.log('Directory copied successfully.');
    } catch (err) {
      console.error(`Error copying directory: ${err.message}`);
  }
}

copyDir();