const startgame = document.getElementById("startgame");
const p1input = document.getElementById("p1");
const p2input = document.getElementById("p2");
const gboard = document.getElementById("gboard");
const leaderboardL = document.getElementById("leaderboard");
const restartbtn = document.getElementById("restartbtn");
const restartleaderbtn = document.getElementById("restartleaderbtn");
const timer = document.getElementById("timer");

let cardsData = [];
let firstCard = null;
let secondCard = null;
let currentPlayer = 1;
let scores = { p1: 0, p2: 0 };
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

startgame.addEventListener("click", () => {
  const p1name = p1input.value.trim();
  const p2name = p2input.value.trim();

  if (!p1name || !p2name) {
    alert("Please enter names for both players.");
    return;
  }

  initializeGame();
  startgame.disabled = true;
  p1input.disabled = true;
  p2input.disabled = true;

  timerStartTime = Date.now();
  gameTimer = setInterval(updateTimer, 1000);
});

function initializeGame() {
  gboard.innerHTML = "";
  const shuffledCards = [...cardsData].sort(() => Math.random() - 0.5);

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.pair = card.pair;
    cardElement.innerHTML = `<img src="${card.img}" alt="Card">`;
    cardElement.addEventListener("click", handleCardClick);
    gboard.appendChild(cardElement);
  });
}

function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (clickedCard.classList.contains("flip") || secondCard) return;

  clickedCard.classList.add("flip");
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
    if (document.querySelectorAll(".card:not(.flip)").length === 0) {
      endGame();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetCards();
      switchPlayer();
    }, 1000);
  }
}

function updateScore() {
  const currentPlayerKey = currentPlayer === 1 ? "p1" : "p2";
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
  const p1name = p1input.value;
  const p2name = p2input.value;
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  let p1Index = leaderboard.findIndex(entry => entry.name === p1name);
  if (p1Index !== -1) {
    leaderboard[p1Index].score = scores.p1;
  } else {
    leaderboard.push({ name: p1name, score: scores.p1 });
  }

  let p2Index = leaderboard.findIndex(entry => entry.name === p2name);
  if (p2Index !== -1) {
    leaderboard[p2Index].score = scores.p2;
  } else {
    leaderboard.push({ name: p2name, score: scores.p2 });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  renderLeaderboard();
  clearInterval(gameTimer);
  alert("Game Over! Check the leaderboard for scores.");
}

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardL.innerHTML = leaderboard
    .map((entry) => `<li>${entry.name}: ${entry.score} points</li>`)
    .join("");
}

restartbtn.addEventListener("click", () => {
  startgame.disabled = false;
  p1input.disabled = false;
  p2input.disabled = false;
  p1input.value = "";
  p2input.value = "";
  scores = { p1: 0, p2: 0 };
  initializeGame();
  clearInterval(gameTimer);
  gameTimer = setInterval(updateTimer, 1000);
  timerStartTime = Date.now();
});

restartleaderbtn.addEventListener("click", () => {
  localStorage.removeItem("leaderboard");
  renderLeaderboard();
});

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - timerStartTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timer.innerHTML = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

renderLeaderboard();
