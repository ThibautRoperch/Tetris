<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];

	// Update the user's timestamp
	$dbh->exec("UPDATE players SET lobby_id = 0 WHERE id = $player_id");
}
	
?>
