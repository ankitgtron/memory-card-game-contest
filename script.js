const cardData = [
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
  let timer = 0;
  let score=0;
  let flippedCards = [];
  let matchedPairs = 0;
  let timerInterval;
  
  const gameBoard = document.getElementById("game-board");
  const movesDisplay = document.getElementById("moves");
  const timeDisplay = document.getElementById("time");
  const scoreDisplay = document.getElementById("score");
  const restartBtn = document.getElementById("restart-btn");
  
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function generateCards() {
    return shuffle([...cardData]);
  }
  
  function flipCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains("flipped")) return;
  
    card.classList.add("flipped");
    const cardData = JSON.parse(card.dataset.card);
    card.style.backgroundImage = `url(${cardData.img})`;
    flippedCards.push(card);
  
    if (flippedCards.length === 2) checkForMatch();
  }
  
  function checkForMatch() {
    moves++;
    movesDisplay.textContent = moves;
  
    const [card1, card2] = flippedCards;
    const cardData1 = JSON.parse(card1.dataset.card);
    const cardData2 = JSON.parse(card2.dataset.card);
  
    if (cardData1.pair === cardData2.pair) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedPairs++;
      flippedCards = [];
  
      if (matchedPairs === cardData.length / 2) {
        clearInterval(timerInterval);
        alert(`You won! Time: ${timer}s, Moves: ${moves}`);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.style.backgroundImage = "";
        card2.style.backgroundImage = "";
        flippedCards = [];
      }, 1000);
    }
    calculateScore();
  }
  
  
  
  function calculateScore() {
    const baseScore = 1000; // Starting score
    const penalty = moves * 10 + timer * 2; // Penalty based on moves and time
    score = Math.max(baseScore - penalty, 0); // Ensure the score doesn't go negative
    scoreDisplay.textContent = score;
  }
  
  function initGame() {
    // Reset variables
    moves = 0;
    timer = 0;
    flippedCards = [];
    matchedPairs = 0;
    clearInterval(timerInterval);
  
    // Update UI
    movesDisplay.textContent = moves;
    timeDisplay.textContent = timer;
    gameBoard.innerHTML = "";
  
    // Start Timer
    timerInterval = setInterval(() => {
      timer++;
      timeDisplay.textContent = timer;
    }, 1000);
  
    // Generate and Display Cards
    const cards = generateCards();
    cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.dataset.card = JSON.stringify(card);
      cardElement.addEventListener("click", () => flipCard(cardElement));
      gameBoard.appendChild(cardElement);
    });
  }
  
  // Restart Game
  restartBtn.addEventListener("click", initGame);
  
  // Initialize
  initGame();
  