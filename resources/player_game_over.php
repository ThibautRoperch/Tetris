<?php

session_start();

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
	include_once("open_connection.php");
	
    $lobby_id = $_SESSION["lobby"];
	$player_id = $_SESSION["player"];

	// Set the user as not playing
	$dbh->exec("UPDATE players SET is_playing = 0 WHERE id = $player_id");

    // Retrieve connected and ready players of the lobby who are playing
	$players_playing = $dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND last_timestamp > 0 AND is_ready = 1 AND is_playing = 1");
	// Set the user as not winner if there is still at least one player playing in the lobby
	if ($players_playing->rowCount() > 0) {
		$dbh->exec("UPDATE game_datas SET is_winner = 0 WHERE player_id = $player_id");
	}
	
	include_once("close_connection.php");
}

?>
