/script.js/
let scores = { player1: 0, player2: 0 };
let currentPlayer = 'player1';
let flippedCards = [];
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const currentPlayerElement = document.getElementById('currentPlayer');
const resetButton = document.getElementById('resetButton');

const img = [
    "images/aeroplane.jpg", "images/aeroplane-match.jpg",
    "images/cat.jpg", "images/cat-match.jpg",
    "images/crocodile.jpg", "images/crocodile-match.jpg", 
    "images/dog.jpg", "images/dog-match.jpg",
    "images/elephant.jpg", "images/elephant-match.jpg",
    "images/fish.jpg", "images/fish-match.jpg",
    "images/lion.jpg", "images/lion-match.jpg",
    "images/snake.jpg", "images/snake-match.jpg"
];

fetch('cards.json')
  .then(response => response.json())
  .then(cards => {
    initializeGame(cards);
  })
  .catch(error => console.error('Error loading cards.json:', error));

function initializeGame(cards) {
  gameBoard.innerHTML = ''; // Clear the board for a new game
  cards = shuffle(cards);

  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id;
    cardElement.dataset.pair = card.pair;

    const cardImage = document.createElement('img');
    cardImage.src = card.img;
    cardImage.alt = card.pair;
    cardImage.classList.add('hidden');

    cardElement.appendChild(cardImage);
    gameBoard.appendChild(cardElement);
  });

  addCardListeners();
  resetScores();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function addCardListeners() {
  gameBoard.addEventListener('click', event => {
    const clickedCard = event.target.closest('.card');

    if (!clickedCard || flippedCards.includes(clickedCard) || clickedCard.classList.contains('matched')) {
      return;
    }

    revealCard(clickedCard);
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;

      if (firstCard.dataset.pair === secondCard.dataset.pair) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        scores[currentPlayer]++;
        updateScores();
        flippedCards = [];
        checkGameEnd();
      } else {
        setTimeout(() => {
          hideCard(firstCard);
          hideCard(secondCard);
          flippedCards = [];
          switchTurn();
        }, 1000);
      }
    }
  });
}

function revealCard(card) {
  const img = card.querySelector('img');
  img.classList.remove('hidden');
  card.classList.add('flipped');
}

function hideCard(card) {
  const img = card.querySelector('img');
  img.classList.add('hidden');
  card.classList.remove('flipped');
}

function switchTurn() {
  currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
  currentPlayerElement.textContent = currentPlayer === 'player1' ? 'Player 1' : 'Player 2';
}

function updateScores() {
  player1ScoreElement.textContent = scores.player1;
  player2ScoreElement.textContent = scores.player2;
}

function checkGameEnd() {
  const matchedCards = document.querySelectorAll('.card.matched').length;
  const totalCards = document.querySelectorAll('.card').length;

  if (matchedCards === totalCards) {
    const winner =
      scores.player1 > scores.player2
        ? 'Player 1 wins!'
        : scores.player1 < scores.player2
        ? 'Player 2 wins!'
        : 'It\'s a tie!';
        alert(`${winner}\nPlayer 1 Score: ${scores.player1}\nPlayer 2 Score: ${scores.player2}`);


  }
}

function resetScores() {
  scores = { player1: 0, player2: 0 };
  currentPlayer = 'player1';
  updateScores();
  currentPlayerElement.textContent = 'Player 1';
}

// Reset button functionality
resetButton.addEventListener('click', () => {
  fetch('cards.json')
    .then(response => response.json())
    .then(cards => {
      initializeGame(cards);
    })
    .catch(error => console.error('Error loading cards.json:', error));
});