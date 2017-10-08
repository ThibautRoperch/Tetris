
var PLAYERS = [];
var STATISTICS = [];
var MESSAGES = [];

var GAME_STARTED = false;

/**************************
 * Handle connections and players
 */

 /**
  * Make the player come back in the game
  */
function comeBack() {
	GAME_STARTED = true;
	// Display the game instead of the lobby
	document.getElementsByTagName("game")[0].className = "visible";
	document.getElementsByTagName("lobby")[0].className = "invisible";
	// Call the game's SetGame function
	setGame();
	// Wait for the recovery of the dabatase's matrix and parameters
	setTimeout(function() {
		// Display the game instead of the lobby
		document.getElementsByTagName("game")[0].className = "visible";
		document.getElementsByTagName("lobby")[0].className = "invisible";
		// Call the game's StartGame function
		startGame();
		// Start the lobby's PlayingGame clock
		playingGame();
	}, 1000);
}

/**
 * Update the user's timestamp each second and retrieve the players list and the messages list if the player is not already playing (according to the database) when he comes in the lobby
 */
function connections() {
	setTimeout(function() {
		if (!GAME_STARTED) {
			executeScript("game_is_over.php", displayButtonsOpenClose);
			executeScript("player_connection.php", nothing);
			executeScript("players_connected.php", displayPlayers);
			executeScript("message_receiving.php", displayChat);
			executeScript("players_are_ready.php", launchGame);
			connections();
		}
	}, 300);
}

/**
 * Display or not the open button and the close button
 */
function displayButtonsOpenClose(contents) {
	if (contents == "1") {
		document.getElementById("open").style.display = "block";
		document.getElementById("close").style.display = "none";
	} else {
		document.getElementById("open").style.display = "none";
		document.getElementById("close").style.display = "block";
	}
}

/**
 * Returns the end of game's statistics of the player's given id
 */
function statsOfPlayer(id) {
	for (p in STATISTICS) {
		if (STATISTICS[p].id == id) {
			return STATISTICS[p];
		}
	}
	return null;
}

/**
 * Find and return the player who has the highest APM
 */
function hotestPlayer() {
	var hotest_player = null;
	for (p in STATISTICS) {
		if (hotest_player == null || (STATISTICS[p].pieces_dropped / STATISTICS[p].player_time) > (hotest_player.pieces_dropped / hotest_player.player_time)) {
			hotest_player = STATISTICS[p];
		}
	}
	return hotest_player;
}

/**
 * Retrieve end of game's statistics, they will be displayed when players will be
 */
function retrieveStatistics(contents) {
	var list = document.getElementById("players");
	contents = JSON.parse(contents);

	// Set the local JS array with the retrieved JSON array (the player is in first ([0]))
	STATISTICS = contents;

	// Display stats of the player ([0])
	list.getElementsByTagName("li")[0].getElementsByTagName("winner")[0].className = (STATISTICS[0].is_winner) ? "true" : "";
	list.getElementsByTagName("li")[0].getElementsByTagName("pieces")[0].innerHTML = STATISTICS[0].pieces_dropped + " pieces";
	list.getElementsByTagName("li")[0].getElementsByTagName("time")[0].innerHTML = STATISTICS[0].player_time + " seconds";
	list.getElementsByTagName("li")[0].getElementsByTagName("apm")[0].innerHTML = Math.round(STATISTICS[0].pieces_dropped / (STATISTICS[0].player_time / 60)) + " p/m";

	// Reset and display medals of the player ([0])
	list.getElementsByTagName("li")[0].getElementsByTagName("medals")[0].innerHTML = "";
	list.getElementsByTagName("li")[0].getElementsByTagName("medals")[0].innerHTML += (STATISTICS[0].did_tetris) ? "<medal><img src=\"https://emoji.slack-edge.com/T6VPU2CEB/dab/b9f9a2dc59b07cde.png\" /><bubble>:dab: You did a Tetris!</bubble></medal>" : "";
	list.getElementsByTagName("li")[0].getElementsByTagName("medals")[0].innerHTML += (hotestPlayer().id == STATISTICS[0].id) ? "<medal>&#128293;<bubble>Congrats! " + Math.round(STATISTICS[0].pieces_dropped / (STATISTICS[0].player_time / 60)) + " pieces/min</bubble></medal>" : "";
}

/**
 * Save the players list in a JS array and display it in the HTML players list
 */
function displayPlayers(contents) {
	var list = document.getElementById("players");
	contents = JSON.parse(contents);

	// Compare the local JS array with the retrieved JSON array
	// Clean and reacreate the local JS array if their number of players are different
	if (PLAYERS.length != contents.length) {
		PLAYERS = [];
		// Clean the HTML players list
		while (list.getElementsByTagName("li")[1]) { // the li[0] contains the player's input, so don't remove it
			list.removeChild(list.getElementsByTagName("li")[1]);
		}
		// Recreate the HTML players list with the local JS array
		for (p in contents) {
			var player = document.createElement("li");
				var ready = document.createElement("winner");
				ready.innerHTML = "&#127775;";
			player.appendChild(ready);
				var pseudo = document.createElement("pseudo");
			player.appendChild(pseudo);
				var stats = document.createElement("stats");
					var pieces = document.createElement("pieces");
				stats.appendChild(pieces);
					var time = document.createElement("time");
				stats.appendChild(time);
					var apm = document.createElement("apm");
				stats.appendChild(apm);
			player.appendChild(stats);
				var medals = document.createElement("medals");
			player.appendChild(medals);
			list.appendChild(player);
		}
	}

	// Update the local JS array and the HTML list with the retrieved JSON array
	for (var p = 0; p < contents.length; ++p) {
		PLAYERS[p] = contents[p];
		// Set as ready this player if he is, and update his pseudo
		list.getElementsByTagName("li")[p + 1].className = (PLAYERS[p].is_ready == 1) ? "ready" : "";
		list.getElementsByTagName("li")[p + 1].getElementsByTagName("pseudo")[0].innerHTML = PLAYERS[p].pseudo;
		// If there is informations about this player's stats, display them
		var player_stats = statsOfPlayer(PLAYERS[p].id);
		if (player_stats != null) {
			// Display his stats
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("winner")[0].className = (player_stats.is_winner) ? "true" : "";
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("pieces")[0].innerHTML = player_stats.pieces_dropped + " pieces";
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("time")[0].innerHTML = player_stats.player_time + " seconds";
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("apm")[0].innerHTML = Math.round(player_stats.pieces_dropped / (player_stats.player_time / 60)) + "p/m";
			// Reset and display his medals
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("medals")[0].innerHTML = "";
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("medals")[0].innerHTML += (player_stats.did_tetris) ? "<medal><img src=\"https://emoji.slack-edge.com/T6VPU2CEB/dab/b9f9a2dc59b07cde.png\" /><bubble>Did a Tetris</bubble></medal>" : "";
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("medals")[0].innerHTML += (hotestPlayer().id == PLAYERS[p].id) ? "<medal>&#128293;<bubble>Highest APM</bubble></medal>" : "";
		}
	}
}

/**
 * Send the input chat message
 */
function submitChatForm(event, form) {
	event.preventDefault();
	// Retrieve the message from the chat input
	var message = form.getElementsByTagName("input")[0].value;
	// Avoid spaces who are at the begining and at the ending of the message
	while (message.length > 0 && message[0] == " ") {
		message = message.substr(1, message.length);
	}
	while (message.length > 0 && message[message.length - 1] == " ") {
		message = message.substr(0, message.length - 1);
	}
	// If the messages isn't empty, send and display it
	if (message != "") {
		// Send the message
		executeScript("message_sending.php?contents=" + message, nothing);
		// Append the message in the HTML messages list
		appendMessageHTML("you", message);
	}
	// Clean the chat input
	form.getElementsByTagName("input")[0].value = "";
}

/**
 * Save the retrieved messages in a JS array and display it in an HTML element
 * The oldest (0) to the newest (.length - 1)
 */
function displayChat(contents) {
	contents = JSON.parse(contents);
	
	// Compare the local JS array with the retrieved JSON array, find the last common message's position in the JSON array
	var i = 0;

	if (contents.length > 0 && MESSAGES.length > 0) {
		// When the local JS array is up-to-date
		if (contents[contents.length - 1].id == MESSAGES[MESSAGES.length - 1].id) {
			i = contents.length;
		}
		// When the local JS array is behind
		else {
			var i = contents.length - 1;
			while (i > 0 && contents[i].id != MESSAGES[MESSAGES.length - 1].id) {
				i--;
			}
			++i;
		}
	}

	// Append new messages in the local JS array and in the messages list
	while (i < contents.length) {
		MESSAGES.push(contents[i]);
		appendMessageHTML(contents[i].sender, contents[i].contents)
		++i;
	}
}

/**
 * Append a message in the HTML messages list
 */
function appendMessageHTML(sender, contents) {
	var list = document.getElementById("messages");
	var message = document.createElement("li");
	message.innerHTML = "<pseudo>" + sender + " :</pseudo><contents>" + contents + "</contents>";
	list.appendChild(message);
}

/**
 * Rename the player
 */
function renamePlayer(input) {
	executeScript("rename_player.php?pseudo=" + input.value, nothing);
}

/**
 * Set the player as ready
 */
function setAsReady(button) {
	executeScript("player_ready.php?is_ready=true", nothing);	
	// Change button's look and its onclick's target
	button.className = "ready";
	button.onclick = function() { setAsNotReady(this); };
	// Update player's mark
	document.getElementById("players").getElementsByTagName("li")[0].className = "ready";
}

/**
 * Set the player as not ready
 */
function setAsNotReady(button) {
	executeScript("player_ready.php?is_ready=false", nothing);	
	// Change button's look and its onclick's target
	button.className = "";
	button.onclick = function() { setAsReady(this); };
	// Update player's mark
	document.getElementById("players").getElementsByTagName("li")[0].className = "";
}


/**************************
 * Let's gooooo
 */

/**
 * Launch the game if all players are ready
 */
function launchGame(contents) {
	if (contents == "1") {
		GAME_STARTED = true;
		// The game starts in the database
		executeScript("game_starts.php", nothing);
		// TODO fonction compteur(3) qui affiche 3 puis compteur-1 jusqu'à 0, gros chiffre pleine page ("position: absolute")
		// Wait for the deletation of the previous matrix and the creation of a new one
		setTimeout(function() {
			// Call the game's SetGame function
			setGame();
			// Wait for the recovery of the dabatase's matrix and parameters
			setTimeout(function() {
				// Display the game instead of the lobby
				document.getElementsByTagName("game")[0].className = "visible";
				document.getElementsByTagName("lobby")[0].className = "invisible";
				// Call the game's StartGame function
				startGame();
				// Start the lobby's PlayingGame clock
				playingGame();
			}, 1000);
		}, 1000);
	}
}

/**
 * Permanantly check databases during the game
 */
function playingGame() {
	setTimeout(function() {
		if (GAME_STARTED) {
			executeScript("player_connection.php", nothing);
			executeScript("game_is_over.php", gameOverForEveryone);
			executeScript("datas_players.php", displayOthersPlayers);
			playingGame();
		}
	}, 300);
}

/**
 * Set the game as over for everyone 
 */
function gameOverForEveryone(contents) {
	if (contents == "1") {
		GAME_STARTED = false;
		// The game overs in the database
		executeScript("game_overs.php", nothing);
		// Call the game's GameOver function
		gameOver();
		// Start the lobby's clock
		connections();
		// Set the player as not ready
		setAsNotReady(document.getElementById("open"));
		// Display the lobby instead of the game
		document.getElementsByTagName("game")[0].className = "invisible";
		document.getElementsByTagName("lobby")[0].className = "visible";
		// Retrieve end of game's statistics, they will be displayed when players will be
		executeScript("datas_stats.php", retrieveStatistics);
	}
}

/**
 * Display the well of other players from their matrix
 */
function displayOthersPlayers(contents) {
	contents = JSON.parse(contents);

	// Remove all other players
	while (document.getElementsByTagName("others")[0].hasChildNodes()) {
		document.getElementsByTagName("others")[0].removeChild(document.getElementsByTagName("others")[0].lastChild);
	}
	// Display each other player name and player matrix in a new HTML element
	for (m in contents) {
		// Create HTML elements
		var player = document.createElement("player");
			var name = document.createElement("name");
				name.innerHTML = contents[m].player;
			var field = document.createElement("field");
			player.appendChild(name);
			player.appendChild(field);
			player.style.width = UNITE * (NEXT_PIECE.getStructure()[0].length + 1) + "px";
		document.getElementsByTagName("others")[0].appendChild(player);
		// Append squares to the field if there is squares in the matrix
		if (contents[m].matrix != "") {
			var json_matrix = JSON.parse(contents[m].matrix);
			for (r in json_matrix) {
				var row = document.createElement("row");
				for (s in json_matrix[r]) {
					// Append this square of the piece to the field
					var square = document.createElement("square");
					if (json_matrix[r][s] == null) {
						square.className = "invisible";
					} else {				
						// square.innerHTML = json_matrix[r][s].id;
						square.className = json_matrix[r][s].type;
					}
					row.appendChild(square);
				}
				field.appendChild(row);
			}
		}
	}
}

/**************************
 * Void function
 */

function nothing() {
	
}
