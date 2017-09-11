

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
 * Classes
 */

/**
 * Piece representation, with a name, a structure, a relative origin and the absolute position of her origin
 */
class Piece {
	constructor(name, structure, squares_nb, origin, position, rotation) {
		this.name = name;
		this.structure = structure;
		this.squares_nb = squares_nb;
		this.origin = origin;
		this.position = position;
		this.rotation = rotation;
	}
}

/**
 * Square representation, with an id corresponding with the id's HTML square
 */
class Square {
	constructor(id) {
		this.id = id;
	}
}


/**************************
 * Game functions
 */

/**
 * Main function
 * Set the well's dimensions for the front-end, matrix's dimensions for the back-end, and launch + prepare the first pieces
 */
function launchGame() {
	// Set well's dimensions
	WELL.style.width = UNITE * COLUMNS_NB + "px";
	WELL.style.height = UNITE * ROWS_NB + "px";
	// Set next's dimensions
	NEXT.style.width = UNITE * 5 + "px";
	NEXT.style.height = UNITE * 4 + "px";
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
	// Launch a first piece
	launchPiece();
}

function gameClock() {
	setTimeout(function() {
		// Check for collision if the current piece moves down
		// If the piece can move down, move down the current piece and actualize the display
 		// Else, block the piece at her position and launch a new piece
		if (currentPieceCanMoveDown()) {
			CURRENT_PIECE.position[1]++;
			actualizeCurrentPiecePosition();
		} else {
			blockCurrentPiece();
			launchPiece();
		}
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
	displayPiece(CURRENT_PIECE, WELL);
	// Move the launched piece on the middle of the well
	actualizeCurrentPiecePosition();
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
	displayPiece(NEXT_PIECE, NEXT);
}

/**
 * Randomly generate a new piece, among the 7 tetriminos
 */
function generatePiece() {
	var name = "";
	var piece_structure = []; // rows's list
	var squares_nb = 0;
	var origin = [0, 0];
	
	var rand_int = Math.round(Math.random() * 6);
	
	if (rand_int == 0) { // tetrimino O
		name = "O";
		piece_structure =
		[
			[1, 1],
			[1, 1]
		];
		squares_nb = 4;
		origin = [1, 0];
	} else if (rand_int == 1) { // tetrimino I
		name = "I";
		piece_structure =
		[
			[1, 1, 1, 1]
		];
		squares_nb = 4;
		origin = [2, 0];
	} else if (rand_int == 2) { // tetrimino S
		name = "S";
		piece_structure =
		[
			[0, 1, 1],
			[1, 1, 0]
		];
		squares_nb = 4;
		origin = [1, 0];
	} else if (rand_int == 3) { // tetrimino Z
		name = "Z";
		piece_structure =
		[
			[1, 1, 0],
			[0, 1, 1]
		];
		squares_nb = 4;
		origin = [1, 0];
	} else if (rand_int == 4) { // tetrimino L
		name = "L";
		piece_structure =
		[
			[1, 1, 1],
			[1 ,0, 0]
		];
		squares_nb = 4;
		origin = [1, 0];
	} else if (rand_int == 5) { // tetrimino J
		name = "J";
		piece_structure =
		[
			[1, 1, 1],
			[0, 0, 1]
		];
		squares_nb = 4;
		origin = [1, 0];
	} else if (rand_int == 6) { // tetrimino T
		name = "T";
		piece_structure =
		[
			[1, 1, 1],
			[0, 1, 0]
		];
		squares_nb = 4;
		origin = [1, 0];
	}
	
	var position_x = Math.round(COLUMNS_NB / 2); // default x position of the piece's origin
	var position_y = 0; // default y position of the piece's origin
	var rotation = 0; // default rotation of the piece

	return new Piece(name, piece_structure, squares_nb, origin, [position_x, position_y], rotation);
}

/**
 * Display a given piece in the given HTML node
 */
function displayPiece(piece, node) {
	var tetrimino = document.createElement("tetrimino");
	tetrimino.style.width = UNITE * piece.structure[0].length + "px";
	tetrimino.style.height = UNITE * piece.structure.length + "px";
	tetrimino.className = piece.name;
	
	// Append a HTML square for each square in the piece's structure
	for (r = 0; r < piece.structure.length; ++r) {
		for (c = 0; c < piece.structure[r].length; ++c) {
			var square = document.createElement("square");
			square.style.width = UNITE + "px";
			square.style.height = UNITE + "px";
			if (piece.structure[r][c] == 0) {
				square.className = "invisible";
			} else {
				square.id = parseInt(SQUARE_ID++);				
			}
			tetrimino.appendChild(square);
		}
	}

	SQUARE_ID -= piece.squares_nb; // the square id counter will be incremented by another function during the matrix modification

	node.appendChild(tetrimino);
}

/**
 * Actualize the position of the piece moving in the well
 */
function actualizeCurrentPiecePosition() {
	// Care, her position is based on her origin
	WELL.lastChild.style.marginLeft = UNITE * (CURRENT_PIECE.position[0] - CURRENT_PIECE.structure[0].length + CURRENT_PIECE.origin[0]) + "px";
	WELL.lastChild.style.marginTop = UNITE * (CURRENT_PIECE.position[1] + CURRENT_PIECE.origin[1]) + "px";
}

/**
 * Update the matrix with each square of the current piece (the piece is blocked at her position)
 */
function blockCurrentPiece() {
	// Check if each square in the piece's structure can move down, relative to the piece's position in the well
	for (r = 0; r < CURRENT_PIECE.structure.length; ++r) {
		for (c = 0; c < CURRENT_PIECE.structure[r].length; ++c) {
			if (CURRENT_PIECE.structure[r][c] == 1) {
				// Compute the absolute position of the square
				// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
				var absolute_square_position = [CURRENT_PIECE.position[0] + c - CURRENT_PIECE.origin[0], CURRENT_PIECE.position[1] + r - CURRENT_PIECE.origin[1]];
				// Add 1 to the vertical position of the square (like a down move)
				MATRIX[absolute_square_position[1]][absolute_square_position[0]] = new Square(SQUARE_ID++);
				console.log("ajout d'un sq en " + absolute_square_position);
			}
		}
	}
}

/**
 * Return true if the current moving piece can move down in the well, false else
 */
function currentPieceCanMoveDown() {
	// Check if each square in the piece's structure can move down, relative to the piece's position in the well
	for (r = 0; r < CURRENT_PIECE.structure.length; ++r) {
		for (c = 0; c < CURRENT_PIECE.structure[r].length; ++c) {
			if (CURRENT_PIECE.structure[r][c] == 1) {
				// Compute the absolute position of the square
				// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
				var absolute_square_position = [CURRENT_PIECE.position[0] + c - CURRENT_PIECE.origin[0], CURRENT_PIECE.position[1] + r - CURRENT_PIECE.origin[1]];
				// Add 1 to the vertical position of the square (like a down move)
				absolute_square_position[1]++;
				// Return false if the bottom limit of the well is reached,
				// or if there already is a square in this position in the matrix
				if (absolute_square_position[1] == ROWS_NB || MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null) {
					return false;
				}
			}
		}
	}

	return true;
}

/**
 * Return true if the current moving piece can move left in the well, false else
 */
function currentPieceCanMoveLeft() {
	// Check if each square in the piece's structure can move left, relative to the piece's position in the well
	for (r = 0; r < CURRENT_PIECE.structure.length; ++r) {
		for (c = 0; c < CURRENT_PIECE.structure[r].length; ++c) {
			if (CURRENT_PIECE.structure[r][c] == 1) {
				// Compute the absolute position of the square
				// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
				var absolute_square_position = [CURRENT_PIECE.position[0] + c - CURRENT_PIECE.origin[0], CURRENT_PIECE.position[1] + r - CURRENT_PIECE.origin[1]];
				// Substract 1 to the horizontal position of the square (like a left move)
				absolute_square_position[0]--;
				// Return false if the left limit of the well is reached,
				// or if there already is a square in this position in the matrix
				if (absolute_square_position[0] == 0 || MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null) {
					return false;
				}
			}
		}
	}

	return true;
}

/**
 * Return true if the current moving piece can move right in the well, false else
 */
function currentPieceCanMoveRight() {
	// Check if each square in the piece's structure can move right, relative to the piece's position in the well
	for (r = 0; r < CURRENT_PIECE.structure.length; ++r) {
		for (c = 0; c < CURRENT_PIECE.structure[r].length; ++c) {
			if (CURRENT_PIECE.structure[r][c] == 1) {
				// Compute the absolute position of the square
				// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
				var absolute_square_position = [CURRENT_PIECE.position[0] + c - CURRENT_PIECE.origin[0], CURRENT_PIECE.position[1] + r - CURRENT_PIECE.origin[1]];
				// Add 1 to the horizontal position of the square (like a right move)
				absolute_square_position[0]++;
				// Return false if the right limit of the well is reached,
				// or if there already is a square in this position in the matrix
				if (absolute_square_position[0] == COLUMNS_NB || MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null) {
					return false;
				}
			}
		}
	}

	return true;
}

/**
 * Manage the HTML onkeydown event
 */
function keyPressed(event) {
	switch (event.key) {
		case "ArrowLeft": // horizontal move
			// Move left the current piece if possible
			if (currentPieceCanMoveLeft()) {
				CURRENT_PIECE.position[0]--;
				actualizeCurrentPiecePosition();
			}
			break;
		case "ArrowRight": // horizontal move
			// Move right the current piece if possible
			if (currentPieceCanMoveRight()) {
				CURRENT_PIECE.position[0]++;
				actualizeCurrentPiecePosition();
			}
			break;
		case "ArrowUp": // hard drop
			// Move to the closer square the current piece
			actualizeCurrentPiecePosition();
			break;
		case " ": // hard drop
			// Move to the closer square the current piece
			actualizeCurrentPiecePosition();
			break;
		case "ArrowDown": // soft drop
			// Move left the current piece if possible
			if (currentPieceCanMoveDown()) {
				CURRENT_PIECE.position[1]++;
				actualizeCurrentPiecePosition();
			} else {
				blockCurrentPiece();
				launchPiece();
			}
			break;
		case "a": // clockwise rotation
			break;
		case "z": // counterclockwise rotation
			break;
		default:
			break;
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