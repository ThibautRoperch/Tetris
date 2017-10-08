
/**************************
 * Classes' properties
 */

var TETRIMINOS_TYPES = ["O", "I", "S", "Z", "L", "J", "T"];
var SQUARE_ID = 0; // A.I.
var GIFT_TYPES = ["add_row", "rumble", "hight_speed"];


/**************************
 * Classes
 */

/**
 * Piece representation, with a type, a structure, a relative origin and the absolute position of her origin
 */
class Piece {
	constructor(type, rotation) {
		this.type = type;
		this.rotation = rotation;
		
		this.structure;
		this.preview;

		switch (this.type) {
			case TETRIMINOS_TYPES[0]:
				this.structure =
				[
					[
						[0, 0, 0, 0],
						[0, 1, 1, 0],
						[0, 1, 1, 0],
						[0, 0, 0, 0],
					]
				];
				this.preview =
				[
					[1, 1],
					[1, 1]
				]
				break;
			case TETRIMINOS_TYPES[1]:
				this.structure =
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
				];
				this.preview =
				[
					[1, 1, 1, 1]
				]
				break;
			case TETRIMINOS_TYPES[2]:
				this.structure =
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
				];
				this.preview =
				[
					[0, 1, 1],
					[1, 1, 0]
				]
				break;
			case TETRIMINOS_TYPES[3]:
				this.structure =
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
				];
				this.preview =
				[
					[1, 1, 0],
					[0, 1, 1]
				]
				break;
			case TETRIMINOS_TYPES[4]:
				this.structure =
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
				];
				this.preview =
				[
					[1, 1, 1],
					[1, 0, 0]
				]
				break;
			case TETRIMINOS_TYPES[5]:
				this.structure =
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
				];
				this.preview =
				[
					[1, 1, 1],
					[0, 0, 1]
				]
				break;
			case TETRIMINOS_TYPES[6]:
				this.structure =
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
				];
				this.preview =
				[
					[1, 1, 1],
					[0, 1, 0]
				]
				break;
		}

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
		return this.structure[this.rotation];
	}
	
	/**
	 * Return the preview's structure of the piece
	 */
	getPreview() {
		return this.preview;
	}

	/**
	 * Return true if the piece can spawn in the well, false else
	 */
	canSpawn() {
		// Check if each square in the piece's structure can move down, relative to the piece's position in the well
		for (r = 0; r < this.getStructure().length; ++r) {
			for (c = 0; c < this.getStructure()[r].length; ++c) {
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
		for (r = 0; r < this.getStructure().length; ++r) {
			for (c = 0; c < this.getStructure()[r].length; ++c) {
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
		for (r = 0; r < this.getStructure().length; ++r) {
			for (c = 0; c < this.getStructure()[r].length; ++c) {
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
		for (r = 0; r < this.getStructure().length; ++r) {
			for (c = 0; c < this.getStructure()[r].length; ++c) {
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
		for (r = 0; r < this.getStructure().length; ++r) {
			for (c = 0; c < this.getStructure()[r].length; ++c) {
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
		for (r = 0; r < this.getStructure().length; ++r) {
			for (c = 0; c < this.getStructure()[r].length; ++c) {
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
		this.rotation = ++this.rotation % this.structure.length; // x possible different rotations, between 0 and x
		this.checkIfOutOfBounds();
		actualizeCurrentPiece();
	}
	
	/**
	 * Counterclockwise rotation
	 */
	counterClockWiseRotate() {
		this.rotation = --this.rotation;
		if (this.rotation < 0) {
			this.rotation += this.structure.length;
		}
		this.checkIfOutOfBounds();
		actualizeCurrentPiece();
	}

	checkIfOutOfBounds() {
		// Check if each square in the piece's structure is out of bounds, retain the furthest and move the piece consequently
		var highest_gap = 0; // can be < 0 or > 0

		for (r = 0; r < this.getStructure().length; ++r) {
			for (c = 0; c < this.getStructure()[r].length; ++c) {
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

	launch() {
		switch (this.name) {
			case GIFT_TYPES[0]:
				// If the highest row contains a square, it's a game over
				for (c = 0; c < MATRIX[0].length; ++c) {
					if (MATRIX[0][c] != null) {
						gameOver();
					}
				}
				// For each row, move its squares to the row above
				for (r = 0; r < MATRIX.length - 1; ++r) { // start with the highest row
					for (c = 0; c < MATRIX[r].length; ++c) {
						// Up the bottom square, from the matrix and the well
						MATRIX[r][c] = MATRIX[r + 1][c];
						if (MATRIX[r + 1][c] != null) {
							document.getElementById(MATRIX[r + 1][c].id).style.marginTop = UNITE * r + "px";
						}
						MATRIX[r + 1][c] = null;
					}
				}
				// Generate a new random row and append its squares
				var hole_position = Math.round(Math.random() * (COLUMNS_NB - 1));
				for (c = 0; c < COLUMNS_NB; ++c) {
					if (c != hole_position) {
						// Pick a random square's type
						var type = Math.round(Math.random() * 6);
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
			case GIFT_TYPES[1]:
				var board = document.getElementsByTagName("board")[0];
				var delay = 50;
				var time_spent = 0;
				rumble();
				function rumble() {
					board.style.marginLeft = Math.floor((Math.random() * 50) - 25) + "px";
					board.style.marginTop = Math.floor((Math.random() * 50) - 25) + "px";
					setTimeout(function() {
						if (time_spent < 2000) {
							time_spent += delay;
							rumble();
						}
					}, delay);
				}
				board.style.marginLeft = "0px";
				board.style.marginTop = "0px";
				break;
			case GIFT_TYPES[2]:
				var delta = 5;
				SPEED += delta;
				setTimeout(function() {
					SPEED -= delta;
				}, 2000);
				break;
		}
	}
}
