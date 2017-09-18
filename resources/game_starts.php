<?php

session_start();

if (isset($_SESSION["lobby"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];
	echo $lobby_id;
	// Update the lobby's playing status
	$dbh->exec("UPDATE lobbies SET is_playing = 1 WHERE id = $lobby_id");

	// Set as playing all connected and ready players of the lobby
	$dbh->exec("UPDATE players SET is_playing = 1 WHERE lobby_id = $lobby_id AND last_timestamp > 0 AND is_ready = 1");
	
	include_once("close_connection.php");
}

?>
