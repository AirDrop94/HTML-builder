const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtmlFile = path.join(projectDist, 'index.html');
const outputCssFile = path.join(projectDist, 'style.css');
const outputAssetsDir = path.join(projectDist, 'assets');

async function buildPage() {
  try {
    await fs.promises.rm(projectDist, { recursive: true, force: true });
    await fs.promises.mkdir(projectDist, { recursive: true });
    let templateContent = await fs.promises.readFile(templateFile, 'utf-8');
    const componentFiles = await fs.promises.readdir(componentsDir);
        
    for (const file of componentFiles) {
      const componentPath = path.join(componentsDir, file);
      const componentName = path.basename(file, '.html');
      const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
      templateContent = templateContent.replace(new RegExp(`{{${componentName}}}`, 'g'), componentContent);
    }
    await fs.promises.writeFile(outputHtmlFile, templateContent);

    const styleFiles = await fs.promises.readdir(stylesDir);
    const stylesArray = [];
    for (const file of styleFiles) {
      if (path.extname(file) === '.css') {
        const cssContent = await fs.promises.readFile(path.join(stylesDir, file), 'utf-8');
        stylesArray.push(cssContent);
      }
    }
    await fs.promises.writeFile(outputCssFile, stylesArray.join('\n'));

    async function copyDir(src, dest) {
      await fs.promises.mkdir(dest, { recursive: true });
      const items = await fs.promises.readdir(src, { withFileTypes: true });
      for (const item of items) {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        if (item.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.promises.copyFile(srcPath, destPath);
        }
      }
    }
    await copyDir(assetsDir, outputAssetsDir);
    console.log('Page build completed successfully.');
  } catch (err) {
    console.error(`Error during build: ${err.message}`);
  }
}

buildPage();