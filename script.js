const startGameButton = document.getElementById("startGameButton");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const gameBoard1 = document.getElementById("gameBoard1");
const leaderboardList = document.getElementById("leaderboard");
const restartButton = document.getElementById("restartButton");
const resetLeaderboardButton = document.getElementById("resetLeaderboardButton");
const timerDisplay = document.getElementById("timerDisplay");

let cardsData = [];
let firstCard = null;
let secondCard = null;
let currentPlayer = 1;
let scores = { player1: 0, player2: 0 };
let gameTimer;
let timerStartTime;

fetch('cards.json')
  .then(response => response.json())
  .then(data => {
    cardsData = data;
  })
  .catch(error => {
    console.error('Error loading card data:', error);
  });

startGameButton.addEventListener("click", () => {
  const player1Name = player1Input.value.trim();
  const player2Name = player2Input.value.trim();

  if (!player1Name || !player2Name) {
    alert("Please enter names for both players.");
    return;
  }

  initializeGame();
  startGameButton.disabled = true;
  player1Input.disabled = true;
  player2Input.disabled = true;

  timerStartTime = Date.now();
  gameTimer = setInterval(updateTimer, 1000);
});

function initializeGame() {
  gameBoard1.innerHTML = "";
  const shuffledCards = [...cardsData].sort(() => Math.random() - 0.5);

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.pair = card.pair;
    cardElement.innerHTML = `<img src="${card.img}" alt="Card">`;
    cardElement.addEventListener("click", handleCardClick);
    gameBoard1.appendChild(cardElement);
  });
}

function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (clickedCard.classList.contains("flipped") || secondCard) return;

  clickedCard.classList.add("flipped");
  if (!firstCard) {
    firstCard = clickedCard;
  } else {
    secondCard = clickedCard;
    checkMatch();
  }
}

function checkMatch() {
  if (firstCard.dataset.pair === secondCard.dataset.pair) {
    updateScore();
    resetCards();
    if (document.querySelectorAll(".card:not(.flipped)").length === 0) {
      endGame();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetCards();
      switchPlayer();
    }, 1000);
  }
}

function updateScore() {
  const currentPlayerKey = currentPlayer === 1 ? "player1" : "player2";
  scores[currentPlayerKey]++;
}

function resetCards() {
  firstCard = null;
  secondCard = null;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function endGame() {
  const player1Name = player1Input.value;
  const player2Name = player2Input.value;
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  let player1Index = leaderboard.findIndex(entry => entry.name === player1Name);
  if (player1Index !== -1) {
    leaderboard[player1Index].score = scores.player1;
  } else {
    leaderboard.push({ name: player1Name, score: scores.player1 });
  }

  let player2Index = leaderboard.findIndex(entry => entry.name === player2Name);
  if (player2Index !== -1) {
    leaderboard[player2Index].score = scores.player2;
  } else {
    leaderboard.push({ name: player2Name, score: scores.player2 });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  renderLeaderboard();
  clearInterval(gameTimer);
  alert("Game Over! Check the leaderboard for scores.");
}

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = leaderboard
    .map((entry) => `<li>${entry.name}: ${entry.score} points</li>`)
    .join("");
}

restartButton.addEventListener("click", () => {
  startGameButton.disabled = false;
  player1Input.disabled = false;
  player2Input.disabled = false;
  player1Input.value = "";
  player2Input.value = "";
  scores = { player1: 0, player2: 0 };
  initializeGame();
  clearInterval(gameTimer);
  gameTimer = setInterval(updateTimer, 1000);
  timerStartTime = Date.now();
});

resetLeaderboardButton.addEventListener("click", () => {
  localStorage.removeItem("leaderboard");
  renderLeaderboard();
});

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - timerStartTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timerDisplay.innerHTML = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

renderLeaderboard();
