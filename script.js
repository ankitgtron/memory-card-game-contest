// Write your code here
fetch('cards.json')
  .then(response => response.json())
  .then(cardData => initializeGame(cardData))
  .catch(error => console.error('Error loading card data:', error));

function initializeGame(cardsData) {
    const gameBoard = document.getElementById("gameBoard");
    const flipCounter = document.getElementById("flip-counter");
    const timerDisplay = document.getElementById("timer"); 
    const bestTimeDisplay = document.getElementById("best-time"); 
    let flips = 0;
    let startTime = Date.now();
    let bestTime = localStorage.getItem('bestTime');
    if(bestTime){
        bestTime = parseInt(bestTime);
        bestTimeDisplay.textContent = `Best Time: ${bestTime}s`;
    } else {
        bestTime = null;
    }
    function updateTimer(){
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); 
        timerDisplay.textContent = `Time: ${elapsedTime}s`;
    }
    const timerInterval = setInterval(updateTimer, 1000);
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    shuffle(cardsData);
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchesFound = 0;
    cardsData.forEach(cards => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.pair = cards.pair;
        const imgElement = document.createElement("img");
        imgElement.src = cards.img;
        imgElement.classList.add("card-img");
        cardElement.appendChild(imgElement);
        cardElement.addEventListener("click", flipCard);
        gameBoard.appendChild(cardElement);
    });
    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains("matched")) return;
        this.classList.add("flipped");
        flips++;
        flipCounter.textContent = `Flips: ${flips}`;
        if (!firstCard) {
            firstCard = this;
            return;
        }
        secondCard = this;
        checkMatch();
    }
    function checkMatch() {
        if (firstCard.dataset.pair === secondCard.dataset.pair) {
            keepCardsFlipped();
        } else {
            unflipCards();
        }
    }
    function keepCardsFlipped() {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        resetBoard();
        matchesFound++;
        if (matchesFound === cardsData.length / 2) {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            clearInterval(timerInterval); 
            setTimeout(() => {
                alert(`Congratulations! You won in ${flips} flips and ${elapsedTime} seconds!`);
                if (!bestTime || elapsedTime < bestTime) {
                    bestTime = elapsedTime;
                    localStorage.setItem('bestTime', bestTime);
                    bestTimeDisplay.textContent = `Best Time: ${bestTime}s`;
                }
            }, 500);
        }
    }
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }
}
