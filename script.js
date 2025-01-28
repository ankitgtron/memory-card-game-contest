let firstCard = null;
let secondCard = null;
let moves = 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

fetch("cards.json")
    .then((response) => response.json())
    .then((cards) => initGame(cards));


function initGame(cards) {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = ''; // Clear previous game
    const shuffledCards = shuffle(cards);

    shuffledCards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.pair = card.pair;

        const imgElement = document.createElement("img");
        imgElement.src = card.img;
        imgElement.classList.add("hidden");
        cardElement.appendChild(imgElement);

        gameContainer.appendChild(cardElement);
    });

    displayMoveCount();
    addEventListeners();
}


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


function addEventListeners() {
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => {
            if (card.classList.contains("flipped") || secondCard) return;

            card.classList.add("flipped");
            card.querySelector("img").classList.remove("hidden");

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                moves++;
                updateMoveCount();
                checkMatch(firstCard, secondCard);
            }
        });
    });
}


function checkMatch(card1, card2) {
    if (card1.dataset.pair === card2.dataset.pair) {
        [card1, card2].forEach((card) => {
            card.classList.add("matched");
            card.querySelector("img").classList.remove("hidden");
        });
        if (document.querySelectorAll(".card.matched").length === document.querySelectorAll(".card").length) {
            endGame();
        }
        resetTurn();
    } else {
        setTimeout(() => {
            [card1, card2].forEach((card) => {
                card.classList.remove("flipped");
                card.querySelector("img").classList.add("hidden");
            });
            resetTurn();
        }, 1000);
    }
}


function resetTurn() {
    firstCard = null;
    secondCard = null;
}


function displayMoveCount() {
    const moveCounter = document.createElement("div");
    moveCounter.classList.add("move-counter");
    moveCounter.textContent = `Moves: ${moves}`;
    document.body.insertBefore(moveCounter, document.querySelector(".game-container"));
}


function updateMoveCount() {
    const moveCounter = document.querySelector(".move-counter");
    moveCounter.textContent = `Moves: ${moves}`;
}

function endGame() {
    const gameContainer = document.querySelector(".game-container");
    const endGameMessage = document.createElement("div");
    endGameMessage.classList.add("end-game-message");
    endGameMessage.textContent = `Congratulations! You completed the game in ${moves} moves.`;
    gameContainer.parentNode.removeChild(gameContainer);
    document.body.insertBefore(endGameMessage, document.querySelector(".move-counter"));

    leaderboard.push(moves);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    displayRestartButton();
    displayLeaderboard(); 
}

function displayRestartButton() {
    const restartButton = document.createElement("button");
    restartButton.classList.add("restart-button");
    restartButton.textContent = "Restart Game";
    document.body.appendChild(restartButton);

    restartButton.addEventListener("click", () => {
        firstCard = null;
        secondCard = null;
        moves = 0;
        updateMoveCount();
        document.querySelector(".move-counter").textContent = "Moves: 0";
        location.reload();
    });
}

function displayLeaderboard() {
    leaderboard.sort((a, b) => a - b);

    const leaderboardContainer = document.createElement("div");
    leaderboardContainer.classList.add("leaderboard-container");

    const leaderboardTitle = document.createElement("h2");
    leaderboardTitle.textContent = "Leaderboard";
    leaderboardContainer.appendChild(leaderboardTitle);

    const leaderboardList = document.createElement("ol");
    leaderboard.forEach((moves, index) => {
        const leaderboardItem = document.createElement("li");
        leaderboardItem.textContent = `${index + 1}. ${moves} moves`;
        leaderboardList.appendChild(leaderboardItem);
    });
    leaderboardContainer.appendChild(leaderboardList);

    document.body.appendChild(leaderboardContainer);
}

function displayLeaderboardButton() {
    const leaderboardButton = document.createElement("button");
    leaderboardButton.classList.add("leaderboard-button");
    leaderboardButton.textContent = "Leaderboard";
    document.body.appendChild(leaderboardButton);

    leaderboardButton.addEventListener("click", () => {
        displayLeaderboard();
    });
}

initGame();
