$(document).ready(function () {

    //**Initialization and Setup**
    // Setup canvas and context
    // Get the canvas element and its 2D drawing context
    const canvas = document.getElementById('tetris-board');
    const ctx = canvas.getContext('2d');
    // Set the size of each block and the dimensions of the grid (rows and columns)
    const blockSize = 30; // Size of each block in pixels
    const rows = 20; // Number of rows in the game board
    const cols = 10; // Number of columns in the game board

    // Calculate the width and height of the game board based on the number of rows and columns
    const boardWidth = blockSize * cols; // Calculate board width
    const boardHeight = blockSize * rows; // Calculate board height

    // Set the canvas dimensions to match the calculated board dimensions
    canvas.width = boardWidth;
    canvas.height = boardHeight;

    //**Game Variables**
    // Initialize variables for tracking the game's state, such as the score, level, time left, etc.
    let score = 0; // Player's score
    let level = 1; // Current game level
    let timeLeft = 300; // Time left in seconds
    let interval; // Timer interval for countdown
    let dropTimer; // Timer interval for piece dropping
    let isPaused = false; // Flag to check if the game is paused
    let isGameRunning = false; // Flag to check if the game is running
    let board = Array.from({ length: rows }, () => Array(cols).fill(0)); // Initialize the game board as a 2D array filled with zeros (empty cells), where all columns are initially filled with 0.The outer array has rows number of elements (each representing a row on the board).Each element in the outer array is itself an array created by the arrow function, which has cols elements, all initialized to 0.This arrow function generates a single row for the Tetris board,
    let currentPiece; // The piece currently falling
    let dropInterval = 1000; // Interval for how often the piece drops (in milliseconds)

    // Define the shapes and colors for the different Tetris pieces
    // Each shape is represented by a 2D array and has an associated color
    const shapes = [
        { shape: [[1, 1, 1, 1]], color: 'cyan' }, // I
        { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' }, // T
        { shape: [[1, 1], [1, 1]], color: 'yellow' }, // O
        { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' }, // S
        { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' }, // Z
        { shape: [[0, 0, 1], [1, 1, 1]], color: '#1E90FF' }, // L
        { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' } // J
    ];

    //**Drawing Functions**
    // Function to draw the game board on the canvas
    function drawBoard() {
        ctx.clearRect(0, 0, boardWidth, boardHeight); // Clear the entire canvas

        // Loop through each cell of the game board
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (board[row][col]) {
                    // Draw filled rectangles for blocks
                    // If the cell is filled (not zero), draw a block at that position
                    ctx.fillStyle = 'gray'; // Set the color for filled blocks
                    ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize); // Draw the block, fillRect(x, y, width, height).This is a method of the CanvasRenderingContext2D object that draws a filled rectangle on the canvas.
                    ctx.strokeStyle = 'black'; // Set the border color
                    ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize); // Draw the border around the block
                }
            }
        }
    }

    // Function to draw the current piece on the canvas
    // The piece is drawn at the specified offset (offsetX, offsetY)
    function drawPiece(piece, offsetX, offsetY) {
        ctx.fillStyle = piece.color; // Set color of the piece

        // Loop through each cell in the piece's shape array
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    // Draw the piece
                    // If the cell is part of the piece (not zero), draw the block
                    ctx.fillRect((offsetX + x) * blockSize, (offsetY + y) * blockSize, blockSize, blockSize); // Draw the block at the correct position
                    ctx.strokeStyle = 'black'; // Set the border color
                    ctx.strokeRect((offsetX + x) * blockSize, (offsetY + y) * blockSize, blockSize, blockSize); // Draw the border around the block
                }
            });
        });
    }

    //**Game Logic Functions**
    // Function to check if the current piece collides with the board boundaries or other pieces
    function isCollision(piece, offsetX, offsetY) {
        return piece.shape.some((row, y) =>
            row.some((value, x) => {
                if (value) {
                    // Calculate the new position of the piece
                    let newX = offsetX + x;
                    let newY = offsetY + y;
                    // Check for collisions with the board boundaries or other pieces
                    return (
                        newX < 0 || newX >= cols || // Out of bounds on the left or right
                        newY >= rows || // Out of bounds below the board
                        board[newY][newX] // Collision with another piece on the board
                    );
                }
                return false;
            })
        );
    }

    // Function to merge the current piece into the board
    function mergePiece(piece, offsetX, offsetY) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    // Add the piece to the board array at the correct position
                    board[offsetY + y][offsetX + x] = value; // Add piece to board
                }
            });
        });
    }

    // Function to clear completed lines from the board and update the score and level
    function clearLines() {
        for (let y = rows - 1; y >= 0; y--) {
            if (board[y].every(cell => cell)) { // Check if the entire row is filled
                board.splice(y, 1); //Remove the completed line from the board
                board.unshift(Array(cols).fill(0)); // Add a new empty line at the top of the board, unshift() adds new items to the beginning of an array
                score += 100; // Increase the score for clearing a line
                updateScore(); // Update the score display
                // Since the current row has been removed, check the new row at the same index again
                y++; // Re-check the line at this row
            }
        }
        // Level up if the score reaches the threshold for the next level
        if (score >= level * 300) { // Level up condition
            level++; // Increase the game level
            dropInterval = Math.max(100, dropInterval - 100); // Decrease the drop interval (increase the speed)
            startDropTimer(); // Restart drop timer with the new interval
            updateScore(); // Update the score and level display
        }
    }

    //**Game Control Functions**
    // Function to reset the game to its initial state
    function resetGame() {
        clearInterval(dropTimer); // Stop the drop timer
        clearInterval(interval); // Stop the game timer
        score = 0; // Reset the score
        level = 1; // Reset the level
        timeLeft = 300; // Reset the time
        isPaused = false; // Unpause the game
        isGameRunning = false;
        board = Array.from({ length: rows }, () => Array(cols).fill(0)); // Clear the board by filling it with zeros
        currentPiece = null; // Clear the current piece
        updateScore(); // Update the score display
        updateTime(); // Update the time display
        $('#game-over-modal').modal('hide'); // Hide the game over modal if it was shown
        drawBoard(); //  Redraw the board to reflect the reset state
    }

    // Function to start or resume the game
    function startGame() {
        if (!isGameRunning) {
            resetGame(); // Ensure the game is reset before starting
            generatePiece(); // Generate a new piece
            startTimer(); // Start the game timer
            startDropTimer(); // Start the piece drop timer
            isGameRunning = true; // Mark the game as running
        } else if (isPaused) {
            isPaused = false; // Unpause the game if it was paused
            $('#pause-btn').text('Pause'); // Change button text to 'Pause'
        }
    }

    // Function to start or resume the countdown timer for the game
    function startTimer() {
        interval = setInterval(() => {
            if (!isPaused) {
                timeLeft--; // Decrease the time left by 1 second
                if (timeLeft <= 0) {
                    gameOver(); // End the game if time runs out
                } else {
                    updateTime(); // Update the time display
                }
            }
        }, 1000); // Update every second
    }

    // Start or resume the piece drop timer
    function startDropTimer() {
        clearInterval(dropTimer); // Clear any existing drop timer to avoid multiple timers running simultaneously
        dropTimer = setInterval(() => {
            if (!isPaused) {
                movePieceDown(); // Move the piece down every interval
            }
        }, dropInterval); // Use the current drop interval (which changes with the level)
    }

    // Function to update the score and level display
    function updateScore() {
        $('#score').text(`Score: ${score}`); // Update the score display
        $('#level').text(`Level: ${level}`); // Update the level display
    }

    // Update the timer display
    function updateTime() {
        $('#timer').text(`Time: ${timeLeft}`); // Update the time display
    }

    // Function to handle the game over state
    function gameOver() {
        clearInterval(interval); // Stop the countdown timer
        clearInterval(dropTimer); // Stop the piece drop timer
        $('#final-score').text(score); // Display final score
        $('#final-level').text(level); // Display final level
        $('#game-over-modal').modal('show'); // Show the game over modal
        isGameRunning = false; // Mark the game as not running
    }

    //**Piece Management Functions**
    // Function to generate a new piece and place it at the top of the board
    function generatePiece() {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        currentPiece = {
            shape: randomShape.shape, // Randomly select a shape from the shapes array
            color: randomShape.color, // Randomly select a color from the shapes array
            x: Math.floor((cols - randomShape.shape[0].length) / 2), // Center piece horizontally
            y: 0 // Start the piece at the top of the board
        };

        // End the game if the new piece collides immediately
        if (isCollision(currentPiece, currentPiece.x, currentPiece.y)) {
            gameOver(); // End game if new piece collides immediately
        }
    }

    // Function to move the current piece down one row
    function movePieceDown() {
        if (!isCollision(currentPiece, currentPiece.x, currentPiece.y + 1)) {
            // If there is no collision, move the piece down by increasing its y position
            currentPiece.y++; // Move piece down if no collision
        } else {
            // If there is a collision, merge the piece into the board and generate a new piece
            mergePiece(currentPiece, currentPiece.x, currentPiece.y); // Merge piece into the board
            clearLines(); // Clear completed lines
            generatePiece(); // Generate a new piece
        }
        drawBoard(); // Redraw the board to show the piece in its new position
        drawPiece(currentPiece, currentPiece.x, currentPiece.y); // Draw the current piece in its new position
    }

    // Function to rotate the current piece
    function rotatePiece() {
        // Create a new array for the rotated shape by rotating 90 degrees clockwise
        const newShape = currentPiece.shape[0].map((_, i) =>
            currentPiece.shape.map(row => row[i]).reverse()
        );
        const oldShape = currentPiece.shape;
        currentPiece.shape = newShape;
        // Check if the rotated piece would collide with anything on the board
        if (isCollision(currentPiece, currentPiece.x, currentPiece.y)) {
            currentPiece.shape = oldShape; // Revert rotation if collision occurs
        }
        drawBoard(); // Redraw the board to show the rotated piece
        drawPiece(currentPiece, currentPiece.x, currentPiece.y); // Redraw the rotated piece
    }

    //**Event Handlers**
    // Handle the start button click event
    $('#start-btn').click(() => {
        startGame(); // Start or resume the game
    });

    // Handle the pause button click event
    $('#pause-btn').click(() => {
        if (isGameRunning) {
            isPaused = !isPaused; // Toggle the pause state
            $('#pause-btn').text(isPaused ? 'Resume' : 'Pause'); // Toggle button text
        }
    });

    // Handle the reset button click event
    $('#reset-btn').click(() => {
        resetGame(); // Reset the game
    });

    // Handle the play again button click event
    $('#play-again-btn').click(() => {
        resetGame(); // Reset and restart game from the game over modal
        $('#game-over-modal').modal('hide');
        startGame(); // Start a new game
    });

    // Keyboard controls for piece movement
    $(document).keydown(function (e) {
        if (isPaused || !currentPiece) return; // Ignore input if paused or no piece

        switch (e.which) {
            case 37: // Left arrow key
                if (!isCollision(currentPiece, currentPiece.x - 1, currentPiece.y)) {
                    currentPiece.x--; // Move the piece left
                }
                break;
            case 39: // Right arrow key
                if (!isCollision(currentPiece, currentPiece.x + 1, currentPiece.y)) {
                    currentPiece.x++; // Move the piece right
                }
                break;
            case 40: // Down arrow key
                movePieceDown(); // Move the piece down
                break;
            case 38: // Up arrow key
                rotatePiece(); // Rotate the piece
                break;
        }
        drawBoard(); // Redraw the board to show the updated piece position
        drawPiece(currentPiece, currentPiece.x, currentPiece.y); // Redraw the current piece
    });
});
