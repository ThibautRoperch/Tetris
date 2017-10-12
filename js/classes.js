
/**************************
 * Classes' properties
 */

var TETRIMINOS_TYPES = ["O", "I", "S", "Z", "L", "J", "T"];
var TETRIMINOS_STRUCTURES = [
	// O
	[
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		]
	],
	// I
	[
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0]
		],
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	],
	// S
	[
		[
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 1],
			[0, 0, 0, 0]
		]
	],
	// Z
	[
		[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 0]						
		],
		[
			[0, 0, 0, 1],
			[0, 0, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		]
	],
	// L
	[
		[
			[0, 0, 0, 0],
			[0, 1, 1, 1],
			[0, 1 ,0, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 0, 1],
			[0, 1 ,1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],
		[
			[0 ,0, 1, 0],
			[0 ,0, 1 ,0],
			[0 ,0, 1, 1],
			[0, 0, 0, 0]
		],
	],
	// J
	[
		[
			[0, 0, 0, 0],
			[0, 1, 1, 1],
			[0, 0 ,0, 1],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 1, 0],
			[0, 0 ,1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 1, 0, 0],
			[0, 1 ,1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 1, 1],
			[0, 0, 1 ,0],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],
	],
	// T
	[
		[
			[0, 0, 0, 0],
			[0, 1, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 1, 0],
			[0, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],
	]
];

var SQUARE_ID = 0; // A.I.

var GIFTS_NAMES		=	["add_row",	"rumble",			"high_speed",	"nuke",		"rotate",	"remove_row",	"pause"];
var GIFTS_SYMBOLS	=	["&#9650;",	"&#8967;&#8967;",	"&#9193;",		"&#9762;",	"&#8635;",	"&#9660;",		"&#9208;"];
// &#9790; lune
// &#9208; pause
// &#128123; or &#128123; ghost


/**************************
 * Classes
 */

/**
 * Piece representation, with a type, a rotation, the relative position of its origin and the absolute position of its origin
 */
class Piece {
	constructor(type) {
		this.type = type;
		this.rotation = 0; // default rotation of the piece
		this.absolute_position = [Math.round(COLUMNS_NB / 2), 0]; // absolute origin position
		this.relative_position = [2, 1]; // relative origin position
	}
	
	/**
	 * Return the type of the piece
	 */
	getType() {
		return this.type;
	}
	
	/**
	 * Return the current structure of the piece
	 */
	getStructure() {
		var index_of_type = TETRIMINOS_TYPES.indexOf(this.type);
		return TETRIMINOS_STRUCTURES[index_of_type][this.rotation];
	}
	
	/**
	 * Return the preview's structure of the piece
	 */
	getPreview() {
		var preview = [];

		switch (this.type) {
			case TETRIMINOS_TYPES[0]: // O
				preview =
				[
					[1, 1],
					[1, 1]
				];
				break;
			case TETRIMINOS_TYPES[1]: // I
				preview =
				[
					[1, 1, 1, 1]
				];
				break;
			case TETRIMINOS_TYPES[2]: // S
				preview =
				[
					[0, 1, 1],
					[1, 1, 0]
				];
				break;
			case TETRIMINOS_TYPES[3]: // Z
				preview =
				[
					[1, 1, 0],
					[0, 1, 1]
				];
				break;
			case TETRIMINOS_TYPES[4]: // L
				preview =
				[
					[1, 1, 1],
					[1, 0, 0]
				];
				break;
			case TETRIMINOS_TYPES[5]: // J
				preview =
				[
					[1, 1, 1],
					[0, 0, 1]
				];
				break;
			case TETRIMINOS_TYPES[6]: // T
				preview =
				[
					[1, 1, 1],
					[0, 1, 0]
				];
				break;
		}

		return preview;
	}

	/**
	 * Return true if the piece can spawn in the well, false else
	 */
	canSpawn() {
		// Check if each square in the piece's structure can move down, relative to the piece's position in the well
		for (var r = 0; r < this.getStructure().length; ++r) {
			for (var c = 0; c < this.getStructure()[r].length; ++c) {
				if (this.getStructure()[r][c] == 1) {
					// Compute the absolute position of the square
					// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
					var absolute_square_position = [this.absolute_position[0] + c - this.relative_position[0], this.absolute_position[1] + r - this.relative_position[1]];
					// If this position is in the well
					if (absolute_square_position[1] >= 0 && absolute_square_position[0] >= 0 && absolute_square_position[0] < COLUMNS_NB) {
						// Return false if there already is a square at its position in the matrix
						if (MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null) {
							return false;
						}
					}
				}
			}
		}

		return true;
	}

	/**
	 * Return true if the piece can move down in the well, false else
	 */
	canMoveDown() {
		// Check if each square in the piece's structure can move down, relative to the piece's position in the well
		for (var r = 0; r < this.getStructure().length; ++r) {
			for (var c = 0; c < this.getStructure()[r].length; ++c) {
				if (this.getStructure()[r][c] == 1) {
					// Compute the absolute position of the square
					// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
					var absolute_square_position = [this.absolute_position[0] + c - this.relative_position[0], this.absolute_position[1] + r - this.relative_position[1]];
					// Add 1 to the vertical position of the square (like a down move)
					absolute_square_position[1]++;
					// If this position is in the well
					if (absolute_square_position[1] >= 0 && absolute_square_position[0] >= 0 && absolute_square_position[0] < COLUMNS_NB) {
						// Return false if the bottom limit of the well is reached,
						// or if there already is a square at its position in the matrix
						if (absolute_square_position[1] == ROWS_NB || MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null) {
							return false;
						}
					}
				}
			}
		}

		return true;
	}

	/**
	 * Return true if the piece can move left in the well, false else
	 */
	canMoveLeft() {
		// Check if each square in the piece's structure can move left, relative to the piece's position in the well
		for (var r = 0; r < this.getStructure().length; ++r) {
			for (var c = 0; c < this.getStructure()[r].length; ++c) {
				if (this.getStructure()[r][c] == 1) {
					// Compute the absolute position of the square
					// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
					var absolute_square_position = [this.absolute_position[0] + c - this.relative_position[0], this.absolute_position[1] + r - this.relative_position[1]];
					// Substract 1 to the horizontal position of the square (like a left move)
					absolute_square_position[0]--;
					// Return false if the left limit of the well is reached,
					// or if there already is a square at its position in the matrix if this position is in the well
					if (absolute_square_position[0] < 0
					|| (absolute_square_position[1] >= 0 && absolute_square_position[0] >= 0 && absolute_square_position[0] < COLUMNS_NB
						&& MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null)) {
						return false;
					}
				}
			}
		}

		return true;
	}

	/**
	 * Return true if the piece can move right in the well, false else
	 */
	canMoveRight() {
		// Check if each square in the piece's structure can move right, relative to the piece's position in the well
		for (var r = 0; r < this.getStructure().length; ++r) {
			for (var c = 0; c < this.getStructure()[r].length; ++c) {
				if (this.getStructure()[r][c] == 1) {
					// Compute the absolute position of the square
					// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
					var absolute_square_position = [this.absolute_position[0] + c - this.relative_position[0], this.absolute_position[1] + r - this.relative_position[1]];
					// Add 1 to the horizontal position of the square (like a right move)
					absolute_square_position[0]++;
					// Return false if the right limit of the well is reached,
					// or if there already is a square at its position in the matrix if this position is in the well
					if (absolute_square_position[0] == COLUMNS_NB
					|| (absolute_square_position[1] >= 0 && absolute_square_position[0] >= 0 && absolute_square_position[0] < COLUMNS_NB
						&& MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null)) {
						return false;
					}
				}
			}
		}

		return true;
	}

	/**
	 * Move 1 square down
	 */
	moveDown() {
		this.absolute_position[1]++;
		actualizeCurrentPiece();
	}

	/**
	 * Move 1 square to the left
	 */
	moveLeft() {
		this.absolute_position[0]--;	
		actualizeCurrentPiece();
	}
	
	/**
	 * Move 1 square to the right
	 */
	moveRight() {
		this.absolute_position[0]++;		
		actualizeCurrentPiece();
	}
	
	/**
	 * Return true if the piece can clockwise rotate in the well, false else
	 */
	canClockWiseRotate() {
		this.clockWiseRotate();

		// Check if each square in the piece's structure can clockwise rotate
		for (var r = 0; r < this.getStructure().length; ++r) {
			for (var c = 0; c < this.getStructure()[r].length; ++c) {
				if (this.getStructure()[r][c] == 1) {
					// Compute the absolute position of the square
					// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
					var absolute_square_position = [this.absolute_position[0] + c - this.relative_position[0], this.absolute_position[1] + r - this.relative_position[1]];
					// Return false if there already is a square at its position in the matrix, if this position is in the well
					if (absolute_square_position[1] >= 0 && absolute_square_position[0] >= 0 && absolute_square_position[0] < COLUMNS_NB
						&& MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null) {
						this.counterClockWiseRotate();
						return false;
					}
				}
			}
		}

		this.counterClockWiseRotate();
		return true;
	}

	/**
	 * Return true if the piece can counterclockwise rotate in the well, false else
	 */
	canCounterClockWiseRotate() {
		this.counterClockWiseRotate();

		// Check if each square in the piece's structure can counterclockwise rotate
		for (var r = 0; r < this.getStructure().length; ++r) {
			for (var c = 0; c < this.getStructure()[r].length; ++c) {
				if (this.getStructure()[r][c] == 1) {
					// Compute the absolute position of the square
					// absolute position of the origin of the piece + position of the square in the piece - position of the origin in the piece
					var absolute_square_position = [this.absolute_position[0] + c - this.relative_position[0], this.absolute_position[1] + r - this.relative_position[1]];
					// Return false if there already is a square at its position in the matrix, if this posotion is in the well
					if (absolute_square_position[1] >= 0 && absolute_square_position[0] >= 0 && absolute_square_position[0] < COLUMNS_NB
						&& MATRIX[absolute_square_position[1]][absolute_square_position[0]] != null) {
						this.clockWiseRotate();
						return false;
					}
				}
			}
		}

		this.clockWiseRotate();
		return true;
	}
	
	/**
	 * Clockwise rotation
	 */
	clockWiseRotate() {
		var index_of_type = TETRIMINOS_TYPES.indexOf(this.type);
		this.rotation = ++this.rotation % TETRIMINOS_STRUCTURES[index_of_type].length; // x possible different rotations, between 0 and x
		this.checkIfOutOfBounds();
		actualizeCurrentPiece();
	}
	
	/**
	 * Counterclockwise rotation
	 */
	counterClockWiseRotate() {
		var index_of_type = TETRIMINOS_TYPES.indexOf(this.type);
		this.rotation = --this.rotation;
		if (this.rotation < 0) {
			this.rotation += TETRIMINOS_STRUCTURES[index_of_type].length;
		}
		this.checkIfOutOfBounds();
		actualizeCurrentPiece();
	}

	checkIfOutOfBounds() {
		// Check if each square in the piece's structure is out of bounds, retain the furthest and move the piece consequently
		var highest_gap = 0; // can be < 0 or > 0

		for (var r = 0; r < this.getStructure().length; ++r) {
			for (var c = 0; c < this.getStructure()[r].length; ++c) {
				if (this.getStructure()[r][c] == 1) {
					// Compute the x absolute position of the square
					// x absolute position of the origin of the piece + x position of the square in the piece - x position of the origin in the piece
					var x_abs_pos = this.absolute_position[0] + c - this.relative_position[0];
					if (x_abs_pos < 0 && Math.abs(x_abs_pos) > Math.abs(highest_gap)) {
						highest_gap = x_abs_pos;
					} else if (x_abs_pos > COLUMNS_NB - 1 && x_abs_pos - (COLUMNS_NB - 1) > Math.abs(highest_gap)) {
						highest_gap = x_abs_pos - (COLUMNS_NB - 1);
					}
				}
			}
		}

		this.absolute_position[0] -= highest_gap;
	}
}

/**
 * Square representation, with an id corresponding to the id's HTML square
 */
class Square {
	constructor(id, type) {
		this.id = id;
		this.type = type;
	}
}

/**
 * Gift representation, with a name and an associated effect
 */
class Gift {
	constructor(name) {
		this.name = name;
	}

	getSymbol() {
		var index_of_name = GIFTS_NAMES.indexOf(this.name);
		return GIFTS_SYMBOLS[index_of_name];
	}

	launch() {
		switch (this.name) {
			case GIFTS_NAMES[0]: // add_row
				// If the highest row contains a square, it's a game over
				for (var c = 0; c < MATRIX[0].length; ++c) {
					if (MATRIX[0][c] != null) {
						gameOver();
					}
				}
				// For each row, move its squares to the row above
				for (var r = 0; r < MATRIX.length - 1; ++r) { // start with the highest row
					for (var c = 0; c < MATRIX[r].length; ++c) {
						// Up the bottom square, from the matrix and the well
						MATRIX[r][c] = MATRIX[r + 1][c];
						if (MATRIX[r + 1][c] != null) {
							document.getElementById(MATRIX[r + 1][c].id).style.marginTop = UNITE * r + "px";
						}
						MATRIX[r + 1][c] = null;
					}
				}
				// Generate a new random row and append its squares
				var hole_position = Math.floor(Math.random() * COLUMNS_NB);
				for (var c = 0; c < COLUMNS_NB; ++c) {
					if (c != hole_position) {
						// Pick a random square's type
						var type = Math.floor(Math.random() * TETRIMINOS_TYPES.length);
						// Create and append a new square to the new row and the well
						var new_square = new Square(SQUARE_ID++, TETRIMINOS_TYPES[type]);
						MATRIX[ROWS_NB - 1][c] = new_square;
						var square = document.createElement("square");
							square.style.width = SIDE + "px";
							square.style.height = SIDE + "px";
							square.style.borderWidth = BORDER + "px";
							square.style.marginLeft = UNITE * c + "px";
							square.style.marginTop = UNITE * (ROWS_NB - 1) + "px";
							square.id = new_square.id;
							// square.innerHTML = square.id;
							square.className = new_square.type;
						WELL.appendChild(square);
					}
				}
				break;
			case GIFTS_NAMES[1]: // rumble (wizz)
				var board = document.getElementsByTagName("board")[0];
				var delay = 50;
				var time_spent = 0;
				rumble();
				function rumble() {
					board.style.marginLeft = Math.floor((Math.random() * 50) - 25) + "px";
					board.style.marginTop = Math.floor((Math.random() * 50) - 25) + "px";
					setTimeout(function() {
						if (time_spent < 3000) {
							time_spent += delay;
							rumble();
						}
					}, delay);
				}
				board.style.marginLeft = "0px";
				board.style.marginTop = "0px";
				break;
			case GIFTS_NAMES[2]: // high_speed
				var delta = 5;
				SPEED += delta;
				setTimeout(function() {
					SPEED -= delta;
				}, 2000);
				break;
			case GIFTS_NAMES[3]: // nuke
				// For each row, remove its squares
				for (var r = 0; r < MATRIX.length; --r) {
					for (var c = 0; c < MATRIX[r].length; ++c) {
						if (MATRIX[r][c] != null) {
							WELL.removeChild(document.getElementById(MATRIX[r][c].id));
							MATRIX[r][c] = null;
						}
					}
				}
				break;
			case GIFTS_NAMES[4]: // rotate
				var board = document.getElementsByTagName("board")[0];
				board.style.transform = "rotateZ(180deg)";
				setTimeout(function() {
					board.style.transform = "rotateZ(360deg)";
				}, 3000);
				break;
			case GIFTS_NAMES[5]: // remove_row
				// Remove the HTML squares of the lowest row
				for (var c = 0; c < MATRIX[MATRIX.length - 1].length; ++c) {
					if (MATRIX[MATRIX.length - 1][c] != null) {
						WELL.removeChild(document.getElementById(MATRIX[MATRIX.length - 1][c].id));
					}
				}
				// For each row, move its squares to the row under
				for (var r = MATRIX.length - 1; r > 0; --r) { // start with the lowest row
					for (var c = 0; c < MATRIX[r].length; ++c) {
						// Down the top square, from the matrix and the well
						MATRIX[r][c] = MATRIX[r - 1][c];
						if (MATRIX[r - 1][c] != null) {
							document.getElementById(MATRIX[r - 1][c].id).style.marginTop = UNITE * r + "px";
						}
						MATRIX[r - 1][c] = null;
					}
				}
				break;
			case GIFTS_NAMES[5]: // pause
				GAME_OVER = true;
				setTimeout(function() {
					GAME_OVER = false;
				}, 2000);
				break;
		}
	}
}
