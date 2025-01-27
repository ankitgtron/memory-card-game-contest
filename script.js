// Write your code here
const images = [
    'images/crocodile.jpg',
    'images/dog.jpg',
    'images/cat.jpg',
    'images/dog.jpg',
    'images/aeroplane.jpg',
    'images/cat.jpg',
    'images/crocodile.jpg',
    'images/aeroplane.jpg',
];

let flippedCards = [];
let matchedPairs = 0;
let flipCount = 0; // Variable to track the flip count

// Shuffle function for images
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Create the game board dynamically
function createGameBoard() {
    const board = document.querySelector('.game-board');
    board.innerHTML = ''; // Clear the board before adding new cards
    const shuffledImages = shuffle(images); // Shuffle the images on every board creation

    shuffledImages.forEach((imgSrc, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = imgSrc;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${imgSrc}" alt="Card ${index + 1}">
                </div>
            </div>
        `;

        card.addEventListener('click', handleCardClick);
        board.appendChild(card);
    });

    // Reset the game state
    flippedCards = [];
    matchedPairs = 0;
    flipCount = 0; // Reset flip count
    updateFlipCount(); // Update the flip counter display
}

// Handle card click
function handleCardClick(e) {
    const card = e.currentTarget;

    // At a time only 2 cards can be flipped
    if (card.classList.contains('flipped') || flippedCards.length === 2) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);
    flipCount++; // Increment flip count on every card flip
    updateFlipCount(); // Update the flip counter display

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Update the flip count display
function updateFlipCount() {
    const flipCounter = document.querySelector('.flip-counter');
    flipCounter.textContent = `Flips: ${flipCount}`;
}

// Check if two flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        flippedCards = [];
        matchedPairs++;

        // Since only one pair needs to be matched to win, we trigger the win immediately
        setTimeout(() => {
            alert('Congratulations! You won!');
            location.reload(); // Refresh the page after winning
        }, 300);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Initialize the game
createGameBoard();
