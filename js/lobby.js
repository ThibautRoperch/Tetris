
var CONNECTIONS;
var PLAYERS = [];

/**************************
 * Handle connections and players
 */

/**
 * Update the user's timestamp each second and retrieve the players list
 */
function connections() {
	CONNECTIONS = setTimeout(function() {
		executeScript('player_connection.php', nothing);
		executeScript('players_connected.php', displayPlayers);
		connections();
	}, 500);
}

/**
 * Update or display the players list in an HTML element
 */
function displayPlayers(contents) {
	var list = document.getElementById("players");
	contents = JSON.parse(contents);

	// Compare the local JS array with the retrieved JSON array, there is a difference between only if two ids are different
	if (PLAYERS.length != contents.length) {
		PLAYERS = [];
	}
	var differences = false;
	for (p = 0; p < contents.length; ++p) {
		// Update the local JS array if there is a difference
		// Else, update the pseudo if they are different
		if (!PLAYERS[p] || PLAYERS[p].id != contents[p].id) {
			differences = true;
			PLAYERS[p] = contents[p];
		} else if (PLAYERS[p].pseudo != contents[p].pseudo) {
			PLAYERS[p].pseudo = contents[p].pseudo;
			list.getElementsByTagName("li")[p + 1].innerHTML = PLAYERS[p].pseudo;
		}
	}

	// If some differences has been detected, update the HTML list
	if (differences) {
		while (list.getElementsByTagName("li")[1]) {
			list.removeChild(list.getElementsByTagName("li")[1]);
		}
		for (p in PLAYERS) {
			var player = document.createElement("li");
			player.innerHTML = PLAYERS[p].pseudo;
			list.appendChild(player);
		}
	}
}

function renamePlayer(input) {
	executeScript("rename_player.php?pseudo=" + input.value, nothing);
}

/**************************
 * Let's gooooo
 */

function launchGame() {
	startGame();
	// lance les fonction qui tourneront h24 : le tchat, les autres joueurs
}

function displayTchat() {
	// affiche le tchat (rquete script php) dans un noeud html -> TODO une fonction qui check en permanance et qui affiche le résultat
}

function display() {
	// affiche le tchat (rquete script php) dans un noeud html -> TODO une fonction qui check en permanance et qui affiche le résultat
}


/**************************
 * Void function
 */

function nothing() {
	
}
