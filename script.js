// Write your code here
// Write your code here
const board = document.getElementById('game-board');
const movesCounter = document.getElementById('moves-count');
const timeCounter = document.getElementById('time-count');

let cardsArray = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let moves = 0;
let time = 0;
let timer;


const cardImages = [
    './images/aeroplane.jpg',
    './images/cat.jpg',
    './images/dog.jpg',
    './images/snake.jpg',
    './images/fish.jpg',
    './images/lion.jpg',
    './images/fish-match.jpg',
    './images/lion-match.jpg',
];


function generateCards() {
    cardsArray = [...cardImages, ...cardImages]
        .sort(() => Math.random() - 0.5)
        .map(image => ({ image, matched: false }));
}

// Start the timer
function startTimer() {
    timer = setInterval(() => {
        time++;
        timeCounter.textContent = time;
    }, 1000);
}

// Reset the game
function resetGame() {
    board.innerHTML = '';
    moves = 0;
    time = 0;
    movesCounter.textContent = moves;
    timeCounter.textContent = time;
    clearInterval(timer);
    generateCards();
    createBoard();
    startTimer();
}

// Create the game board (4x4 grid)
function createBoard() {
    board.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4 columns
    cardsArray.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;

        const img = document.createElement('img');
        img.src = card.image;
        img.alt = `Card ${index}`;
        cardElement.appendChild(img);

        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });
}

// Flip the card
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

// Check if two flipped cards match
function checkForMatch() {
    const firstIndex = firstCard.dataset.index;
    const secondIndex = secondCard.dataset.index;

    if (cardsArray[firstIndex].image === cardsArray[secondIndex].image) {
        cardsArray[firstIndex].matched = true;
        cardsArray[secondIndex].matched = true;
        disableCards();
    } else {
        unflipCards();
    }

    moves++;
    movesCounter.textContent = moves;
}

// Disable matched cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();

    if (cardsArray.every(card => card.matched)) {
        clearInterval(timer);
        alert(`Congratulations! You finished the game in ${time} seconds and ${moves} moves.`);
    }
}

// Unflip non-matching cards
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset the board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Initialize the game
resetGame();
