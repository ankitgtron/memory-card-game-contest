const gameBoard = document.querySelector('game-board');
const movesDisplay = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');

const images = [
    'images/cat.jpg',
    'images/crocodile.jpg',
    'images/dog.jpg',
    'images/elephant.jpg',
    'images/fish.jpg',
    'images/lion.jpg',
    'images/snake.jpg',
    'images/aeroplane.jpg'
];
const gameImages = [...images, ...images];
let moves = 0;
let flippedCards = [];
let matchedPairs = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = image;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.style.backgroundImage = `url(${this.dataset.image})`; // Show the image
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === images.length) {
            setTimeout(() => alert(`Congratulations! You won in ${moves} moves!`), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.style.backgroundImage = '';
            card2.style.backgroundImage = '';
            flippedCards = [];
        }, 1000);
    }
}

function initializeGame() {
    gameBoard.innerHTML = '';
    moves = 0;
    movesDisplay.textContent = moves;
    matchedPairs = 0;
    flippedCards = [];

    const shuffledImages = shuffleArray(gameImages);
    shuffledImages.forEach(image => {
        const card = createCard(image);
        gameBoard.appendChild(card);
    });
}

restartBtn.addEventListener('click', initializeGame);

initializeGame();
