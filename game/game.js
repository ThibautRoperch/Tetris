

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
var NB_COLUMNS = 10;
var NB_ROWS = 22;

/**
 * Back-end properties
 */

var MATRIX = []; // row's list, elements are squares
var CURRENT_PIECE; // piece type
var NEXT_PIECE; // piece type


/**************************
 * Classes
 */

 /**
  * Piece representation, with a name and a structure
  */
function Piece(name, structure, origin_y) {
	this.name = name;
	this.structure = structure;
	this.origin_y = origin_y;
}

 /**
  * Square representation, with a color
  */
function Square(color) {
	this.color = color;
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
	WELL.style.width = UNITE * NB_COLUMNS + "px";
	WELL.style.height = UNITE * NB_ROWS + "px";
	// Set next's dimensions
	NEXT.style.width = UNITE * 5 + "px";
	NEXT.style.height = UNITE * 4 + "px";
	// Set matrix's dimensions
	for (var r = 0; r < NB_ROWS; ++r) {
		var row = [];
		for (var c = 0; c < NB_COLUMNS; ++c) {
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
	launchPiece();
}

function gameClock() {
	setTimeout(function() {
		// Check for collision
		// si colli et pas de piece launched, launch new piece
		// Move down the current piece
		// TODO
		// Continue the game
		gameClock();
	}, SPEED);
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
	var abs_origin_y = - CURRENT_PIECE.structure[0].length + CURRENT_PIECE.origin_y;
	WELL.lastChild.style.marginLeft = UNITE * (Math.round(NB_COLUMNS / 2) + abs_origin_y) + "px";
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
	var origin_y = 0;
	
	var rand_int = Math.round(Math.random() * 6);
	
	if (rand_int == 0) { // tetrimino O
		name = "O";
		piece_structure =
		[
			[1, 1],
			[1, 1]
		];
		origin_y = 1;
	} else if (rand_int == 1) { // tetrimino I
		name = "I";
		piece_structure =
		[
			[1, 1, 1, 1]
		];
		origin_y = 2;
	} else if (rand_int == 2) { // tetrimino S
		name = "S";
		piece_structure =
		[
			[0, 1, 1],
			[1, 1, 0]
		];
		origin_y = 1;
	} else if (rand_int == 3) { // tetrimino Z
		name = "Z";
		piece_structure =
		[
			[1, 1, 0],
			[0, 1, 1]
		];
		origin_y = 1;
	} else if (rand_int == 4) { // tetrimino L
		name = "L";
		piece_structure =
		[
			[1, 1, 1],
			[1 ,0, 0]
		];
		origin_y = 1;
	} else if (rand_int == 5) { // tetrimino J
		name = "J";
		piece_structure =
		[
			[1, 1, 1],
			[0, 0, 1]
		];
		origin_y = 1;
	} else if (rand_int == 6) { // tetrimino T
		name = "T";
		piece_structure =
		[
			[1, 1, 1],
			[0, 1, 0]
		];
		origin_y = 1;
	}
	
	return new Piece(name, piece_structure, origin_y);
}

/**
 * Display a given piece in the given HTML node
 */
function displayPiece(piece, node) {
	var tetrimino = document.createElement("tetrimino");
	tetrimino.style.width = UNITE * piece.structure[0].length + "px";
	tetrimino.style.height = UNITE * piece.structure.length + "px";
	tetrimino.className = piece.name;
	
	for (r = 0; r < piece.structure.length; ++r) {
		for (c = 0; c < piece.structure[r].length; ++c) {
			var square = document.createElement("square");
			square.style.width = UNITE + "px";
			square.style.height = UNITE + "px";
			if (piece.structure[r][c] == 0) {
				square.className = "invisible";
			}
			tetrimino.appendChild(square);
		}
	}

	node.appendChild(tetrimino);
}

/**
 * Manage the HTML onkeydown event
 */
function keyPressed(event) {
	switch (event.key) {
		case "ArrowLeft": // horizontal move
			// Check for collision

			break;
		case "ArrowRight": // horizontal move
			break;
		case "ArrowUp": // hard drop
			break;
		case "ArrowDown": // soft drop
			break;
		default:
			break;
	}
}
