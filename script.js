// Write your code here
const gameBoard = document.getElementById('game-board');
const moveCounter = document.getElementById('move-counter');
const timer = document.getElementById('timer');

let firstCard = null;
let secondCard = null;
let moves = 0;
let time = 0;
let timerInterval;

const cards = [
  'aeroplane', 'cat', 'crocodile', 'dog', 'elephant', 'fish', 'lion', 'snake',
  'aeroplane', 'cat', 'crocodile', 'dog', 'elephant', 'fish', 'lion', 'snake'
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  const shuffledCards = shuffle(cards);
  gameBoard.innerHTML = '';
  shuffledCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.card = card;
    cardElement.innerHTML = `<img src="images/${card}.jpg" alt="${card}">`;
    cardElement.addEventListener('click', flipCard);
    gameBoard.appendChild(cardElement);
  });
  moves = 0;
  moveCounter.textContent = moves;
  time = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function flipCard() {
  if (this === firstCard || this.classList.contains('flipped')) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  moveCounter.textContent = moves;

  if (firstCard.dataset.card === secondCard.dataset.card) {
    firstCard = null;
    secondCard = null;
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard = null;
      secondCard = null;
    }, 1000);
  }
}

function updateTimer() {
  time++;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', startGame);
