// Write your code here
const CARD_IMAGES = [
    'images/aeroplane.jpg',
    'images/cat-match.jpg',
    'images/crocodile-match.jpg',
    'images/dog-match.jpg',
    'images/elephant-match.jpg',
    'images/fish-match.jpg',
    'images/lion-match.jpg',
    'images/snake-match.jpg'
];

let cards = [];
let flippedCards = [];
let moves = 0;
let gameStarted = false;
let gameCompleted = false;
let timer;
let seconds = 0;
let bestTime = localStorage.getItem('bestTime') ? parseInt(localStorage.getItem('bestTime')) : null;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateCards() {
    const pairs = [...CARD_IMAGES, ...CARD_IMAGES]; 
    return pairs
        .map((imagePath, index) => ({
            id: index,
            imagePath: imagePath,
            isFlipped: false,
            isMatched: false
        }))
        .sort(() => Math.random() - 0.5);
}

function preloadImages() {
    CARD_IMAGES.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
    });
}

function createCardElements() {
    const gameBoard = document.querySelector('.memory-game');
    gameBoard.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-id', card.id);
        
        cardElement.innerHTML = `
            <div class="card-front">
                <img src="${card.imagePath}" alt="card">
            </div>
            <div class="card-back">?</div>
        `;
        
        cardElement.addEventListener('click', () => handleCardClick(card));
        gameBoard.appendChild(cardElement);
    });
}

function handleCardClick(clickedCard) {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    const cardElement = document.querySelector(`[data-id="${clickedCard.id}"]`);

    if (
        flippedCards.length === 2 || 
        clickedCard.isFlipped || 
        clickedCard.isMatched ||
        flippedCards.some(card => card.id === clickedCard.id)
    ) {
        return;
    }

    cardElement.classList.add('flip');
    clickedCard.isFlipped = true;
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;

        if (flippedCards[0].imagePath === flippedCards[1].imagePath) {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.isMatched = true;
                });
                flippedCards = [];
                checkGameCompletion();
            }, 500);
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => {
                    const element = document.querySelector(`[data-id="${card.id}"]`);
                    element.classList.remove('flip');
                    card.isFlipped = false;
                });
                flippedCards = [];
            }, 1000);
        }
    }
}

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(() => {
        seconds++;
        document.getElementById('time').textContent = formatTime(seconds);
    }, 1000);
}

function checkGameCompletion() {
    const allPairsMatched = cards.every(card => card.isMatched);

    if (allPairsMatched) {
        clearInterval(timer);
        gameCompleted = true;

        leaderboard.push({ time: seconds, moves });
        leaderboard.sort((a, b) => a.time - b.time);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        if (!bestTime || seconds < bestTime) {
            bestTime = seconds;
            localStorage.setItem('bestTime', bestTime);
            document.getElementById('best-time').textContent = formatTime(bestTime);
        }

        const winMessage = document.getElementById('win-message');
        document.getElementById('final-time').textContent = formatTime(seconds);
        document.getElementById('final-moves').textContent = moves;
        winMessage.style.display = 'block';
    }
}

function start() {
    clearInterval(timer);
    seconds = 0;
    moves = 0;
    gameStarted = false;
    gameCompleted = false;
    flippedCards = [];

    document.getElementById('time').textContent = '0:00';
    document.getElementById('moves').textContent = '0';
    document.getElementById('win-message').style.display = 'none';

    if (bestTime) {
        document.getElementById('best-time').textContent = formatTime(bestTime);
    }

    cards = generateCards();
    createCardElements();
}

function toggleLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard');
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = leaderboard.map((entry, index) => `
        <li>#${index + 1} - Time: ${formatTime(entry.time)}, Moves: ${entry.moves}</li>
    `).join('');
    leaderboardElement.style.display = leaderboardElement.style.display === 'block' ? 'none' : 'block';
}

window.onload = function() {
    preloadImages();
    start();
};
