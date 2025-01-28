const gameBoard = document.getElementById("game-board");
const moveCounter = document.getElementById("move-counter");
const timer = document.getElementById('timer');
let moves = 0;
let time=0;
let timeInterval;

let cards = [];

fetch('./cards.json')
      .then(response => response.json())
      .then(data => {
        cards = data
          .sort(() => Math.random() - 0.5) 
          .map(card => ({ ...card, flipped: false }));

          cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.id = card.id;
            cardElement.dataset.pair = card.pair;
  
            const cardImage = document.createElement('img');
            cardImage.src = card.img;
            cardElement.appendChild(cardImage);
  
            gameBoard.appendChild(cardElement);
          });
  
          initializeGame();
        });
  
      function initializeGame() {

        startTimer();
        let firstCard = null;
        let secondCard = null;
        let matchCount=0;
  
        gameBoard.addEventListener('click', event => {
          const clickedCard = event.target.closest('.card');
  
          if (!clickedCard || clickedCard.classList.contains('flipped') || secondCard) return;
  
          clickedCard.classList.add('flipped');
          const clickedCardId = clickedCard.dataset.id;
          const clickedCardData = cards.find(card => card.id == clickedCardId);
  
          if (!firstCard) {
            firstCard = clickedCardData;
          } else {
            secondCard = clickedCardData;
            moves++;
            moveCounter.textContent = moves;
  
            if (firstCard.pair === secondCard.pair) {
                matchCount++;
              firstCard = null;
              secondCard = null;

              if (matchCount === cards.length / 2) {
                clearInterval(timerInterval);
                alert(`Congratulations! You completed the game in ${formatTime(time)} with ${moves} moves.`);
              }
            } else {
              setTimeout(() => {
                document.querySelector(`[data-id="${firstCard.id}"]`).classList.remove('flipped');
                document.querySelector(`[data-id="${secondCard.id}"]`).classList.remove('flipped');
                firstCard = null;
                secondCard = null;
              }, 1000);
            }
          }
        });
  
        document.getElementById('restart-button').addEventListener('click', () => {
          location.reload();
        });
      }

      function startTimer() {
        time = 0;
        timerInterval = setInterval(() => {
          time++;
          timer.textContent = formatTime(time);
        }, 1000);
      }
  
      function formatTime(sec) {
        const minutes = Math.floor(sec / 60);
        const remainingSeconds = sec % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      }// Write your code here
