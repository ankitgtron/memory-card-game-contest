const jsonData = [
  { "id": 1, "pair": "A", "img": "images/aeroplane.jpg" },
  { "id": 2, "pair": "A", "img": "images/aeroplane-match.jpg" },
  { "id": 3, "pair": "B", "img": "images/cat.jpg" },
  { "id": 4, "pair": "B", "img": "images/cat-match.jpg" },
  { "id": 5, "pair": "C", "img": "images/crocodile.jpg" },
  { "id": 6, "pair": "C", "img": "images/crocodile-match.jpg" },
  { "id": 7, "pair": "D", "img": "images/dog.jpg" },
  { "id": 8, "pair": "D", "img": "images/dog-match.jpg" },
  { "id": 9, "pair": "E", "img": "images/elephant.jpg" },
  { "id": 10, "pair": "E", "img": "images/elephant-match.jpg" },
  { "id": 11, "pair": "F", "img": "images/fish.jpg" },
  { "id": 12, "pair": "F", "img": "images/fish-match.jpg" },
  { "id": 13, "pair": "G", "img": "images/lion.jpg" },
  { "id": 14, "pair": "G", "img": "images/lion-match.jpg" },
  { "id": 15, "pair": "H", "img": "images/snake.jpg" },
  { "id": 16, "pair": "H", "img": "images/snake-match.jpg" }
];

// Shuffle the JSON data to randomize card positions
const shuffledData = [...jsonData].sort(() => Math.random() - 0.5);

const cardContainer = document.getElementById('card-container');
let firstCard = null;
let secondCard = null;
let score = 0;

// Dynamically generate cards
shuffledData.forEach(item => {

    
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.pair = item.pair;

  const placeholder = document.createElement('div');
  placeholder.classList.add('placeholder');
  placeholder.textContent = '?';

  const img = document.createElement('img');
  img.src = item.img;
  img.alt = `Image of ${item.pair}`;

  card.appendChild(placeholder);
  card.appendChild(img);

  card.addEventListener('click', () => handleCardClick(card));
  cardContainer.appendChild(card);
});

function handleCardClick(card) {
  // Prevent clicking on the same card twice
  if (card.classList.contains('flipped') || secondCard) return;

  card.classList.add('flipped');

  if (!firstCard) {
    // First card clicked
    firstCard = card;
  } else {
    // Second card clicked
    secondCard = card;

    // Check for a match
    if (firstCard.dataset.pair === secondCard.dataset.pair) {
      score++;
      updateScore();
      resetCards(true);
    } else {
      setTimeout(() => resetCards(false), 1000);
    }
  }
}

function resetCards(isMatch) {
  if (!isMatch) {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
  }
  firstCard = null;
  secondCard = null;
}

function updateScore() {
  document.getElementById('score').textContent = score;
}
