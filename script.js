// Write your code here
//final
const cards = document.querySelectorAll('.card');
let flippedCards = [];
let matchedPairs = 0;

cards.forEach(card => {
  card.addEventListener('click', () => flipCard(card));
});

function flipCard(card) {
  if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }
  
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch(); 
  }
} 

function checkForMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.dataset.card === card2.dataset.card) {
    matchedPairs++;
    card1.classList.add('matched');
    card2.classList.add('matched');
    resetFlippedCards();

    if (matchedPairs === cards.length / 2) {
      setTimeout(() => alert('You Win!'), 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      resetFlippedCards();
    }, 1000);
  }
}

function resetFlippedCards() {
  flippedCards = [];
}