

/**************************
 * Properties
 */

/**
 * Game properties
 */

var TIME; // seconds
var SPEED; // square per second
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
var ITEMS;

/**
 * Back-end properties
 */

var MATRIX; // rows list, elements are squares
var CURRENT_PIECE; // piece type
var NEXT_PIECE; // piece type
var PIECES; // number of pieces dropped
var ROWS; // number of lines cleared
var GIFTS; // items list


/**************************
 * Game functions
 */

/**
 * Recover the matrix from the database for the back-end, set the well's dimensions and its columns for the front-end, and 
 */
function setGame() {
	// Reset properties, they might be recycled
	// Game ones
	TIME = 0;
	SPEED = 2;
	GAME_OVER = true;
	// Front-end ones
	BORDER = 3;
	SIDE = 17;
	UNITE = SIDE + BORDER * 2;
	WELL = document.getElementsByTagName("well")[0];
	NEXT = document.getElementsByTagName("next")[0];
	COLUMNS_NB = 10; // 10
	ROWS_NB = 22; // 22
	ITEMS = document.getElementsByTagName("items")[0];
	// Back-end ones
	MATRIX = [];
	CURRENT_PIECE = null;
	NEXT_PIECE = null;
	SQUARE_ID = 0;
	PIECES = 0;
	ROWS = 0;
	GIFTS = [];
	// Clean the well, it might be recycled
	while (WELL.hasChildNodes()) {
		WELL.removeChild(WELL.lastChild);
	}
	// Clean the items' list, it might be recycled
	while (ITEMS.hasChildNodes()) {
		ITEMS.removeChild(ITEMS.lastChild);
	}
	// Recover game's datas from the database ; might change the matrix and the other parameters
	executeScript("datas_player_receiving.php", retrievedGameDatas);
	// TODO retrievedGameDatas sert juste à la matrice. Ajouter avant ce script la récup d'un script qui cntient la valeur des autres param (columns, rows, ...) qui sont des props du lobby
	// dans game_starts.php : matrix = lobby.default_matrix if not = to ""
}

/**
 * Prepare and launch the first piece
 */
function startGame() {
	// The game is not over yet
	GAME_OVER = false;
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
			SPEED += 1.1;
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
	
	var rand_int = Math.round(Math.random() * (TETRIMINOS_TYPES.length - 1)); // tetrimino's type
	var rotation = 0; // default rotation of the piece

	return new Piece(TETRIMINOS_TYPES[rand_int], rotation);
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
 * Display the items' list in the items' HTML node
 */
function displayItems() {
	while (ITEMS.hasChildNodes()) {
		ITEMS.removeChild(ITEMS.lastChild);
	}
	for (g in GIFTS) {
		var item = document.createElement("item");
			item.innerHTML = GIFTS[g].symbol;
		ITEMS.appendChild(item);
	}
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
	if (wellCurrentPiece()) {
		var rows_updated = []; // order : highest row -> lowest row

		// Remove the piece (it can pop with delay, so check before remove)
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

		PIECES += 1;
		ROWS += lines_counter;

		// Send a dab in the chat if the player did a Tetris, and update his datas
		if (lines_counter == 4) {
			var dab = "<img src=\"https://emoji.slack-edge.com/T6VPU2CEB/dab/b9f9a2dc59b07cde.png\" />";
			// Send the message
			executeScript("message_sending.php?contents=" + dab, nothing);
			// Append the message in the HTML messages list
			appendMessageHTML("you", dab);
			// Update the player's datas
			executeScript("player_did_tetris.php", nothing);
		}

		for (i = 0; i < lines_counter; ++i) {
			var rand_int = Math.round(Math.random() * (GIFTS_TYPES.length - 1));
			GIFTS.push(new Gift(GIFTS_TYPES[rand_int]));
		}
		if (lines_counter > 0) displayItems();
		
		// Send the gift associated to the lines
		while (lines_counter > 1) {
			executeScript("gift_sending.php?item=add_row", nothing);
			lines_counter--;
		}

		// Update database's game datas
		sendGameDatas();
	} else {
		setTimeout(function() {
			blockCurrentPiece();
		}, 50);
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
			case "Escape":
				sendGift(null, 0);
				break;
			case "0":
				sendGift(TARGETS[0], 0);
				break;
			case "1":
				sendGift(TARGETS[1], 0);
				break;
			case "2":
				sendGift(TARGETS[2], 0);
				break;
			case "3":
				sendGift(TARGETS[3], 0);
				break;
			case "4":
				sendGift(TARGETS[4], 0);
				break;
			case "5":
				sendGift(TARGETS[5], 0);
				break;
			case "6":
				sendGift(TARGETS[6], 0);
				break;
			case "7":
				sendGift(TARGETS[7], 0);
				break;
			case "8":
				sendGift(TARGETS[8], 0);
				break;
			case "9":
				sendGift(TARGETS[9], 0);
				break;
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
			executeScript("gift_receiving.php", receiveGifts);
			databaseClock();
		}
	}, 100);
}

/**
 * Update JS game datas with database's ones
 */
function retrievedGameDatas(contents) {
	contents = JSON.parse(contents);

	// If the database's matrix isn't empty, fill the well with it, with null squares otherwise
	if (contents[0].matrix != "") {
		// Copy the JSON matrix into the JS game's matrix
		var json_matrix = JSON.parse(contents[0].matrix);
		MATRIX = json_matrix;

		// Display the squares in the well from the game's matrix
		for (r in MATRIX) {
			for (s in MATRIX[r]) {
				if (MATRIX[r][s] != null) {
					// Append this square of the piece to the well
					var square = document.createElement("square");
						square.style.width = SIDE + "px";
						square.style.height = SIDE + "px";
						square.style.borderWidth = BORDER + "px";
						square.style.marginLeft = UNITE * s + "px";
						square.style.marginTop = UNITE * r + "px";
						square.id = MATRIX[r][s].id;
						// square.innerHTML = square.id;
						square.className = MATRIX[r][s].type;
					WELL.appendChild(square);
				}
			}
		}
	} else {
		// Fill the matrix with null squares
		for (var r = 0; r < ROWS_NB; ++r) {
			var row = [];
			for (var c = 0; c < COLUMNS_NB; ++c) {
				row.push(null);
			}
			MATRIX.push(row);
		}
	}

	// Prepare the HMTL well from the matrix's dimensions
	// Update the number of rows and colomns with those obtained from the matrix
	ROWS_NB = MATRIX.length;
	COLUMNS_NB = (ROWS_NB > 0) ? MATRIX[0].length : 0;
	// Set well's dimensions
	WELL.style.width = UNITE * COLUMNS_NB + "px";
	WELL.style.height = UNITE * ROWS_NB + "px";

	// Displays wells's columns
	for (var c = 0; c < COLUMNS_NB; ++c) {
		var column = document.createElement("column");
		column.style.width = UNITE + "px";
		WELL.appendChild(column);
	}

	if (contents[0].player_time != 0) {
		TIME = contents[0].player_time;
	}
	if (contents[0].player_speed != 0) {
		SPEED = contents[0].player_speed;
	}
	if (contents[0].square_id != 0) {
		SQUARE_ID = contents[0].square_id;
	}
	if (contents[0].pieces_dropped != 0) {
		PIECES = contents[0].pieces_dropped;
	}
	if (contents[0].lines_cleared != 0) {
		ROWS = contents[0].lines_cleared;
	}
}

/**
 * Update database game datas with JS's ones
 */
function sendGameDatas() {
	var MATRIX_JSON = JSON.stringify(MATRIX);
	executeScript("datas_player_sending.php?matrix=" + MATRIX_JSON + "&time=" + TIME + "&speed=" + SPEED + "&square_id=" + SQUARE_ID + "&pieces=" + PIECES + "&rows=" + ROWS, nothing);
}

/**
 * Active received gifts
 */
function receiveGifts(contents) {
	contents = JSON.parse(contents);

	// Launch each received gift
	for (g in contents) {
		new Gift(contents[g].name).launch();
		// Update database's game datas
		sendGameDatas();
	}
}

/**
 * Send to the given id's player the given position's item
 */
function sendGift(player_id, item_pos) {
	if (player_id == null) { // just delete the item
		// nothing
	} else if (player_id == "") { // use the item on himself
		GIFTS[item_pos].launch();
		// Update database's game datas
		sendGameDatas();
	} else { // send the item to the player
		executeScript("gift_sending.php?player=" + player_id + "&item=" + GIFTS[item_pos].name);
	}
	GIFTS.splice(item_pos, 1);
	displayItems();
}
