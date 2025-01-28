const cardsData = [
    { id: 1, pair: "A", img: "images/aeroplane.jpg" },
    { id: 2, pair: "A", img: "images/aeroplane-match.jpg" },
    { id: 3, pair: "B", img: "images/cat.jpg" },
    { id: 4, pair: "B", img: "images/cat-match.jpg" },
    { id: 5, pair: "C", img: "images/crocodile.jpg" },
    { id: 6, pair: "C", img: "images/crocodile-match.jpg" },
    { id: 7, pair: "D", img: "images/dog.jpg" },
    { id: 8, pair: "D", img: "images/dog-match.jpg" },
    { id: 9, pair: "E", img: "images/elephant.jpg" },
    { id: 10, pair: "E", img: "images/elephant-match.jpg" },
    { id: 11, pair: "F", img: "images/fish.jpg" },
    { id: 12, pair: "F", img: "images/fish-match.jpg" },
    { id: 13, pair: "G", img: "images/lion.jpg" },
    { id: 14, pair: "G", img: "images/lion-match.jpg" },
    { id: 15, pair: "H", img: "images/snake.jpg" },
    { id: 16, pair: "H", img: "images/snake-match.jpg" },
];

let moves = 0;
let flippedCards = [];
let matchedPairs = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

const gameBoard = document.querySelector(".game-board");
const moveCount = document.getElementById("move-count");
const timeCount = document.getElementById("time-count");
const restartBtn = document.getElementById("restart-btn");
const startBtn = document.getElementById("start-btn");
const leaderboardList = document.getElementById("leaderboard-list");

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startGame() {
    gameBoard.innerHTML = "";
    moves = 0;
    flippedCards = [];
    matchedPairs = 0;
    timer = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    moveCount.textContent = moves;
    timeCount.textContent = timer;

    const shuffledCards = shuffle([...cardsData]);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.pair = card.pair;
        cardElement.innerHTML = `
            <div class="card-front">
                <img src="${card.img}" alt="Card">
            </div>
            <div class="card-back">?</div>
        `;
        cardElement.addEventListener("click", () => flipCard(cardElement));
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(card) {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            timer++;
            timeCount.textContent = timer;
        }, 1000);
    }

    if (card.classList.contains("flipped") || flippedCards.length === 2) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        moveCount.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.pair === card2.dataset.pair) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === cardsData.length / 2) endGame();
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ moves, time: timer });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
    alert(`You won! Moves: ${moves}`);
}

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardList.innerHTML = leaderboard
        .sort((a, b) => a.moves - b.moves)
        .map(entry => `<li>Moves: ${entry.moves}, Time: ${entry.time}s</li>`)
        .join("");
}

restartBtn.addEventListener("click", startGame);
startBtn.addEventListener("click", startGame);

startGame();
updateLeaderboard();
