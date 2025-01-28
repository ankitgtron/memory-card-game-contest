const gridContainer = document.querySelector(".grid-container");
const restartButton = document.getElementById("restart-btn");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupRestartButton = document.getElementById("popup-restart");
const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let timer = null;
let secondsElapsed = 0;
let timerStarted = false;

async function fetchCards() {
    const response = await fetch("cards.json");
    const cardData = await response.json();

    cards = cardData.sort(() => Math.random() - 0.5);
}

async function createBoard() {
    await fetchCards();
    gridContainer.innerHTML = "";

    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.pair = card.pair;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${card.img}" alt="Card Image" class="card-image">
                </div>
            </div>
        `;
        cardElement.addEventListener("click", flipCard);
        gridContainer.appendChild(cardElement);
    });
}

function startTimer() {
    if (timerStarted) return;
    timerStarted = true;

    timer = setInterval(() => {
        secondsElapsed++;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function flipCard() {
    if (!timerStarted) {
        startTimer();
    }

    if (lockBoard || this === firstCard || this.classList.contains("matched")) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
        updateMoves();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;
        resetCards();
        if (matchedPairs === cards.length / 2) {
            gameOver();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetCards();
        }, 1000);
    }
}

function gameOver() {
    stopTimer();
    popupMessage.textContent = `You matched all cards in ${secondsElapsed} seconds and ${moves} moves!`;
    popup.classList.remove("hidden");
}

function resetCards() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateMoves() {
    moves++;
    movesElement.textContent = moves;
}

function restartGame() {
    matchedPairs = 0;
    moves = 0;
    timerStarted = false;
    secondsElapsed = 0;
    clearInterval(timer);
    movesElement.textContent = 0;
    timerElement.textContent = "00:00";
    popup.classList.add("hidden");
    createBoard();
}

restartButton.addEventListener("click", restartGame);
popupRestartButton.addEventListener("click", restartGame);
createBoard();
