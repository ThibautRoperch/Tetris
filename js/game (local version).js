

/**************************
 * Properties
 */

/**
 * Game properties
 */

var TIME = 0; // seconds
var SPEED = 1; // square per second
var LINES = 0;
var TIMER_CLOCK;
var GAME_OVER = true;

/**
 * Front-end properties
 */

var BORDER = 3; // pixels
var SIDE = 20; // pixels
var UNITE = SIDE + BORDER * 2; // pixels
var WELL = document.getElementsByTagName("well")[0];
var NEXT = document.getElementsByTagName("next")[0];
var COLUMNS_NB = 10;
var ROWS_NB = 22;

/**
 * Back-end properties
 */

var MATRIX = []; // row's list, elements are squares
var CURRENT_PIECE = null; // piece type
var NEXT_PIECE = null; // piece type
var SQUARE_ID = 0; // A.I.


/**************************
 * Game functions
 */

/**
 * Main function
 * Fill the matrix for the back-end, set the well's dimensions and its columns for the front-end, and launch + prepare the first pieces
 */
function startGame() {
	// The game is not over yet
	GAME_OVER = false;
	// Set well's dimensions
	WELL.style.width = UNITE * COLUMNS_NB + "px";
	WELL.style.height = UNITE * ROWS_NB + "px";
	// Fill the matrix
	for (var r = 0; r < ROWS_NB; ++r) {
		var row = [];
		for (var c = 0; c < COLUMNS_NB; ++c) {
			row.push(null);
		}
		MATRIX.push(row);
	}
	// Displays wells's columns
	for (var c = 0; c < COLUMNS_NB; ++c) {
		var column = document.createElement("column");
		column.style.width = UNITE + "px";
		WELL.appendChild(column);
	}
	// Prepare a first piece
	preparePiece();
	// Set next's dimensions
	NEXT.style.width = UNITE * (NEXT_PIECE.getStructure()[0].length + 1) + "px";
	NEXT.style.height = UNITE * (NEXT_PIECE.getStructure().length) + "px";
	// Launch a first piece
	launchPiece();
	// Start the game clock
	gameClock();
	// Start the timer clock
	timerClock();
	// Permanently check the database
	databaseClock();
}

/**
 * Move down the current piece every 1000 / SPEED milliseconds
 */
function gameClock() {
	setTimeout(function() {
		// Check for collision if the current piece moves down
		// If the piece can move down, move down the current piece
		// Else, block the piece at its position and launch a new piece
		if (CURRENT_PIECE.canMoveDown()) {
			CURRENT_PIECE.moveDown();
		} else {
			blockCurrentPiece();
			launchPiece();
		}
		// Continue the game if it isn't over yet
		if (!GAME_OVER) {
			gameClock();
		}
	}, 1000 / SPEED);
}

/**
 * Counter of the time spent playing a game
 */
function timerClock() {
	TIMER_CLOCK = setTimeout(function() {
		// Add 1 second
		TIME++;
		// Increase the speed by x squares per seconds every y seconds
		if (TIME % 60 == 0) {
			SPEED += 0.75;
		}
		// Reduce the columns' opacity
		var c = 0;
		while (WELL.getElementsByTagName("column")[c]) {
			WELL.getElementsByTagName("column")[c].style.opacity = 1 - TIME / 75;
			++c;
		}
		// Continue the timer
		timerClock();
	}, 1000);
}

/**
 * Put the prepared piece in the well and prepare a new one
 */
function launchPiece() {
	// Take the next piece
	CURRENT_PIECE = NEXT_PIECE;
	// Display the piece in the well
	displayPiece(CURRENT_PIECE.getStructure(), WELL, CURRENT_PIECE.getType()); 
	// Move the launched piece on the middle of the well
	actualizeCurrentPiece();
	// Prepare a new piece
	preparePiece();
	// If the piece can't spawn in the well, it's a game over
	if (!CURRENT_PIECE.canSpawn()) {
		gameOver();
	}
}

/**
 * Put a new piece (instead of the current one) in the board as the next one
 */
function preparePiece() {
	// Generate a new piece
	NEXT_PIECE = generatePiece();
	// Clean the current next piece
	if (NEXT.hasChildNodes()) {
		NEXT.removeChild(NEXT.lastChild);
	}
	// Display the piece like the next one
	displayPiece(NEXT_PIECE.getPreview(), NEXT, NEXT_PIECE.getType());
}

/**
 * Randomly generate a new piece, among the 7 tetriminos
 */
function generatePiece() {
	var type = "";
	
	var rand_int = Math.round(Math.random() * 6);
	
	if (rand_int == 0) { // tetrimino O
		type = "O";
	} else if (rand_int == 1) { // tetrimino I
		type = "I";
	} else if (rand_int == 2) { // tetrimino S
		type = "S";
	} else if (rand_int == 3) { // tetrimino Z
		type = "Z";
	} else if (rand_int == 4) { // tetrimino L
		type = "L";
	} else if (rand_int == 5) { // tetrimino J
		type = "J";
	} else if (rand_int == 6) { // tetrimino T
		type = "T";
	}

	var rotation = 0; // default rotation of the piece

	return new Piece(type, rotation);
}

/**
 * Display the given list of rows of squares in the given HTML node, with the given class name
 */
function displayPiece(rows, node, class_name) {
	var tetrimino = document.createElement("tetrimino");
	tetrimino.style.width = UNITE * rows[0].length + "px";
	tetrimino.style.height = UNITE * rows.length + "px";

	// Append a HTML square for each square in the piece's structure
	for (r = 0; r < rows.length; ++r) {
		for (c = 0; c < rows[r].length; ++c) {
			var square = document.createElement("square");
			square.style.width = SIDE + "px";
			square.style.height = SIDE + "px";
			square.style.borderWidth = BORDER + "px";
			if (rows[r][c] == 0) {
				square.className = "invisible";
			} else {
				square.className = class_name;
			}
			
			tetrimino.appendChild(square);
		}
	}

	node.appendChild(tetrimino);
}

/**
 * Actualize the position of the piece moving in the well
 */
function actualizeCurrentPiece() {
	// Remove the piece
	WELL.removeChild(WELL.lastChild);
	// Display the piece
	displayPiece(CURRENT_PIECE.getStructure(), WELL, CURRENT_PIECE.getType());
	// Position the piece
	WELL.lastChild.style.marginLeft = UNITE * (CURRENT_PIECE.absolute_position[0] - CURRENT_PIECE.relative_position[0]) + "px";
	WELL.lastChild.style.marginTop = UNITE * (CURRENT_PIECE.absolute_position[1] - CURRENT_PIECE.relative_position[1]) + "px";
	// Hide blocks who are out of bounds
	for (r = 0; r < CURRENT_PIECE.getStructure().length; ++r) {
		for (c = 0; c < CURRENT_PIECE.getStructure()[r].length; ++c) {
			var y_abs_pos = [CURRENT_PIECE.absolute_position[1] + r - CURRENT_PIECE.relative_position[1]];			
			if (y_abs_pos < 0) {
				WELL.lastChild.getElementsByTagName("square")[r * CURRENT_PIECE.getStructure().length + c].className = "invisible";
			}
		}
	}
}

/**
 * Update the matrix with each square of the current piece (the piece is blocked at its position)
 * Update the well by removing the piece and appending the corresponding squares
 */
function blockCurrentPiece() {
	var rows_updated = []; // order : highest row -> lowest row

	// Remove the piece
	WELL.removeChild(WELL.lastChild);

	// Append each square of the piece's structure in the matrix
	for (r = 0; r < CURRENT_PIECE.getStructure().length; ++r) {
		for (c = 0; c < CURRENT_PIECE.getStructure()[r].length; ++c) {
			if (CURRENT_PIECE.getStructure()[r][c] == 1) {
				// Compute the absolute position of the square
				// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
				var absolute_square_position = [CURRENT_PIECE.absolute_position[0] + c - CURRENT_PIECE.relative_position[0], CURRENT_PIECE.absolute_position[1] + r - CURRENT_PIECE.relative_position[1]];
				MATRIX[absolute_square_position[1]][absolute_square_position[0]] = new Square(SQUARE_ID++, CURRENT_PIECE.type);
				// Append this square of the piece to the well
				var square = document.createElement("square");
					square.style.width = SIDE + "px";
					square.style.height = SIDE + "px";
					square.style.borderWidth = BORDER + "px";
					square.style.marginLeft = UNITE * absolute_square_position[0] + "px";
					square.style.marginTop = UNITE * absolute_square_position[1] + "px";
					square.id = MATRIX[absolute_square_position[1]][absolute_square_position[0]].id;
					// square.innerHTML = square.id;
					square.className = CURRENT_PIECE.type;
				WELL.appendChild(square);
				// Add the position of this updated row
				if (rows_updated.indexOf(absolute_square_position[1]) === -1) {
					rows_updated.push(absolute_square_position[1]);
				}
			}
		}
	}

	var lines_counter = 0;

	// For each updated rows, remove squares contained in formed lines and drop the rows that are above
	for (r = 0; r < rows_updated.length; ++r) { // start with the highest line
		// If the entire row does not contain a null, this is a formed line
		if (MATRIX[rows_updated[r]].indexOf(null) === -1) {
			var line = rows_updated[r];
			lines_counter++;
			
			// Remove the squares's line from the well
			for (c = 0; c < MATRIX[line].length; ++c) {
				document.getElementById(MATRIX[line][c].id).remove();
			}				

			// For each row above the cleaned one...
			while (line > 0) {
				// ... drop its squares
				for (c = 0; c < MATRIX[line].length; ++c) {
					// Drop the top square, from the matrix and the well
					MATRIX[line][c] = MATRIX[line - 1][c];
					if (MATRIX[line - 1][c] != null) {
						document.getElementById(MATRIX[line - 1][c].id).style.marginTop = UNITE * line + "px";
					}
					MATRIX[line - 1][c] = null;
				}
				--line;
			}
		}
	}

	LINES += lines_counter;
}

/**
 * Manage the HTML onkeydown event
 */
function keyPressed(event) {
	if (GAME_OVER == false) {
		switch (event.key) {
			case "ArrowLeft": // horizontal move
				event.preventDefault();
				// Move left the current piece if possible
				if (CURRENT_PIECE.canMoveLeft()) {
					CURRENT_PIECE.moveLeft();
				}
				break;
			case "ArrowRight": // horizontal move
				event.preventDefault();
				// Move right the current piece if possible
				if (CURRENT_PIECE.canMoveRight()) {
					CURRENT_PIECE.moveRight();
				}
				break;
			case "ArrowUp": // clockwise rotation
				event.preventDefault();
				// Clockwise rotate the current piece if possible
				if (CURRENT_PIECE.canClockWiseRotate()) {
					CURRENT_PIECE.clockWiseRotate();
				}
				break;
			case " ": // hard drop
				event.preventDefault();
				// Move to the closer square the current piece
				while (CURRENT_PIECE.canMoveDown()) {
					CURRENT_PIECE.moveDown();
				}
				blockCurrentPiece();
				launchPiece();
				break;
			case "ArrowDown": // soft drop
				event.preventDefault();
				// Move left the current piece if possible
				if (CURRENT_PIECE.canMoveDown()) {
					CURRENT_PIECE.moveDown();
				} else {
					blockCurrentPiece();
					launchPiece();
				}
				break;
			case "a": // clockwise rotation
				// Clockwise rotate the current piece if possible
				event.preventDefault();
				if (CURRENT_PIECE.canClockWiseRotate()) {
					CURRENT_PIECE.clockWiseRotate();
				}
				break;
			case "z": // counterclockwise rotation
				// Counterclockwise rotate the current piece if possible
				event.preventDefault();
				if (CURRENT_PIECE.canCounterClockWiseRotate()) {
					CURRENT_PIECE.counterClockWiseRotate();
				}
				break;
			// touches pour sendItem() qui appelle un script php qui ajoute l'item en bdd, avec id du joueur et nom de l'item
			default:
				break;
		}
	}
}

/**
 * End the game
 */
function gameOver() {
	GAME_OVER = true;
	// Stop the timer clock
	clearTimeout(TIMER_CLOCK);
	// TODO message de game over
}

/*

 0 1 2 3 4
0 +------->
1 |         x
2 |
3 |
  v
    y

[x, y]

*/
