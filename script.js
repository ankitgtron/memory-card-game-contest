// Write your code here
// Write your code here
const cardsArray = [
  { name: 'card1', img: './images/aeroplane-match.jpg' },
  { name: 'card2', img: './images/cat-match.jpg' },
  { name: 'card3', img: './images/crocodile-match.jpg' },
  { name: 'card4', img: './images/dog-match.jpg' },
  { name: 'card5', img: './images/elephant-match.jpg' },
  { name: 'card6', img: './images/fish-match.jpg' },
  { name: 'card7', img: './images/lion-match.jpg' },
  { name: 'card8', img: './images/snake-match.jpg' },
];

let shuffledCards = [...cardsArray, ...cardsArray]; // Duplicate cards for pairs
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer;
let time = 0;

const moveCountElement = document.getElementById('move-count');
const timeElement = document.getElementById('time');
const cardGrid = document.getElementById('card-grid');
const restartButton = document.getElementById('restart-btn');

function shuffleCards() {
  shuffledCards = shuffledCards.sort(() => Math.random() - 0.5);
}

function createCard(card) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.setAttribute('data-name', card.name);

  const cardImg = document.createElement('img');
  cardImg.setAttribute('src', card.img);
  cardElement.appendChild(cardImg);

  cardElement.addEventListener('click', flipCard);
  return cardElement;
}

function displayCards() {
  shuffledCards.forEach(card => {
      const cardElement = createCard(card);
      cardGrid.appendChild(cardElement);
  });
}

function flipCard() {
  if (flippedCards.length === 2 || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
      checkMatch();
  }
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  moves++;
  moveCountElement.textContent = moves;

  if (firstCard.getAttribute('data-name') === secondCard.getAttribute('data-name')) {
      matchedCards.push(firstCard, secondCard);
      flippedCards = [];

      if (matchedCards.length === shuffledCards.length) {
          clearInterval(timer);
          alert(Congratulations! You won the game in ${moves} moves and ${time} seconds.);
      }
  } else {
      setTimeout(() => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          flippedCards = [];
      }, 1000);
  }
}

function startTimer() {
  timer = setInterval(() => {
      time++;
      timeElement.textContent = time;
  }, 1000);
}

function restartGame() {
  moves = 0;
  time = 0;
  moveCountElement.textContent = moves;
  timeElement.textContent = time;
  matchedCards = [];
  flippedCards = [];
  cardGrid.innerHTML = '';
  shuffleCards();
  displayCards();
  startTimer();
}

restartButton.addEventListener('click', restartGame);

shuffleCards();
displayCards();
startTimer();
