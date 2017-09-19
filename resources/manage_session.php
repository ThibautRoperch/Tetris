<?php

session_start();

include_once("open_connection.php");

// Check the presence of the player in the database if there is a player session, and update his lobby id (the player can move throught lobbies)
$recreate_player = false;

if (isset($_SESSION["player"])) {
	$player_id = $_SESSION["player"];

	// Check the player's id's presence in the database
	$player_query = $dbh->query("SELECT * FROM players WHERE id = $player_id");

	// If he isn't in the database, have to recreate him with a new player id
	if ($player_query->rowCount() == 0) {
		$recreate_player = true;
	}
}

// Create the player if there isn't player session yet or if he doesn't exists in the database
if (!isset($_SESSION["player"]) || $recreate_player) {
	$dbh->exec("INSERT INTO players () VALUES ()");
	$_SESSION["player"] = $dbh->lastInsertId();
	$player_id = $_SESSION["player"];
	$player_pseudo = "Guest$player_id";
	$dbh->exec("UPDATE players SET pseudo = '$player_pseudo' WHERE id = $player_id");
}

include_once("close_connection.php");

?>
