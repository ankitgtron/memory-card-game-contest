document.addEventListener("DOMContentLoaded", () => {
    fetch('cards.json')
      .then(response => response.json())
      .then(cards => startGame(cards));

    let moves = 0;
    let matchedPairs = 0;
    let timerInterval;
    let firstCard, secondCard;

    const gameBoard = document.getElementById('game-board');
    const moveCounter = document.getElementById('move-counter');
    const timerDisplay = document.getElementById('timer');
    
    function startGame(cards) {
      shuffle(cards);
      createCards(cards);
      startTimer();
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function createCards(cards) {
      gameBoard.innerHTML = '';
      cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.pair = card.pair;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.style.backgroundImage = `url(${card.img})`;

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        gameBoard.appendChild(cardElement);

        cardElement.addEventListener('click', () => flipCard(cardElement));
      });
    }

    function flipCard(card) {
      if (card === firstCard || card.classList.contains('matched')) return;
      card.classList.add('flipped');

      if (!firstCard) {
        firstCard = card;
        return;
      }

      secondCard = card;
      moves++;
      moveCounter.textContent = moves;

      checkForMatch();
    }

    function checkForMatch() {
      const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;
      isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');

      resetBoard();
      matchedPairs++;

      if (matchedPairs === 8) { 
        clearInterval(timerInterval);
        setTimeout(() => alert(`Congratulations! You won in ${moves} moves and ${timerDisplay.textContent}!`), 500);
      }
    }

    function unflipCards() {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
      }, 1000);
    }

    function resetBoard() {
      [firstCard, secondCard] = [null, null];
    }

    function startTimer() {
      let seconds = 0;
      timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        timerDisplay.textContent = `${minutes}:${displaySeconds.toString().padStart(2, '0')}`;
      }, 1000);
    }
  });