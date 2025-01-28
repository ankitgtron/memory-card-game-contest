// Select game elements
const gameBoard = document.getElementById('board');
const moveCounter = document.getElementById('counter');
const timer = document.getElementById('timer');
const leaderboard = document.getElementById('leaderboard');
const difficultySelect = document.getElementById('difficulty');
const startGameButton = document.getElementById('btn-start');

// Game state variables
let firstCard = null;
let secondCard = null;
let moves = 0;
let time = 0;
let timerInterval;

const allCards = [
  'aeroplane', 'cat', 'crocodile', 'dog', 'elephant', 'fish', 'lion', 'snake',
  'tiger', 'bear', 'whale', 'dolphin', 'frog', 'bird', 'monkey', 'rabbit'
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getCardsByDifficulty() {
//   const difficulty = difficultySelect.value;
  let numPairs;
  numPairs = 8;  

  const selectedCards = allCards.slice(0, numPairs);
  return shuffle([...selectedCards, ...selectedCards]);
}

function startGame() {
  const shuffledCards = getCardsByDifficulty();
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(shuffledCards.length)}, 1fr)`;

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
  updateLeaderboard();
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

    const allCards = document.querySelectorAll('.card');
    const allMatched = [...allCards].every(card => card.classList.contains('flipped'));
    if (allMatched) {
      clearInterval(timerInterval); 
      saveScore(time, moves); 
      alert(`Congratulations! You've completed the game in ${time} seconds and ${moves} moves.`);
    }
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

function saveScore(time, moves) {
  const difficulty = difficultySelect.value;
  const scores = JSON.parse(localStorage.getItem(`leaderboard-${difficulty}`)) || [];
  scores.push({ time, moves });
  scores.sort((a, b) => a.time - b.time); // Sort by time (ascending)
  localStorage.setItem(`leaderboard-${difficulty}`, JSON.stringify(scores.slice(0, 5))); // Keep top 5 scores
  updateLeaderboard();
}

function updateLeaderboard() {
  const difficulty = difficultySelect.value;
  const scores = JSON.parse(localStorage.getItem(`leaderboard-${difficulty}`)) || [];
  leaderboard.innerHTML = `<h3>Leaderboard (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})</h3>`;
  scores.forEach((score, index) => {
    const scoreElement = document.createElement('p');
    scoreElement.textContent = `${index + 1}. Time: ${score.time}s, Moves: ${score.moves}`;
    leaderboard.appendChild(scoreElement);
  });
}

startGameButton.addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', updateLeaderboard);