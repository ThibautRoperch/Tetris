

/**************************
 * Properties
 */

/**
 * Game properties
 */

var SPEED = 1; // square per second
var TIME = 0; // seconds

/**
 * Front-end properties
 */

var UNITE = 20; // pixels
var WELL = document.getElementsByTagName("well")[0];
var HITBOXES = document.getElementsByTagName("hitboxes")[0];
var NEXT = document.getElementsByTagName("next")[0];
var COLUMNS_NB = 10;
var ROWS_NB = 22;

/**
 * Back-end properties
 */

var MATRIX = []; // row's list, elements are squares
var CURRENT_PIECE; // piece type
var NEXT_PIECE; // piece type
var SQUARE_ID = 0; // A.I.


/**************************
 * Game functions
 */

/**
 * Main function
 * Set the well's dimensions for the front-end, matrix's dimensions for the back-end, and launch + prepare the first pieces
 */
function launchGame() {
	// Set well's and hitboxes' dimensions
	WELL.style.width = UNITE * COLUMNS_NB + "px";
	WELL.style.height = UNITE * ROWS_NB + "px";
	HITBOXES.style.width = UNITE * COLUMNS_NB + "px";
	HITBOXES.style.height = UNITE * ROWS_NB + "px";
	// Set matrix's dimensions
	for (var r = 0; r < ROWS_NB; ++r) {
		var row = [];
		for (var c = 0; c < COLUMNS_NB; ++c) {
			row.push(null);
		}
		MATRIX.push(row);
	}
	// Start the timer
	startTimer();
	// Call the game clock
	gameClock();
	// Prepare a first piece
	preparePiece();
	// Set next's dimensions
	NEXT.style.width = UNITE * (NEXT_PIECE.getStructure()[0].length + 2) + "px";
	NEXT.style.height = UNITE * (NEXT_PIECE.getStructure().length + 2) + "px";
	// Launch a first piece
	launchPiece();
}

function gameClock() {
	setTimeout(function() {	
		// Check for collision if the current piece moves down
		// If the piece can move down, move down the current piece
 		// Else, block the piece at her position and launch a new piece
		if (CURRENT_PIECE.canMoveDown()) {
			CURRENT_PIECE.moveDown();
		} else {
			blockCurrentPiece();
			launchPiece();
		}
		displayMatrix();
		// Continue the game
		gameClock();
	}, 1000 / SPEED);
}

/**
 * Counter of the time spent playing a game
 */
function startTimer() {
	setTimeout(function() {
		TIME++;
		startTimer();
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
	var squares_nb = 0;
	
	// Append a HTML square for each square in the piece's structure
	for (r = 0; r < rows.length; ++r) {
		for (c = 0; c < rows[r].length; ++c) {
			var square = document.createElement("square");
			square.style.width = UNITE + "px";
			square.style.height = UNITE + "px";
			if (rows[r][c] == 0) {
				square.className = "invisible";
			} else {
				square.id = parseInt(SQUARE_ID++);
				square.className = class_name;
				squares_nb++;
			}
			tetrimino.appendChild(square);
		}
	}

	SQUARE_ID -= squares_nb; // the square id counter will be incremented by another function during the matrix modification

	node.appendChild(tetrimino);
}

/**
 * Actualize the structure and the position of the piece moving in the well
 */
function actualizeCurrentPiece() {
	// Remove the piece
	WELL.removeChild(WELL.lastChild);
	// Display the piece
	displayPiece(CURRENT_PIECE.getStructure(), WELL, CURRENT_PIECE.getType());
	// Position the piece
	WELL.lastChild.style.marginLeft = UNITE * (CURRENT_PIECE.absolute_position[0] - CURRENT_PIECE.relative_position[0]) + "px";
	WELL.lastChild.style.marginTop = UNITE * (CURRENT_PIECE.absolute_position[1] - CURRENT_PIECE.relative_position[1]) + "px";
}

/**
 * Update the matrix with each square of the current piece (the piece is blocked at her position)
 */
function blockCurrentPiece() {
	var rows_updated = []; // order : highest row -> lowest row

	// Append each square of the piece's structure in the matrix
	for (r = 0; r < CURRENT_PIECE.getStructure().length; ++r) {
		for (c = 0; c < CURRENT_PIECE.getStructure()[r].length; ++c) {
			if (CURRENT_PIECE.getStructure()[r][c] == 1) {
				// Compute the absolute position of the square
				// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
				var absolute_square_position = [CURRENT_PIECE.absolute_position[0] + c - CURRENT_PIECE.relative_position[0], CURRENT_PIECE.absolute_position[1] + r - CURRENT_PIECE.relative_position[1]];
				// Add 1 to the vertical position of the square (like a down move)
				MATRIX[absolute_square_position[1]][absolute_square_position[0]] = new Square(SQUARE_ID++, CURRENT_PIECE.type);
				// Add the position of this updated row
				if (rows_updated.indexOf(absolute_square_position[1]) === -1) {
					rows_updated.push(absolute_square_position[1]);
				}
			}
		}
	}

	var lines_counter = 0;
	var in_air_row = null;
	var lower_bound = null;

	// For each updated rows, remove squares contained in formed lines
	for (r = 0; r < rows_updated.length; ++r) {
		// If the entire row does not contain a null, this is a formed line
		if (MATRIX[rows_updated[r]].indexOf(null) === -1) {
			// Save the row above the line in order to drop her, or the current row the line if this is not the first formed line
			if (in_air_row == null) {
				in_air_row = rows_updated[r] - 1;
				lower_bound = rows_updated[r];
			} else {
				lower_bound = rows_updated[r];
			}
			// Remove contained squares in this row
			for (c = 0; c < MATRIX[rows_updated[r]].length; ++c) {
				document.getElementById(MATRIX[rows_updated[r]][c].id).remove();
				MATRIX[rows_updated[r]][c] = null;
				lines_counter++;
			}
		}
	}

	// Drop the stayed-in-air rows, if lines has been formed
	if (lines_counter > 0) {
		// vérifier que les limites correspondent à la ligne à descendre (higher) et à la ligne à remplir
	}
}

/**
 * Manage the HTML onkeydown event
 */
function keyPressed(event) {	
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
		default:
			break;
	}
}

function displayMatrix() {
	HITBOXES.innerHTML = "";

	// Display each square of the matrix
	for (r = 0; r < MATRIX.length; ++r) {
		for (c = 0; c < MATRIX[r].length; ++c) {
			var square = document.createElement("square");
			square.style.width = UNITE + "px";
			square.style.height = UNITE + "px";
			if (MATRIX[r][c] == null) {
				square.className = "invisible";
			}
			HITBOXES.appendChild(square);
		}
	}
}

/*

 0 1 2 3 4
0 +------->
1 |         x
2 |
3 |
  v
    y

*/