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
let timerstarttime;

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

  initgame();
  startgame.disabled = true;
  p1input.disabled = true;
  p2input.disabled = true;

  timerstarttime = Date.now();
  gameTimer = setInterval(updatetimer, 1000);
});

function initgame() {
  gboard.innerHTML = "";
  const shufflcard = [...cardsData].sort(() => Math.random() - 0.5);

  shufflcard.forEach((card) => {
    const cardele = document.createElement("div");
    cardele.classList.add("card");
    cardele.dataset.pair = card.pair;
    cardele.innerHTML = `<img src="${card.img}" alt="Card">`;
    cardele.addEventListener("click", handlecardClk);
    gboard.appendChild(cardele);
  });
}

function handlecardClk(event) {
  const clkcard = event.currentTarget;

  if (clkcard.classList.contains("flip") || secondCard) return;

  clkcard.classList.add("flip");
  if (!firstCard) {
    firstCard = clkcard;
  } else {
    secondCard = clkcard;
    chkmatch();
  }
}

function chkmatch() {
  if (firstCard.dataset.pair === secondCard.dataset.pair) {
    uptscore();
    resetcard();
    if (document.querySelectorAll(".card:not(.flip)").length === 0) {
      finishgame();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetcard();
      changeplayer();
    }, 1000);
  }
}

function uptscore() {
  const currentPlayerKey = currentPlayer === 1 ? "p1" : "p2";
  scores[currentPlayerKey]++;
}

function resetcard() {
  firstCard = null;
  secondCard = null;
}

function changeplayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function finishgame() {
  const p1name = p1input.value;
  const p2name = p2input.value;
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  let p1Index = leaderboard.findIndex(entry => entry.name === p1name);
  if (p1Index !== -1) {
    leaderboard[p1Index].score += scores.p1;
  } else {
    leaderboard.push({ name: p1name, score: scores.p1 });
  }

  let p2Index = leaderboard.findIndex(entry => entry.name === p2name);
  if (p2Index !== -1) {
    leaderboard[p2Index].score += scores.p2;
  } else {
    leaderboard.push({ name: p2name, score: scores.p2 });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  showleaderboard();
  clearInterval(gameTimer);
  alert("Game Over! Check the leaderboard for scores.");
}

function showleaderboard() {
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
  initgame();
  clearInterval(gameTimer);
  gameTimer = setInterval(updatetimer, 1000);
  timerstarttime = Date.now();
});

restartleaderbtn.addEventListener("click", () => {
  localStorage.removeItem("leaderboard");
  showleaderboard();
});

function updatetimer() {
  const elapsedTime = Math.floor((Date.now() - timerstarttime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timer.innerHTML = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

showleaderboard();
