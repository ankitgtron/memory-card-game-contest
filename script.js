// Write your code here
// Write your code here
const gameBoard = document.getElementById('gameBoard');
const moveCountDisplay = document.getElementById('moveCount');
const timerDisplay = document.getElementById('timer');
const leaderboardList = document.getElementById('leaderboardList');

let cards = [];
let flippedCards = [];
let moveCount = 0;
let timer = 0;
let timerInterval;
let matchedPairs = 0;

const cardImages = [
    'aeroplane.jpg', 'cat.jpg', 'crocodile.jpg', 'dog.jpg',
    'elephant.jpg', 'fish.jpg', 'lion.jpg', 'snake.jpg'
];


const cardDeck = [...cardImages, ...cardImages];


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function initGame() {
    shuffle(cardDeck);
    gameBoard.innerHTML = '';
    flippedCards = [];
    moveCount = 0;
    matchedPairs = 0;
    moveCountDisplay.textContent = moveCount;
    timerDisplay.textContent = timer;
    clearInterval(timerInterval);
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);

    cardDeck.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}


function flipCard() {
    if (this.classList.contains('matched') || flippedCards.length === 2) {
        return;
    }

    this.classList.add('flipped');
    this.style.backgroundImage = `url('images/${this.dataset.image}')`;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moveCount++;
        moveCountDisplay.textContent = moveCount;
        setTimeout(checkMatch, 500);
    }
}


function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;

        if (matchedPairs === cardImages.length) {
            clearInterval(timerInterval);
            updateLeaderboard();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.style.backgroundImage = '';
            card2.style.backgroundImage = '';
        }, 500);
    }

    flippedCards = [];
}


function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ time: timer, moves: moveCount });
    leaderboard.sort((a, b) => a.time - b.time);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    displayLeaderboard();
}


function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardList.innerHTML = leaderboard
        .slice(0, 5)
        .map((entry, index) => `<li>#${index + 1}: Time - ${entry.time}s, Moves - ${entry.moves}</li>`)
        .join('');
}

initGame();
displayLeaderboard();

