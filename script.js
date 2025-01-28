// Write your code here

const imagePaths = [
    'images/aeroplane.jpg', 'images/aeroplane-match.jpg',
    'images/cat.jpg', 'images/cat-match.jpg',
    'images/crocodile.jpg', 'images/crocodile-match.jpg',
    'images/dog.jpg', 'images/dog-match.jpg',
    'images/elephant.jpg', 'images/elephant-match.jpg',
    'images/fish.jpg', 'images/fish-match.jpg',
    'images/lion.jpg', 'images/lion-match.jpg',
    'images/snake.jpg', 'images/snake-match.jpg'
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const shuffledImages = shuffle([...imagePaths]);

const boxes = document.querySelectorAll('.box');
let firstCard = null;
let secondCard = null;
let lockBoard = false;

boxes.forEach((box, index) => {
    const img = document.createElement('img');
    img.src = shuffledImages[index];
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'none';
    box.appendChild(img);

    box.addEventListener('click', () => {
        if (lockBoard || img.style.display === 'block') return;

        img.style.display = 'block';

        if (!firstCard) {
            firstCard = { box, img };
        } else {
            secondCard = { box, img };
            lockBoard = true;

            setTimeout(() => {
                if (firstCard.img.src === secondCard.img.src.replace('-match', '').replace('.jpg', '') + '-match.jpg' ||
                    secondCard.img.src === firstCard.img.src.replace('-match', '').replace('.jpg', '') + '-match.jpg') {
                    firstCard = null;
                    secondCard = null;
                } else {
                    firstCard.img.style.display = 'none';
                    secondCard.img.style.display = 'none';
                    firstCard = null;
                    secondCard = null;
                }
                lockBoard = false;
            }, 1000);
        }
    });
});
