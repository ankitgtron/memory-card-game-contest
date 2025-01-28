// Write your code here
const CARD_CONTENTS = [
    { id: 1, imgSrc: 'images/aeroplane.jpg' },
    { id: 2, imgSrc: 'images/cat.jpg' },
    { id: 3, imgSrc: 'images/crocodile.jpg' },
    { id: 4, imgSrc: 'images/dog.jpg' },
    { id: 5, imgSrc: 'images/elephant.jpg' },
    { id: 6, imgSrc: 'images/fish.jpg' },
    { id: 7, imgSrc: 'images/lion.jpg' },
    { id: 8, imgSrc: 'images/snake.jpg' }
];

class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedIndexes = [];
        this.matchedPairs = [];
        this.moves = 0;
        this.timeElapsed = 0;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.timer = null;
        this.leaderboard = [];

            
        this.gameGrid = document.getElementById('gameGrid');
        this.movesElement = document.getElementById('moves');
        this.timeElement = document.getElementById('time');
        this.resetBtn = document.getElementById('resetBtn');
        this.leaderboardScores = document.getElementById('leaderboardScores');
    
        this.resetBtn.addEventListener('click', () => this.initializeGame());

        // Initialize game
        this.initializeGame();
        this.loadLeaderboard();
    }

    initializeGame() {
        
        clearInterval(this.timer);
        this.gameGrid.innerHTML = '';
        
        
        const duplicatedCards = [...CARD_CONTENTS, ...CARD_CONTENTS];
        this.cards = duplicatedCards.sort(() => Math.random() - 0.5);
        this.flippedIndexes = [];
        this.matchedPairs = [];
        this.moves = 0;
        this.timeElapsed = 0;
        this.gameStarted = false;
        this.gameCompleted = false;

        this.updateStats();
        this.createCards();
    }

    createCards() {
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">
                        <img src="${card.imgSrc}" alt="card image">
                    </div>
                </div>
            `;
            cardElement.addEventListener('click', () => this.handleCardClick(index));
            this.gameGrid.appendChild(cardElement);
        });
    }

    handleCardClick(index) {
        const cardElement = this.gameGrid.children[index];

        if (!this.gameStarted) {
            this.startGame();
        }

        if (
            this.flippedIndexes.length === 2 ||
            this.flippedIndexes.includes(index) ||
            this.matchedPairs.includes(this.cards[index].id)
        ) {
            return;
        }

        this.flippedIndexes.push(index);
        cardElement.classList.add('flipped');

        if (this.flippedIndexes.length === 2) {
            this.moves++;
            this.updateStats();
            
            const [firstIndex, secondIndex] = this.flippedIndexes;
            
            if (this.cards[firstIndex].id === this.cards[secondIndex].id) {
                this.matchedPairs.push(this.cards[firstIndex].id);
                this.flippedIndexes = [];

                if (this.matchedPairs.length === CARD_CONTENTS.length) {
                    this.completeGame();
                }
            } else {
                setTimeout(() => {
                    this.gameGrid.children[firstIndex].classList.remove('flipped');
                    this.gameGrid.children[secondIndex].classList.remove('flipped');
                    this.flippedIndexes = [];
                }, 1000);
            }
        }
    }

    startGame() {
        this.gameStarted = true;
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateStats();
        }, 1000);
    }

    completeGame() {
        this.gameCompleted = true;
        clearInterval(this.timer);
        this.saveToLeaderboard();
    }

    updateStats() {
        this.movesElement.textContent = this.moves;
        this.timeElement.textContent = this.formatTime(this.timeElapsed);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    loadLeaderboard() {
        const savedLeaderboard = localStorage.getItem('memoryGameLeaderboard');
        if (savedLeaderboard) {
            this.leaderboard = JSON.parse(savedLeaderboard);
            this.updateLeaderboard();
        }
    }

    saveToLeaderboard() {
        const newScore = {
            moves: this.moves,
            time: this.timeElapsed,
            date: new Date().toLocaleDateString()
        };

        this.leaderboard = [...this.leaderboard, newScore]
            .sort((a, b) => a.moves - b.moves || a.time - b.time)
            .slice(0, 5);

        localStorage.setItem('memoryGameLeaderboard', JSON.stringify(this.leaderboard));
        this.updateLeaderboard();
    }

    updateLeaderboard() {
        this.leaderboardScores.innerHTML = '';

        if (this.leaderboard.length === 0) {
            this.leaderboardScores.innerHTML = `
                <p class="no-scores">No scores yet. Complete a game to set a record!</p>
            `;
            return;
        }

        this.leaderboard.forEach((score, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.className = 'score-item';
            scoreElement.innerHTML = `
                <span class="font-medium">#${index + 1}</span>
                <span>${score.moves} moves</span>
                <span>${this.formatTime(score.time)}</span>
                <span class="text-gray-500">${score.date}</span>
            `;
            this.leaderboardScores.appendChild(scoreElement);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});// Write your code here
