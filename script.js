const cards = [
    "aeroplane-match.jpg", "elephant.jpg", "cat-match.jpg", "fish.jpg",
    "lion.jpg", "crocodile.jpg", "snake.jpg", "dog.jpg",
];

let gameBoard = document.getElementById("game-board");
let movesDisplay = document.getElementById("moves");
let resetButton = document.getElementById("reset-button");

let gameCards = [...cards, ...cards];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

function initGame() {
    gameBoard.innerHTML = "";
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    movesDisplay.textContent = moves;
    gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);

    gameCards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.name = card;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="images/${card}" alt="Card ${index}" />
                </div>
            </div>
        `;

        cardElement.addEventListener("click", handleCardClick);
        gameBoard.appendChild(cardElement);
    });
}

function handleCardClick(e) {
    const clickedCard = e.currentTarget;

    if (
        flippedCards.length < 2 &&
        !clickedCard.classList.contains("flipped")
    ) {
        clickedCard.classList.add("flipped");
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }
}
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.name === card2.dataset.name) {
        matchedPairs++;
        flippedCards = [];
        setTimeout(() => {
            card1.remove();
            card2.remove();
        }, 500);

        if (matchedPairs === cards.length) {
            setTimeout(() => {
                alert(`You won! All pairs matched in ${moves} moves.`);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

resetButton.addEventListener("click", initGame);
initGame();
