// Write your code here

const grid = document.getElementById("grid");
const player1ScoreElement = document.getElementById("player1-score");
const player2ScoreElement = document.getElementById("player2-score");
const turnInfo = document.getElementById("turn-info");

const assets = [
    "aeroplane.jpg", "aeroplane-match.jpg",
    "crocodile.jpg", "crocodile-match.jpg",
    "cat.jpg", "cat-match.jpg",
    "dog.jpg", "dog-match.jpg",
    "elephant.jpg", "elephant-match.jpg",
    "fish.jpg", "fish-match.jpg",
    "lion.jpg", "lion-match.jpg",
    "snake.jpg", "snake-match.jpg"
  ];

let shuffledImages = [];
let firstCell = null;
let secondCell = null;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let timerInterval;
let timeElapsed = 0;

function startTimer() {
    const timerElement = document.getElementById("timer");
    timerInterval = setInterval(() => {
      timeElapsed++;
      const minutes = Math.floor(timeElapsed / 60);
      const seconds = timeElapsed % 60;
      timerElement.textContent = `Time: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

function initializeGame() {
  shuffledImages = [...assets];
  shuffledImages.sort(() => Math.random() - 0.5);

  shuffledImages.forEach((image, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.image = image;

    const img = document.createElement("img");
    img.src = `images/${image}`; 
    cell.appendChild(img);

    cell.addEventListener("click", handleCellClick);
    grid.appendChild(cell);
  });

  player1Score = 0;
  player2Score = 0;
  player1ScoreElement.textContent = player1Score;
  player2ScoreElement.textContent = player2Score;
  turnInfo.textContent = "Player 1's Turn";
  timeElapsed = 0; 
  document.getElementById("timer").textContent = "Time: 0:00";
  document.getElementById("new-game-btn").style.display = "none"; 
  startTimer(); 

}

function handleCellClick(e) {
  const cell = e.currentTarget;
  const img = cell.querySelector("img");

  if (!img || cell.classList.contains("revealed") || secondCell) return;

  img.style.display = "block";
  cell.classList.add("revealed");

  if (!firstCell) {
    firstCell = cell;
  } else {
    secondCell = cell;

    if (firstCell.dataset.image.replace("-match", "") === secondCell.dataset.image.replace("-match", "")) {
      updateScore();
      resetSelection(true);
    } else {
      setTimeout(() => resetSelection(false), 1000);
    }
  }
}

function updateScore() {

    const starSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve" width="30" height="30">
      <circle fill="#FFE352" cx="256" cy="256" r="246"/>
      <circle fill="#FFB236" cx="256" cy="256" r="200"/>
      <path fill="#FFE352" d="m256 85.777 50.061 101.434L418 203.477l-81 78.956 19.121 111.486L256 341.282l-100.122 52.637L175 282.433l-81-78.956 111.939-16.266z"/>
    </svg>
  `;

  firstCell.innerHTML = starSVG;
  secondCell.innerHTML = starSVG;

  firstCell.style.background = "none";
  firstCell.style.border = "none";
  firstCell.style.display = "flex";
  firstCell.style.justifyContent = "center";
  firstCell.style.alignItems = "center";

  secondCell.style.background = "none";
  secondCell.style.border = "none";
  secondCell.style.display = "flex";
  secondCell.style.justifyContent = "center";
  secondCell.style.alignItems = "center";

  firstCell.removeEventListener("click", handleCellClick);
  secondCell.removeEventListener("click", handleCellClick);
    
  if (currentPlayer === 1) {
    player1Score++;
    player1ScoreElement.textContent = player1Score;
  } else {
    player2Score++;
    player2ScoreElement.textContent = player2Score;
  }
}

function resetSelection(isMatch) {
  if (!isMatch) {
    firstCell.querySelector("img").style.display = "none";
    secondCell.querySelector("img").style.display = "none";
    firstCell.classList.remove("revealed");
    secondCell.classList.remove("revealed");
  }

  firstCell = null;
  secondCell = null;

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  const matchedPairs = document.querySelectorAll(".cell svg").length / 2;
  if (matchedPairs === assets.length / 2) {
    endGame();
  } else {
    turnInfo.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function endGame() {
    stopTimer();

    document.getElementById("timer").style.display = "none";
    

    const winnerMessage = document.getElementById("winner-message");
    if (player1Score > player2Score) {
      turnInfo.textContent = "Player 1 Won!";
    } else if (player2Score > player1Score) {
      turnInfo.textContent = "Player 2 Won!";
    } else {
      turnInfo.textContent = "It's a Tie!";
    }

    document.getElementById("end-game-message").style.display = "block";
    document.getElementById("new-game-btn").style.display = "block"; 
    
  
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
  }

  document.getElementById("new-game-btn").addEventListener("click", () => {
  document.getElementById("end-game-message").style.display = "none";
  document.getElementById("game-container").style.display = "block";
    // grid.innerHTML = '';
    // // Re-initialize the game
    initializeGame();
  });

// Start the game
initializeGame();
startTimer();
