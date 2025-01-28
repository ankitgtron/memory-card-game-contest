// Write your code here
const cardsEl = document.querySelector(".cards");

const cards = [];
const imgs = [ "aeroplane", "cat","crocodile","dog","elephant","fish","lion","snake"];

for (let i = 0; i < 16; i++) {
  let el = document.createElement("div");
  el.classList.add("card");
  el.innerHTML = `<img class="hide" src="./images/${imgs[i % 8]}.jpg" alt=${
    imgs[i % 8]
  }/>`;
  cards.push(el);
}
// memory-card-game-contest/images/aeroplane-match.jpg

cards.sort(() => {
  return Math.random() - 0.5;
});

for (let c of cards) {
  cardsEl.append(c);
}

let isFirstCardFlipped = null;
let isSecondCardFlipped = null;

for (let c of cards) {
  c.addEventListener("click", async () => {
    if (isFirstCardFlipped == null && isSecondCardFlipped == null) {
      c.children[0].classList.remove("hide");
      isFirstCardFlipped = c;
    } else if (isFirstCardFlipped && isSecondCardFlipped == null) {
      c.children[0].classList.remove("hide");
      isSecondCardFlipped = c;
      if (
        isFirstCardFlipped.children[0].src !==
        isSecondCardFlipped.children[0].src
      ) {
        // to create delay of 1 sec 
        await new Promise((r) => setTimeout(r, 1000));
        isFirstCardFlipped.children[0].classList.add("hide");
        isSecondCardFlipped.children[0].classList.add("hide");
      } else {
        let isWin = checkWin();
        if (isWin) {
          window.location.href = "win.html";
        }
      }
      isFirstCardFlipped = null;
      isSecondCardFlipped = null;
    }
  });
}

const checkWin = () => {
  for (let c of cards) {
    if (c.children[0].classList.contains("hide")) {
      return false;
    }
  }
  return true;
};