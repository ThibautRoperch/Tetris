<?php

include_once("manage_session.php");

if (isset($_SESSION["lobby"])) {
	$lobby_id = $_SESSION["lobby"];
	echo $lobby_id;
	// Update the lobby's playing status
	$dbh->exec("UPDATE lobbies SET is_playing = 1 WHERE id = $lobby_id");

	// Set as playing all connected and ready players of the lobby
	$dbh->exec("UPDATE players SET is_playing = 1 WHERE lobby_id = $lobby_id AND last_timestamp > 0 AND is_ready = 1");
}

?>
