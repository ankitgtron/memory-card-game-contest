// Write your code here
let data = async () => {
    let res = await fetch("cards.json");
    return res.json();
};

let gameBoard = document.getElementById('gameBoard');
let timerElement = document.getElementById('timer');
let scoreElement = document.getElementById('score');
let wonElement = document.getElementById('won');

let flip = false;
let firstcard = null;
let firstPair = null;
let score = 0;
let timer = null;
let timeElapsed = 0;
let gameStarted = false;
let count = 0;


async function setupGameBoard() {
    let temp = await data();
    const div = document.createElement('div');
    gameBoard.innerHTML = ""
    shuffle(temp);
    div.classList.add("wrapper");
    temp.forEach(element => {
        const card = document.createElement("div");
        card.classList.add('box');
        card.classList.add('flipper');
        card.dataset.pair = element.pair;

        const img = document.createElement('img');
        img.src = element.img;
        img.style.visibility = "hidden";

        card.appendChild(img);
        div.appendChild(card);
        card.addEventListener('click', () => handleCardClick(img, element.pair));
    });
    gameBoard.append(div);
}


async function main() {
    setupGameBoard();
}


function updateScore() {
    score += 1;
    scoreElement.innerText = `Score: ${score}`;

    if (score === 8) {
        clearInterval(timer); 
        wonElement.innerText = `You solved it in ${timeElapsed} seconds!`;
        setTimeout(() => {
            resetBoard();
        }, 2000);
    }
}
function resetBoard() {
    score = 0;
    timeElapsed = 0;
    gameStarted = false;
    flip = false;
    firstcard = null;
    firstPair = null;
    count = 0;
    scoreElement.innerText = `Score: ${score}`;
    timerElement.innerText = `Time: ${timeElapsed} seconds`;
    wonElement.innerText = "";
    clearInterval(timer);
    timer = null;
    setupGameBoard();
}


function handleCardClick(img, pair) {
    if(count==2) return;
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    count++;
    img.style.visibility = "visible";

    setTimeout(() => {
        if (flip) {
            if (firstPair === pair) {
                firstcard.style.visibility = "visible";
                firstcard = null;
                firstPair = null;
                updateScore();
                count = 0;
            } else {
                firstcard.style.visibility = "hidden";
                img.style.visibility = "hidden";
                firstPair = null;
                firstcard = null;
                count = 1;
            }
            flip = false;
        } else {
            firstcard = img;
            firstPair = pair;
            img.style.visibility = "visible";
            flip = true;
            count = 1;
        }
    }, 200);
}
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }


function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        timerElement.innerText = `Time: ${timeElapsed} seconds`;
    }, 1000);
}
main();
