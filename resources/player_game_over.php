<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");
	
	$player_id = $_SESSION["player"];

	// Set the user not playing
	$dbh->exec("UPDATE players SET is_playing = 0 WHERE id = $player_id");

	include_once("close_connection.php");
}

?>
