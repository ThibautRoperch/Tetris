<?php

session_start();

if (isset($_SESSION["lobby"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];

	// Update the lobby's playing status
	$dbh->exec("UPDATE lobbies SET is_playing = 0 WHERE id = $lobby_id");

	// Set as not playing and not ready all players of the lobby
	$dbh->exec("UPDATE players SET is_playing = 0, is_ready = 0 WHERE lobby_id = $lobby_id"); // if some players bugged (ready and playing but not connected), they are reseted

	// Remove all not used gifts of the lobby
	$dbh->exec("DELETE FROM gifts WHERE recipient_id = (SELECT id FROM players WHERE lobby_id = $lobby_id)");
}

?>
