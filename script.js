class MemoryGame {
    constructor() {
      this.cards = [];
      this.flippedCards = [];
      this.matchedPairs = 0;
      this.moves = 0;
      this.gameStarted = false;
      this.timer = null;
      this.seconds = 0;
      this.isProcessing = false;
  
      this.gameBoard = document.getElementById("game-board");
      this.movesDisplay = document.getElementById("moves");
      this.timeDisplay = document.getElementById("time");
      this.restartButton = document.getElementById("restart");
  
      this.init();
    }
  
    async init() {
      try {
        // Load cards data
        const response = await fetch("cards.json");
        const cardsData = await response.json();
        this.cards = this.shuffleCards(cardsData);
  
        // Set up event listeners
        this.restartButton.addEventListener("click", () => this.restartGame());
  
        // Create game board
        this.createBoard();
  
        // Load leaderboard
        this.loadLeaderboard();
      } catch (error) {
        console.error("Error initializing game:", error);
        this.gameBoard.innerHTML = "<p>Error loading game. Please try again.</p>";
      }
    }
  
    shuffleCards(cards) {
      const shuffled = [...cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  
    createBoard() {
      this.gameBoard.innerHTML = "";
      this.cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.dataset.id = card.id;
        cardElement.dataset.pair = card.pair;
  
        const img = document.createElement("img");
        img.src = card.img;
        img.alt = "Card";
  
        cardElement.appendChild(img);
        cardElement.addEventListener("click", () => this.flipCard(cardElement));
        this.gameBoard.appendChild(cardElement);
      });
    }
  
    flipCard(card) {
      if (
        this.isProcessing ||
        (!this.gameStarted && this.flippedCards.length >= 2) ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
      ) {
        return;
      }
  
      // Start timer on first card flip
      if (!this.gameStarted) {
        this.startTimer();
        this.gameStarted = true;
      }
  
      card.classList.add("flipped");
      this.flippedCards.push(card);
  
      if (this.flippedCards.length === 2) {
        this.isProcessing = true;
        this.moves++;
        this.movesDisplay.textContent = this.moves;
        this.checkMatch();
      }
    }
  
    checkMatch() {
      const [card1, card2] = this.flippedCards;
      const match = card1.dataset.pair === card2.dataset.pair;
  
      if (match) {
        this.handleMatch(card1, card2);
      } else {
        this.handleMismatch(card1, card2);
      }
    }
  
    handleMatch(card1, card2) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      this.flippedCards = [];
      this.matchedPairs++;
      this.isProcessing = false;
  
      if (this.matchedPairs === this.cards.length / 2) {
        this.endGame();
      }
    }
  
    handleMismatch(card1, card2) {
      card1.classList.add("mismatch");
      card2.classList.add("mismatch");
  
      setTimeout(() => {
        card1.classList.remove("flipped", "mismatch");
        card2.classList.remove("flipped", "mismatch");
        this.flippedCards = [];
        this.isProcessing = false;
      }, 1000);
    }
  
    startTimer() {
      this.timer = setInterval(() => {
        this.seconds++;
        const minutes = Math.floor(this.seconds / 60);
        const remainingSeconds = this.seconds % 60;
        this.timeDisplay.textContent = `${minutes}:${remainingSeconds
          .toString()
          .padStart(2, "0")}`;
      }, 1000);
    }
  
    endGame() {
      clearInterval(this.timer);
      const score = {
        moves: this.moves,
        time: this.seconds,
      };
      this.updateLeaderboard(score);
      setTimeout(() => {
        alert('Congratulations! You won in ${this.moves} moves and ${this.seconds} seconds!'
          
        );
      }, 500);
    }
  
    restartGame() {
      clearInterval(this.timer);
      this.flippedCards = [];
      this.matchedPairs = 0;
      this.moves = 0;
      this.gameStarted = false;
      this.seconds = 0;
      this.isProcessing = false;
      this.movesDisplay.textContent = "0";
      this.timeDisplay.textContent = "0:00";
      this.cards = this.shuffleCards(this.cards);
      this.createBoard();
    }
  
    updateLeaderboard(score) {
      let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
      leaderboard.push(score);
      leaderboard.sort((a, b) => {
        if (a.moves === b.moves) {
          return a.time - b.time;
        }
        return a.moves - b.moves;
      });
      leaderboard = leaderboard.slice(0, 5); // Keep only top 5 scores
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
      this.displayLeaderboard();
    }
  
    loadLeaderboard() {
      this.displayLeaderboard();
    }
  
    displayLeaderboard() {
      const leaderboardElement = document.getElementById("leaderboard-list");
      const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  
      leaderboardElement.innerHTML = leaderboard
        .map(
          (score, index) => ` 
            <div class="leaderboard-item">
              #${index + 1}: ${score.moves} moves in ${Math.floor(
            score.time / 60
          )}:${(score.time % 60).toString().padStart(2, "0")}
            </div>
          `
        )
        .join("");
    }
  }
  
  // Start the game when the page loads
  document.addEventListener("DOMContentLoaded", () => {
    new MemoryGame();
  });