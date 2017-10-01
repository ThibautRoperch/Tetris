<?php

session_start();

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];
	$player_id = $_SESSION["player"];

	// Update the lobby's playing status
	$dbh->exec("UPDATE lobbies SET is_playing = 1 WHERE id = $lobby_id");

	// Set the player as playing
	$dbh->exec("UPDATE players SET is_playing = 1 WHERE id = $player_id");

	// Remove old datas of the player
	$dbh->exec("DELETE FROM game_datas WHERE player_id = $player_id");

	// Create a new game datas for the player
	$dbh->exec("INSERT INTO game_datas (player_id) VALUES ($player_id)");
	
	include_once("close_connection.php");
}

?>
