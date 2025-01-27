const fs = require('fs');
const path = require('path');

// Function to check if a file exists
function checkFile(filePath, fileName) {
  if (fs.existsSync(filePath)) {
    console.log(`${fileName} exists.`);
  } else {
    console.error(`${fileName} is missing.`);
    process.exit(1);  // Exit with error if file is missing
  }
}

// Check if index.html exists and contains basic structure
const indexFilePath = path.join(__dirname, 'index.html');
checkFile(indexFilePath, 'index.html');

// Simple check for the presence of <html> and <body> tags in index.html
try {
  const indexContent = fs.readFileSync(indexFilePath, 'utf-8');
  if (indexContent.includes('<html>') && indexContent.includes('<body>')) {
    console.log('index.html contains basic HTML structure.');
  } else {
    console.error('index.html does not contain basic HTML structure.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading index.html:', error);
  process.exit(1);
}

// Check if style.css exists
const styleFilePath = path.join(__dirname, 'style.css');
checkFile(styleFilePath, 'style.css');

// Simple check for the presence of some basic styles in style.css
try {
  const styleContent = fs.readFileSync(styleFilePath, 'utf-8');
  if (styleContent.includes('body') || styleContent.includes('div')) {
    console.log('style.css contains basic styles.');
  } else {
    console.error('style.css does not contain any basic styles.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading style.css:', error);
  process.exit(1);
}

// Check if script.js exists
const scriptFilePath = path.join(__dirname, 'script.js');
checkFile(scriptFilePath, 'script.js');

// Check if script.js contains basic functionality (e.g., some functions or variables)
try {
  const scriptContent = fs.readFileSync(scriptFilePath, 'utf-8');
  if (scriptContent.includes('function') || scriptContent.includes('var') || scriptContent.includes('let') || scriptContent.includes('const')) {
    console.log('script.js contains basic JavaScript functionality.');
  } else {
    console.error('script.js does not contain any basic JavaScript functionality.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error reading script.js:', error);
  process.exit(1);
}

// If all checks pass, exit with success
console.log('All required files and basic functionality are in place.');
process.exit(0);  // Success
