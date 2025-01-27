// Select game elements
const gameBoard = document.getElementById('game-board');
const moveCounter = document.getElementById('move-counter');
const timer = document.getElementById('timer');
const leaderboard = document.getElementById('leaderboard');
const difficultySelect = document.getElementById('difficulty');
const startGameButton = document.getElementById('start-game');

// Game state variables
let firstCard = null;
let secondCard = null;
let moves = 0;
let time = 0;
let timerInterval;

// Card data
const allCards = [
  'aeroplane', 'cat', 'crocodile', 'dog', 'elephant', 'fish', 'lion', 'snake',
  'tiger', 'bear', 'whale', 'dolphin', 'frog', 'bird', 'monkey', 'rabbit'
];

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Get cards based on difficulty level
function getCardsByDifficulty() {
  const difficulty = difficultySelect.value;
  let numPairs;
  if (difficulty === 'easy') numPairs = 3; // 6 cards
  else if (difficulty === 'medium') numPairs = 5; // 10 cards
  else numPairs = 8; // 16 cards

  const selectedCards = allCards.slice(0, numPairs);
  return shuffle([...selectedCards, ...selectedCards]);
}

// Start the game
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

  // Reset game state
  moves = 0;
  moveCounter.textContent = moves;
  time = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  updateLeaderboard();
}

// Flip card logic
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
    // Match found
    firstCard = null;
    secondCard = null;

    // Check if all cards are matched
    const allCards = document.querySelectorAll('.card');
    const allMatched = [...allCards].every(card => card.classList.contains('flipped'));
    if (allMatched) {
      clearInterval(timerInterval); // Stop the timer
      saveScore(time, moves); // Save score to leaderboard
      alert(`Congratulations! You've completed the game in ${time} seconds and ${moves} moves.`);
    }
  } else {
    // No match, flip back after 1 second
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard = null;
      secondCard = null;
    }, 1000);
  }
}

// Timer update
function updateTimer() {
  time++;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Save score to local storage
function saveScore(time, moves) {
  const difficulty = difficultySelect.value;
  const scores = JSON.parse(localStorage.getItem(`leaderboard-${difficulty}`)) || [];
  scores.push({ time, moves });
  scores.sort((a, b) => a.time - b.time); // Sort by time (ascending)
  localStorage.setItem(`leaderboard-${difficulty}`, JSON.stringify(scores.slice(0, 5))); // Keep top 5 scores
  updateLeaderboard();
}

// Update leaderboard display
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

// Event listeners
startGameButton.addEventListener('click', startGame);
document.addEventListener('DOMContentLoaded', updateLeaderboard);
