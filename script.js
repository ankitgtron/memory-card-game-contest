// Write your code here
// Array of image paths - replace these with your actual image paths
const CARD_IMAGES = [
    'images/aeroplane.jpg',
    'images/cat-match.jpg',
    'images/crocodile-match.jpg',
    'images/dog-match.jpg',
    'images/elephant-match.jpg',
    'images/fish-match.jpg',
    'images/lion-match.jpg',
    'images/snake-match.jpg',
    'images/cat.jpg'
      // This will be the single unpaired card
];

let cards = [];
let flippedCards = [];
let moves = 0;
let gameStarted = false;
let gameCompleted = false;
let timer;
let seconds = 0;
let bestTime = localStorage.getItem('bestTime') ? parseInt(localStorage.getItem('bestTime')) : null;

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate cards for the game
function generateCards() {
    // Create pairs of cards (8 pairs = 16 cards)
    const pairs = [...CARD_IMAGES.slice(0, 8), ...CARD_IMAGES.slice(0, 8)];
    // Add the last unpaired card
    const allCards = [...pairs, CARD_IMAGES[8]];
    
    return allCards
        .map((imagePath, index) => ({
            id: index,
            imagePath: imagePath,
            isFlipped: false,
            isMatched: false
        }))
        .sort(() => Math.random() - 0.5);
}

// Preload images
function preloadImages() {
    CARD_IMAGES.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
    });
}

// Create card elements
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

// Handle card clicks
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
    
    // Flip card
    cardElement.classList.add('flip');
    clickedCard.isFlipped = true;
    flippedCards.push(clickedCard);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        if (flippedCards[0].imagePath === flippedCards[1].imagePath) {
            // Match found
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.isMatched = true;
                });
                flippedCards = [];
                checkGameCompletion();
            }, 500);
        } else {
            // No match
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

// Start timer
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(() => {
        seconds++;
        document.getElementById('time').textContent = formatTime(seconds);
    }, 1000);
}

// Check if game is completed
function checkGameCompletion() {
    const allPairsMatched = cards.filter(card => !card.isMatched).length === 1;
    
    if (allPairsMatched) {
        clearInterval(timer);
        gameCompleted = true;
        
        // Update best time
        if (!bestTime || seconds < bestTime) {
            bestTime = seconds;
            localStorage.setItem('bestTime', bestTime);
            document.getElementById('best-time').textContent = formatTime(bestTime);
        }
        
        // Show win message
        const winMessage = document.getElementById('win-message');
        document.getElementById('final-time').textContent = formatTime(seconds);
        document.getElementById('final-moves').textContent = moves;
        winMessage.style.display = 'block';
    }
}

// Start new game
function startNewGame() {
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

// Initialize game
window.onload = function() {
    preloadImages();
    startNewGame();
};