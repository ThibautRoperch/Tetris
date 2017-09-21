
var PLAYERS = [];
var MESSAGES = [];
var GAME_STARTED = false;

/**************************
 * Handle connections and players
 */

/**
 * Update the user's timestamp each second and retrieve the players list
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
	}, 500);
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
 * Save the players list in a JS array and display it in the HTML players list
 */
function displayPlayers(contents) {
	var list = document.getElementById("players");
	contents = JSON.parse(contents);

	// Compare the local JS array with the retrieved JSON array
	// Clean and reacreate the local JS array if their number of players are different
	var need_to_recreate_html = false;
	if (PLAYERS.length != contents.length) {
		PLAYERS = [];
		var need_to_recreate_html = true;
	}

	// Update the local JS array (and the HTML list if existing) with the retrieved JSON array
	for (p = 0; p < contents.length; ++p) {
		PLAYERS[p] = contents[p];
		if (!need_to_recreate_html) {
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("ready")[0].className = (PLAYERS[p].is_ready == 1) ? "ready" : "";
			list.getElementsByTagName("li")[p + 1].getElementsByTagName("pseudo")[0].innerHTML = PLAYERS[p].pseudo;
		}
	}

	// Clean and recreate the HTML players list with the local JS array, if have to do
	if (need_to_recreate_html) {
		// Clean
		while (list.getElementsByTagName("li")[1]) { // the li[0] contains the player's input, so don't remove it
			list.removeChild(list.getElementsByTagName("li")[1]);
		}
		// Recreate
		for (p in PLAYERS) {
			var player = document.createElement("li");
				var ready = document.createElement("ready");
				ready.innerHTML = "READY";
				if (PLAYERS[p].ready == 1) {
					ready.className = "ready";
				}
			player.appendChild(ready);
				var pseudo = document.createElement("pseudo");
				pseudo.innerHTML = PLAYERS[p].pseudo;
			player.appendChild(pseudo);
			list.appendChild(player);
		}
	}
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
	document.getElementById("players").getElementsByTagName("li")[0].getElementsByTagName("ready")[0].className = "ready";
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
	document.getElementById("players").getElementsByTagName("li")[0].getElementsByTagName("ready")[0].className = "";
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
		// Display the game instead of the lobby
		document.getElementsByTagName("game")[0].className = "visible";
		document.getElementsByTagName("lobby")[0].className = "invisible";	
		// TODO décompte qui tempo la fin de la boucle des scripts
		// A la fin du décompte :
			// Call the game's StartGame function
			startGame();
			// Start the lobby PlayingGame clock
			playingGame();
	}
}

/**
 * Permanantly check databases during the game
 */
function playingGame() {
	setTimeout(function() {
		if (GAME_STARTED) {
			executeScript("game_is_over.php", gameOverForEveryone);
			// TODO afficher les matrices des autres joueurs
			playingGame();
		}
	}, 500);
}

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
	}
}

/**************************
 * Void function
 */

function nothing() {
	
}
