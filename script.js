const cards = document.querySelectorAll('.card');
const playAgainBtn = document.getElementById('play-again');
const congratulations = document.getElementById('congratulations');
const startBtn=document.getElementById("startbtn");
const moveUpdate=document.getElementById("moves");

playAgainBtn.addEventListener('click', () => window.location.reload());

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = true;
let matchesFound = 0;
let moves=0;
let timer=0;
let pause=false;
const totalPairs = 8;

startBtn.addEventListener("click",()=>{
    lockBoard = false;
    playAgainBtn.style.display = 'block';
    startBtn.style.display='none';
    timerUpdate();
});
cards.forEach(card => {
    card.addEventListener('click', flipCard);
});

shuffle();

function flipCard() {
    
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
    moves++;
    moveUpdate.innerHTML=`${moves}`;
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
    if (matchesFound === totalPairs) showCongratulations();
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
function showCongratulations() {
    playAgainBtn.style.display = 'block';
    pause=true;
    clearInterval(timerUpdate);
    congratulations.style.display = 'block';
    moveUpdate.innerHTML=`00`; 
    document.getElementById("timer").innerHTML=`00`;
    document.getElementById("congratulations").innerHTML=`Congratulations!<br> moves taken ${moves} <br> time taken ${timer} sec`
    moves=0;
    timer=0;
}

function timerUpdate(){
    setTimeout(()=>{
        document.getElementById("timer").innerHTML=`${timer}`; 
        timer++;
        if(!pause){
            timerUpdate();
        } 
          
    },1000)
}