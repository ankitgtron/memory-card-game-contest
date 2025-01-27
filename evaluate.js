const fs = require('fs');
const assert = require('assert');

// Check if the required files exist

// 1. Check if index.html exists
if (!fs.existsSync('index.html')) {
  console.error('index.html file is missing.');
  process.exit(1);  // Exit with error if index.html is missing
} else {
  console.log('index.html file exists.');
}

// 2. Check if cards.json exists
if (!fs.existsSync('cards.json')) {
  console.error('cards.json file is missing.');
  process.exit(1);  // Exit with error if cards.json is missing
} else {
  console.log('cards.json file exists.');
}

// Read the contents of the cards.json file
const cardsData = JSON.parse(fs.readFileSync('cards.json', 'utf-8'));

// Validate the structure of the cards.json file
try {
  assert(Array.isArray(cardsData), 'cards.json must be an array');
  console.log('cards.json is an array.');

  cardsData.forEach(card => {
    assert(card.hasOwnProperty('id'), 'Each card must have an "id" property');
    assert(card.hasOwnProperty('pair'), 'Each card must have a "pair" property');
    assert(card.hasOwnProperty('img'), 'Each card must have an "img" property');
    assert(typeof card.id === 'number', 'The "id" property must be a number');
    assert(typeof card.pair === 'string', 'The "pair" property must be a string');
    assert(typeof card.img === 'string', 'The "img" property must be a string');
    assert(fs.existsSync(card.img), `Image file ${card.img} does not exist`);
  });

  console.log('All cards in cards.json are valid.');
} catch (error) {
  console.error('Validation error in cards.json:', error.message);
  process.exit(1);  // Exit with error if validation fails
}

// 3. Check if script.js exists
if (!fs.existsSync('script.js')) {
  console.error('script.js file is missing.');
  process.exit(1);  // Exit with error if script.js is missing
} else {
  console.log('script.js file exists.');
}

// 4. Check if style.css exists
if (!fs.existsSync('style.css')) {
  console.error('style.css file is missing.');
  process.exit(1);  // Exit with error if style.css is missing
} else {
  console.log('style.css file exists.');
}

// 5. Check if all image files exist
const imageFiles = [
  'images/aeroplane.jpg', 'images/aeroplane-match.jpg',
  'images/cat.jpg', 'images/cat-match.jpg',
  'images/crocodile.jpg', 'images/crocodile-match.jpg',
  'images/dog.jpg', 'images/dog-match.jpg',
  'images/elephant.jpg', 'images/elephant-match.jpg',
  'images/fish.jpg', 'images/fish-match.jpg',
  'images/lion.jpg', 'images/lion-match.jpg',
  'images/snake.jpg', 'images/snake-match.jpg'
];

imageFiles.forEach(imgPath => {
  if (!fs.existsSync(imgPath)) {
    console.error(`${imgPath} is missing.`);
    process.exit(1);  // Exit with error if any image file is missing
  } else {
    console.log(`${imgPath} exists.`);
  }
});

// End the script
console.log('All files are present and valid.');
process.exit(0);  // Success
