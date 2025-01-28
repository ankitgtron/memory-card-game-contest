let firstCard = null;
let secondCard = null;
let moves = 0;

// Fetch cards data
fetch("cards.json")
  .then((response) => response.json())
  .then((cards) => initGame(cards));

// Initialize game
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

// Check for match
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

// Reset turn
function resetTurn() {
  firstCard = null;
  secondCard = null;
}

// Display move count
function displayMoveCount() {
  const moveCounter = document.createElement("div");
  moveCounter.classList.add("move-counter");
  moveCounter.textContent = "Moves: 0";
  document.body.insertBefore(moveCounter, document.querySelector(".game-container"));
}

// Update move count
function updateMoveCount() {
  const moveCounter = document.querySelector(".move-counter");
  moveCounter.textContent = 'Moves: ${moves}';
}