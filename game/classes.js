
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
			case "O" :
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
			case "I" :
				this.structure =
				[
					[
						[0, 0, 0, 0],
						[1, 1, 1, 1],
						[0, 0, 0, 0],
						[0, 0, 0, 0]
					],
					[
						[0, 0, 1, 0],
						[0, 0, 1, 0],
						[0, 0, 1, 0],
						[0, 0, 1, 0]
					]
				];
				this.preview =
				[
					[1, 1, 1, 1]
				]
				break;
			case "S" :
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
			case "Z" :
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
			case "L" :
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
			case "J" :
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
			case "T" :
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
