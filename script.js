let firstCard = null;
let secondCard = null;
let moves = 0;
let timer = null;
let timeElapsed = 0;

// Fetch cards data
fetch("cards.json")
  .then((response) => response.json())
  .then((cards) => initGame(cards));

// Initialize the game
function initGame(cards) {
  const gameContainer = document.querySelector(".game-container");
  const shuffledCards = shuffle(cards);

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.pair = card.pair;

    const imgElement = document.createElement("img");
    imgElement.src = card.img;
    imgElement.classList.add("hidden");
    cardElement.appendChild(imgElement);

    gameContainer.appendChild(cardElement);
  });

  displayMoveCount();
  displayTimer();
  displayResetButton();
  startTimer();
  addEventListeners();
}

// Shuffle cards
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Add event listeners
function addEventListeners() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      if (card.classList.contains("flipped") || secondCard) return;

      card.classList.add("flipped");
      card.querySelector("img").classList.remove("hidden");

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        moves++;
        updateMoveCount();
        checkMatch(firstCard, secondCard);
      }
    });
  });
}

// Check if both cards match
function checkMatch(card1, card2) {
  if (card1.dataset.pair === card2.dataset.pair) {
    [card1, card2].forEach((card) => {
      card.classList.add("matched");
      card.querySelector("img").classList.remove("hidden");
    });
    resetTurn();
  } else {
    setTimeout(() => {
      [card1, card2].forEach((card) => {
        card.classList.remove("flipped");
        card.querySelector("img").classList.add("hidden");
      });
      resetTurn();
    }, 1000);
  }
}

// Reset the turn
function resetTurn() {
  firstCard = null;
  secondCard = null;
}

// Display the move count
function displayMoveCount() {
  if (!document.querySelector(".move-counter")) {
    const moveCounter = document.createElement("div");
    moveCounter.classList.add("move-counter");
    moveCounter.textContent = "Moves: 0";
    document.body.insertBefore(
      moveCounter,
      document.querySelector(".game-container")
    );
  }
}

// Update the move count
function updateMoveCount() {
  const moveCounter = document.querySelector(".move-counter");
  moveCounter.textContent = `Moves: ${moves}`;
}

// Display the timer
function displayTimer() {
  if (!document.querySelector(".timer")) {
    const timerElement = document.createElement("div");
    timerElement.classList.add("timer");
    timerElement.textContent = "Time: 0s";
    document.body.insertBefore(
      timerElement,
      document.querySelector(".game-container")
    );
  }
}

// Update the timer
function updateTimer() {
  timeElapsed++;
  const timerElement = document.querySelector(".timer");
  timerElement.textContent = `Time: ${timeElapsed}s`;
}

// Start the timer
function startTimer() {
  timer = setInterval(updateTimer, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timer);
}

// Display the reset button
function displayResetButton() {
  if (!document.querySelector(".reset-button")) {
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Game";
    resetButton.classList.add("reset-button");
    document.body.insertBefore(
      resetButton,
      document.querySelector(".game-container")
    );
    resetButton.addEventListener("click", resetGame);
  }
}

// Reset the game
function resetGame() {
  stopTimer();
  timeElapsed = 0;
  moves = 0;
  firstCard = null;
  secondCard = null;

  const gameContainer = document.querySelector(".game-container");
  gameContainer.innerHTML = "";

  const moveCounter = document.querySelector(".move-counter");
  moveCounter.textContent = "Moves: 0";

  const timerElement = document.querySelector(".timer");
  timerElement.textContent = "Time: 0s";

  fetch("cards.json")
    .then((response) => response.json())
    .then((cards) => initGame(cards));
}
