# jQuery-Tetris-Game
A simple and responsive Tetris game built with HTML, CSS, JavaScript, and Bootstrap 5. This game includes scoring, level progression, a countdown timer, and game-over conditions, all displayed alongside the game board in a dark-themed UI.

Features:

Classic Tetris Gameplay: Move, rotate, and stack falling Tetris blocks to clear lines.
Score & Levels: Track your score and increase game speed as you level up.
Pause/Resume: Pause the game at any time and resume without resetting the current state.
Responsive UI: The game adapts to various screen sizes and maintains a clean layout.
Dark Theme: dark-themed UI using Bootstrap 5 for a visually appealing experience.


Getting Started

Prerequisites

To run this game locally, you need a modern web browser and the following:


Basic knowledge of HTML, CSS, and JavaScript

Bootstrap 5 (already included in the project)


Game Controls

Use the following keyboard controls to play the game:


Arrow keys:

Left Arrow (←): Move the current piece left

Right Arrow (→): Move the current piece right

Down Arrow (↓): Move the current piece down faster

Up Arrow (↑): Rotate the current piece clockwise


Buttons:


Start: Starts the game or resumes a paused game

Pause: Pauses the game without resetting the current state

Reset: Resets the game back to the initial state

Play Again: Appears in the game-over modal, allows restarting the game
Customization


Changing Block Size or Grid Dimensions

You can customize the size of each block and the grid dimensions by modifying the following variables in the JavaScript code:

```
const blockSize = 30; // Block size in pixels

const rows = 20;      // Number of rows on the board

const cols = 10;      // Number of columns on the board
```

Dark Theme

The game's dark theme is implemented using Bootstrap and custom CSS. If you want to customize the color scheme further, modify the relevant styles in the style.css file.


UI Layout

The game board and control buttons are arranged using Bootstrap's row and col classes. If you need to modify the layout, you can tweak the HTML structure inside the .container element.


License

This project is open-source and available under the MIT License.
