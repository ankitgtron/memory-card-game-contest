let cards = [];
fetch("cards.json")
  .then((response) => response.json())
  .then((data) => {
    cards = data; 
    initGame();
  })
  .catch((error) => console.error("Error loading cards:", error));

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer;
let seconds = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCardGrid() {
  const gameBoard = document.getElementById("gameBoard"); // Ensure this ID matches your HTML
  shuffle(cards).forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;
    cardElement.dataset.pair = card.pair;
    cardElement.innerHTML = `<img src="${card.img}" alt="${card.pair}">`; // Fixed missing closing bracket
    cardElement.addEventListener("click", handleCardClick);
    gameBoard.appendChild(cardElement);
  });
}

function handleCardClick(event) {
  const card = event.currentTarget;
  if (flippedCards.length >= 2 || card.classList.contains("flipped")) return;
  card.classList.add("flipped");
  flippedCards.push(card);
  if (flippedCards.length === 2) {
    updateMoves();
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.pair === card2.dataset.pair) {
    matchedPairs++;
    if (matchedPairs === cards.length / 2) {
      clearInterval(timer);
      alert(`You won in ${seconds} seconds with ${moves} moves!`);
    }
    flippedCards = [];
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

function updateMoves() {
  moves++;
  document.getElementById("moves").textContent = `Moves: ${moves}`;
}

function setTimer() {
  timer = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent = `Time: ${seconds}s`;
  }, 1000);
}


function initGame() {
  createCardGrid();
  setTimer();
}