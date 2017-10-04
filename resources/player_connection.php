<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];

	// Update the player's timestamp
	$dbh->exec("UPDATE players SET last_timestamp = ".time()." WHERE id = $player_id");   

	// Reset players who have timeout
	$dbh->exec("UPDATE players SET last_timestamp = 0, is_ready = 0, is_playing = 0 WHERE last_timestamp < ".(time() - 7));

	// Remove gifts of players who have timeout
	$dbh->exec("DELETE FROM gifts WHERE player_id IN (SELECT id FROM players WHERE last_timestamp = 0)");

	// Remove datas of players who have timeout
	$dbh->exec("DELETE FROM game_datas WHERE player_id IN (SELECT id FROM players WHERE last_timestamp = 0)");

	include_once("close_connection.php");
}
	
?>
