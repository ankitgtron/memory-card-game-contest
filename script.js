let board=document.getElementById("board");
let cards = [];
let moves = 0;
let flippedCards = [];
let secElapsed = 0;
let timer;

fetch("cards.json")
.then((response)=>response.json())
.then((data)=>{
    cards=data.sort(() => Math.random() - 0.5);
    createGrid(cards);
})
.catch((error)=>console.error(error));

function createGrid(card){
    board.innerHTML = "";
    cards.forEach((card, index) => {
        const block = document.createElement("div");
        block.id = `block-${index}`;
        block.className = "block";
        block.dataset.pair = card.pair;
        block.style.backgroundImage = "none"; // Initially hide the image
        block.addEventListener("click", () => flipCard(block, card.img));
        board.appendChild(block);
    });
    moves = 0;
    flippedCards = [];
    secElapsed = 0;
    updateScoreBoard();
    timerStart();
}

function updateScoreBoard() {
    document.getElementById("moves").textContent = moves;
}

function flipCard(block, img) {
    if (flippedCards.length === 2 || block.classList.contains("flipped")) return;

    block.classList.add("flipped");
    block.style.backgroundImage = `url(${img})`;
    flippedCards.push(block);

    if (flippedCards.length === 2) {
        moves++;
        check();
    }
    updateScoreBoard();
}

function check() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.pair === c2.dataset.pair) {
        setTimeout(()=>{
            c1.style.visibility="hidden";
            c2.style.visibility="hidden";
            flippedCards = [];
        }, 100);
    } else {
        setTimeout(() => {
            c1.classList.remove("flipped");
            c1.style.backgroundImage = "none";
            c2.classList.remove("flipped");
            c2.style.backgroundImage = "none";
            flippedCards = [];
        }, 1000);
    }
}

function timerStart() {
    clearInterval(timer);
    timer = setInterval(() => {
        secElapsed++;
        document.getElementById("time").textContent = formatTime(secElapsed);
    }, 1000);
}

function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function resetGame() {
    clearInterval(timer);
    secElapsed = 0;
    moves = 0;
    flippedCards = [];
    document.getElementById('moves').innerText="0";
    document.getElementById('time').innerText="00:00";
    createGrid(cards.sort(() => Math.random() - 0.5));
}
