<?php

session_start();

include_once("open_connection.php");

// Create a lobby session if it doesn't exist yet
if (!isset($_SESSION["lobby"])) {
	$_SESSION["lobby"] = 0;
}

// Check the presence of the player in the database if there is a player session
$recreate_player = false;
if (isset($_SESSION["player"])) {
	$player_id = $_SESSION["player"];

	// Check the player's id's presence in the database
	$player_query = $dbh->query("SELECT * FROM players WHERE id = $player_id");
	if ($player_query->rowCount() == 0) {
		$recreate_player = true;
	}
}

// Create the player if there isn't player session yet or if he doesn't exists in the database
if (!isset($_SESSION["player"]) || $recreate_player) {
	$lobby_id = $_SESSION["lobby"];	
	$dbh->exec("INSERT INTO players (lobby_id) VALUES ($lobby_id)");
	// ajouter des valeurs par défaut aux colonnes, ou les donner ici
	$_SESSION["player"] = $dbh->lastInsertId();
}

?>
