const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.promises.mkdir(outputDir, { recursive: true });

    const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });
    const cssFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.css');
    const stylesArray = [];

    for (const file of cssFiles) {
      const filePath = path.join(stylesDir, file.name);
      const content = await fs.promises.readFile(filePath, 'utf-8');
      stylesArray.push(content);
    }

    await fs.promises.writeFile(outputFile, stylesArray.join('\n'));

    console.log('Styles merged successfully into bundle.css');
    } catch (err) {
    console.error(`Error merging styles: ${err.message}`);
  }
}

mergeStyles();