
/**************************
 * 
 */

/**
 * 
 */

function playerConnection() {
	// appelle le script php qui met à date() le timestamp de l'id du player de la session (si y'a) et qui supprime les date() - timestamp > x
	// se rappelle dans 3 secondes
}

function renamePlayer() {
	// appelle le script php qui change le pseudo where id = session id si y'a
}

function displayConnectedPlayers(contents) {
	document.getElementById("players").innerHTML = contents;
}
