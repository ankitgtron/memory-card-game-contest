const board = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moveCount');
const timeDisplay = document.getElementById('timer');
const scoreboard = document.getElementById('leaderboardList');

let cardArray = [];
let selectedCards = [];
let moves = 0;
let seconds = 0;
let timerId;
let pairsFound = 0;


const imageList = [
    'aeroplane.jpg', 'cat.jpg', 'crocodile.jpg', 'dog.jpg',
    'elephant.jpg', 'fish.jpg', 'lion.jpg', 'snake.jpg'
];


const deck = [...imageList, ...imageList];

function mixCards(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


function startGame() {
    mixCards(deck);
    board.innerHTML = '';
    selectedCards = [];
    moves = 0;
    pairsFound = 0;
    movesDisplay.textContent = moves;
    timeDisplay.textContent = seconds;
    clearInterval(timerId);
    seconds = 0;
    timerId = setInterval(() => {
        seconds++;
        timeDisplay.textContent = seconds;
    }, 1000);

    deck.forEach((img, idx) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.img = img;
        card.addEventListener('click', selectCard);
        board.appendChild(card);
    });
}


function selectCard() {
    if (this.classList.contains('matched') || selectedCards.length === 2) {
        return;
    }

    this.classList.add('flipped');
    this.style.backgroundImage = `url('images/${this.dataset.img}')`;
    selectedCards.push(this);

    if (selectedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        setTimeout(verifyMatch, 500);
    }
}


function verifyMatch() {
    const [firstCard, secondCard] = selectedCards;

    if (firstCard.dataset.img === secondCard.dataset.img) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        pairsFound++;

        if (pairsFound === imageList.length) {
            clearInterval(timerId);
            saveScore();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.style.backgroundImage = '';
            secondCard.style.backgroundImage = '';
        }, 500);
    }

    selectedCards = [];
}


function saveScore() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ time: seconds, moves: moves });
    scores.sort((a, b) => a.time - b.time);
    localStorage.setItem('scores', JSON.stringify(scores));
    showLeaderboard();
}


function showLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scoreboard.innerHTML = scores
        .slice(0, 5)
        .map((entry, idx) => `<li>#${idx + 1}: Time - ${entry.time}s, Moves - ${entry.moves}</li>`)
        .join('');
}


startGame();
showLeaderboard();