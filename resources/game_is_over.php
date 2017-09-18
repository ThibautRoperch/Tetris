<?php

session_start();

if (isset($_SESSION["lobby"])) {
	include_once("open_connection.php");

    $lobby_id = $_SESSION["lobby"];
    
	// Retrieve connected and ready players of the lobby
    $players = $dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND last_timestamp > 0 AND is_ready = 1");
    // Retrieve connected and ready players of the lobby who are playing
	$players_playing = $dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND last_timestamp > 0 AND is_ready = 1 AND is_playing = 1");
    
    // If the player is playing alone, the game is over if all lobby's players are not playing anymore
    // Else, the game is over if only one player is playing
    $game_is_over = false;
    if ($players->rowCount() == 1) {
        $game_is_over = $players_playing->rowCount() == 0;
    } else {
        $game_is_over = $players_playing->rowCount() <= 1;
    }

    echo $game_is_over;

	include_once("close_connection.php");    
}

?>
