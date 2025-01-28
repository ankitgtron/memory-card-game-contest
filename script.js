// Write your code here
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.getElementById('score');
let score = 0;

fetch('cards.json')
  .then(response => response.json())
  .then(cardsData => {
    const cards = shuffle([...cardsData, ...cardsData]); 
    createCards(cards);
  });

function createCards(cards) {
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.pair = card.pair;

    const img = document.createElement('img');
    img.src = card.img;
    cardElement.appendChild(img);

    gameContainer.appendChild(cardElement);

    cardElement.addEventListener('click', () => handleCardClick(cardElement));
  });
}

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function handleCardClick(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;

    if (firstCard.dataset.pair === secondCard.dataset.pair) {
      
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      updateScore(1); 
      resetCards();
    } else {
      
      updateScore(0); 
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetCards();
      }, 1000);
    }
  }
}

function resetCards() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateScore(points) {
  score += points;
  scoreElement.textContent = score;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
