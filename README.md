
# Memory Card Game Challenge

Welcome to the **Memory Card Game** challenge! This project involves creating a memory card game where players need to match pairs of cards. The game is a great way to showcase your skills in HTML, CSS, and JavaScript.

## Project Structure

```
memory-card-game/
│
├── .github     # This file not for you, pls don't modify it.
├── images/                    # Folder containing images for the cards
│   ├── aeroplane.jpg
│   ├── cat.jpg
│   ├── crocodile.jpg
│   ├── dog.jpg
│   ├── elephant.jpg
│   ├── fish.jpg
│   ├── lion.jpg
│   └── snake.jpg
│
├── css/                       # Folder containing the CSS for styling
│   └── style.css
│
├── js/                         # Folder containing JavaScript files
│   └── script.js                 # Main game logic (to be implemented by participants)
│
├── index.html                 # The main HTML file for the game
├── evaluate.js                #This file is not for you, pls don't modify it!!!
├── README.md                  # This file - documentation about the project
└── LICENSE                    # License file for the project
```

## About the Project

The **Memory Card Game** is a fun and interactive game where the player needs to match pairs of identical cards. 

### What You Need to Do

1. **Implement the Game Logic**:
   - The game will display a set of cards face down.
   - Players click to flip the cards and match pairs.
   - If two cards match, they stay face-up; if not, they flip back.
   - Track the number of moves and time taken to complete the game.

2. **Enhance the User Interface**:
   - Use the `style.css` file to style the cards and the game board.
   - Ensure that the game looks polished and intuitive.

3. **Test the Game**:
   - Make sure the game functions correctly by testing the card flipping, matching logic, and user interactions.

## How to Participate

1. **Clone the Repository**:
   To start, clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/memory-card-game.git
   ```

2. **Develop the Game**:
   Modify the `script.js` file to implement the game logic.
   - The game should randomly shuffle and display the cards.
   - Implement the logic to flip cards, check for matches, and track the number of moves and time taken.

3. **Push Your Changes**:
   Once you've completed your solution, commit your changes and push them to your forked repository.

4. **Submit Your Solution**:
   Submit your completed project to the provided contest platform or as instructed.

## Evaluation Criteria

Your submission will be evaluated based on the following:

1. **Game Functionality**: Does the game work as expected? Can the user flip cards and match them correctly?
2. **Code Quality**: Is the code well-organized, clean, and easy to follow?
3. **User Experience**: Is the game intuitive, and does it provide a smooth experience for players?
4. **Design**: How visually appealing is the game? Are the animations and interactions smooth?

## Evaluation Process

When you open a PR, GitHub Actions will run the evaluation script (`evaluate.js`). It will check if:
- The required files (`index.html`, `css/style.css`, `js/script.js`) are present.
- The game logic in `script.js` is working correctly.

If your PR passes the checks, it will be ready to merge. If not, the PR will be rejected with an error message indicating what needs to be fixed.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Key Sections:
- **Project Structure**: A clear breakdown of the folder and file structure in the repository.
- **About the Project**: A brief description of the Memory Card Game and its objective.
- **What You Need to Do**: A list of tasks that participants need to complete to finish the project.
- **How to Participate**: Instructions on how to clone the repo, implement the game, and submit their solution.
- **Evaluation Criteria**: The aspects that will be evaluated in the submissions.
- **License**: Information about the project license (MIT License).
