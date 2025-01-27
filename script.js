async function loadCards() {
    const response = await fetch("cards.json");
    return await response.json();
}

let firstTile = null;
let secondTile = null;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createTiles(cards) {
    const shuffledCards = shuffle([...cards]);
    const gameContainer = document.getElementById("gameContainer");

    shuffledCards.forEach((card) => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.pair = card.pair;

        const img = document.createElement("img");
        img.src = card.img;
        tile.appendChild(img);

        tile.addEventListener("click", () => handleTileClick(tile));
        gameContainer.appendChild(tile);
    });
}

function handleTileClick(tile) {
    if (lockBoard || tile === firstTile || tile.classList.contains("matched")) {
        return;
    }

    const img = tile.querySelector("img");
    img.style.display = "block";

    if (!firstTile) {
        firstTile = tile;
    } else {
        secondTile = tile;
        lockBoard = true;

        if (firstTile.dataset.pair === secondTile.dataset.pair) {
            setTimeout(matchTiles, 500);
        } else {
            setTimeout(resetTiles, 1000);
        }
    }
}

function matchTiles() {
    firstTile.classList.add("matched");
    secondTile.classList.add("matched");
    resetBoard();
}

function resetTiles() {
    firstTile.querySelector("img").style.display = "none";
    secondTile.querySelector("img").style.display = "none";
    resetBoard();
}

function resetBoard() {
    [firstTile, secondTile] = [null, null];
    lockBoard = false;
}

loadCards().then(createTiles);