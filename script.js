// Write your code here
const cards = document.querySelectorAll('.card');
const startButton = document.querySelector('.start');
const moves = document.querySelector('.moves');
const end = document.getElementById('end');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchesFound = 0;
const totalPairs = 8;
let move = 0;
let seconds =0;
let pause = false;


function startGame(){
    document.getElementById("gameBoard").style.display = "grid";
    startButton.style.display = "none";
    timer();
    
cards.forEach(card => {
    card.addEventListener('click', flipCard);
    
});

function flipCard() {
    
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
    move++;
    moves.innerHTML = move;

    this.classList.add('flipped');
    console.log(`Flipped card: ${this.dataset.image}`);
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchesFound++;
    if (matchesFound === totalPairs) endGame();
    resetBoard();
}

function unflipCards() {
    lockBoard = true; 
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        const randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
}

function timer(){
    let sec = 0;
    setInterval(function(){
        if(pause){
            clearInterval();
        }
        sec++;
        document.getElementById('timer').innerHTML = sec;
        seconds = sec;
    }, 1000);
}

shuffle();

function endGame(){
    end.classList.remove('display');
    end.innerText = `Congratulations! You have completed the game in ${move} moves and in ${seconds} seconds`;
    moves.innerHTML = 0;
    pause = true;
    const restart = document.createElement('button');
    restart.innerText = 'Restart';
    restart.onclick = function(){
        window.location.reload();
    }
    end.appendChild(restart);
}
}
