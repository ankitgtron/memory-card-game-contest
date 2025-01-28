// Write your code here

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const timerElement = document.getElementById('timer');
    const movesElement = document.getElementById('moves');
    const restartButton = document.getElementById('restartButton');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let timer = 0;
    let moves = 0;
    let timerInterval;

    restartButton.addEventListener('click', restartGame);

    fetch('cards.json')
        .then(response => response.json())
        .then(data => {
            cards = shuffle(data);
            createCE(cards);
            startTimer();
        })
        .catch(error => console.error('Error loading cards:', error));

    function createCE(cards) {
        gameBoard.innerHTML = ''; 
        cards.forEach(card => {
            const cardElement = createCardElement(card);
            gameBoard.appendChild(cardElement);
        });
    }
    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.pair === card2.dataset.pair) {
            matchedPairs++;
            flippedCards = [];
            if (matchedPairs === cards.length / 2) {
                clearInterval(timerInterval);
                setTimeout(() => alert('You won!'), 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.pair = card.pair;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = 'G-26';

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.style.backgroundImage = `url(${card.img})`;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        cardElement.addEventListener('click', () => {
            if (flippedCards.length < 2 && !cardElement.classList.contains('flipped')) {
                cardElement.classList.add('flipped');
                flippedCards.push(cardElement);
                moves++;
                updateMoves();

                if (flippedCards.length === 2) {
                    checkForMatch();
                }
            }
        });

        return cardElement;
    }

     function startTimer() {
        clearInterval(timerInterval);
        timer = 0;
        timerElement.textContent = `Time: ${timer}s`;
        timerInterval = setInterval(() => {
            timer++;
            timerElement.textContent = `Time: ${timer}s`;
        }, 1000);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

   

    function updateMoves() {
        movesElement.textContent = `Moves: ${moves}`;
    }

    function restartGame() {
        matchedPairs = 0;
        moves = 0;
        updateMoves();
        startTimer();
        cards = shuffle(cards);
        createCE(cards);
    }
});