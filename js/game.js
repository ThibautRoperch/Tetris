

/**************************
 * Properties
 */

/**
 * Game properties
 */

var TIME; // seconds
var SPEED; // square per second
var LINES;
var TIMER_CLOCK;
var GAME_OVER;

/**
 * Front-end properties
 */

var BORDER; // pixels
var SIDE; // pixels
var UNITE; // pixels
var WELL;
var NEXT;
var COLUMNS_NB;
var ROWS_NB;

/**
 * Back-end properties
 */

var MATRIX; // row's list, elements are squares
var CURRENT_PIECE; // piece type
var NEXT_PIECE; // piece type


/**************************
 * Game functions
 */

/**
 * Reset all properties
 */
function resetProperties() {
	// Game ones
	TIME = 0;
	SPEED = 1;
	LINES = 0;
	GAME_OVER = true;
	// Front-end ones
	BORDER = 3;
	SIDE = 20;
	UNITE = SIDE + BORDER * 2;
	WELL = document.getElementsByTagName("well")[0];
	NEXT = document.getElementsByTagName("next")[0];
	COLUMNS_NB = 10;
	ROWS_NB = 22;
	// Back-end ones
	MATRIX = [];
	CURRENT_PIECE = null;
	NEXT_PIECE = null;
	SQUARE_ID = 0;
}

/**
 * Main function
 * Recover the matrix from the database for the back-end, set the well's dimensions and its columns for the front-end, and launch + prepare the first pieces
 */
function startGame() {
	// Reset properties, they might be recycled
	resetProperties();
	// The game is not over yet
	GAME_OVER = false;
	// Recover the matrix from the database
	// TODO récupérer la matrice depuis la base
	for (var r = 0; r < ROWS_NB; ++r) {
		var row = [];
		for (var c = 0; c < COLUMNS_NB; ++c) {
			row.push(null);
		}
		MATRIX.push(row);
	}
	// Update the number of rows and colomns with those obtained from the matrix
	ROWS_NB = MATRIX.length;
	COLUMNS_NB = (ROWS_NB > 0) ? MATRIX[0].length : 0;
	// Clean the well, it might be recycled
	while (WELL.hasChildNodes()) {
		WELL.removeChild(WELL.lastChild);
	}
	// Set well's dimensions
	WELL.style.width = UNITE * COLUMNS_NB + "px";
	WELL.style.height = UNITE * ROWS_NB + "px";
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
			SPEED += 1;
		}
		// Reduce the columns' opacity
		var c = 0;
		while (WELL.getElementsByTagName("column")[c]) {
			WELL.getElementsByTagName("column")[c].style.opacity = 1 - TIME / 100;
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
	
	var rand_int = Math.round(Math.random() * 6); // tetrimino type
	var rotation = 0; // default rotation of the piece

	return new Piece(TYPES[rand_int], rotation);
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
 * Return the well's current piece
 */
function wellCurrentPiece() {
	return WELL.getElementsByTagName("tetrimino")[0];
}

/**
 * Actualize the position of the piece moving in the well
 */
function actualizeCurrentPiece() {
	// Remove the piece
	WELL.removeChild(wellCurrentPiece());
	// Display the piece
	displayPiece(CURRENT_PIECE.getStructure(), WELL, CURRENT_PIECE.getType());
	// Position the piece
	wellCurrentPiece().style.marginLeft = UNITE * (CURRENT_PIECE.absolute_position[0] - CURRENT_PIECE.relative_position[0]) + "px";
	wellCurrentPiece().style.marginTop = UNITE * (CURRENT_PIECE.absolute_position[1] - CURRENT_PIECE.relative_position[1]) + "px";
	// Hide blocks who are out of bounds
	for (r = 0; r < CURRENT_PIECE.getStructure().length; ++r) {
		for (c = 0; c < CURRENT_PIECE.getStructure()[r].length; ++c) {
			var y_abs_pos = [CURRENT_PIECE.absolute_position[1] + r - CURRENT_PIECE.relative_position[1]];			
			if (y_abs_pos < 0) {
				wellCurrentPiece().getElementsByTagName("square")[r * CURRENT_PIECE.getStructure().length + c].className = "invisible";
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
	WELL.removeChild(wellCurrentPiece());

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

	// For each updated row, remove squares contained in formed lines and drop the rows that are above
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

	// Send the gift associated to the lines
	while (lines_counter > 0) {
		executeScript("gift_sending.php?name=add_row", nothing);
		lines_counter--;
	}
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
			// TODO touches pour executeScript("gift_sending.php?name=dazuhdp", nothing); qui appelle un script php qui ajoute l'item en bdd, avec id du joueur et nom de l'item
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
	// Set the player as not playing
	executeScript("player_game_over.php", nothing);
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


/**************************
 * Database functions
 */

/**
 * Check the database every x milliseconds
 */
function databaseClock() {
	setTimeout(function() {
		if (!GAME_OVER) {
			// TODO active les items présents ds la bdd destinés au joueur (le script php les supprime ensuite)
				// new item().launch
			executeScript("gift_receiving.php", receiveGift);
			databaseClock();
		}
	}, 100);
}

/**
 * Active received gifts
 */
function receiveGift(contents) {
	contents = JSON.parse(contents);

	for (g in contents) {
		new Gift(contents[g].name).launch();
	}
}
