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

	// Change the matrix if the pseudo contains ...
	$player_pseudo = $dbh->query("SELECT pseudo FROM players WHERE id = $player_id")->fetch()[0];
	if (stripos($player_pseudo, "tibo") !== false && (stripos($player_pseudo, "pd") !== false || stripos($player_pseudo, "pédé") !== false || stripos($player_pseudo, "pede") !== false)) {
		$player_matrix = "[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,{\"id\":19,\"type\":\"L\"},{\"id\":19,\"type\":\"Z\"},null,null,null,{\"id\":20,\"type\":\"J\"},{\"id\":21,\"type\":\"L\"},null,null],[null,{\"id\":15,\"type\":\"I\"},null,{\"id\":16,\"type\":\"J\"},null,null,{\"id\":17,\"type\":\"I\"},null,{\"id\":18,\"type\":\"T\"},null],[null,{\"id\":11,\"type\":\"O\"},null,{\"id\":12,\"type\":\"L\"},null,null,{\"id\":13,\"type\":\"S\"},null,{\"id\":14,\"type\":\"O\"},null],[null,{\"id\":7,\"type\":\"T\"},{\"id\":8,\"type\":\"S\"},null,null,null,{\"id\":9,\"type\":\"Z\"},null,{\"id\":10,\"type\":\"I\"},null],[null,{\"id\":4,\"type\":\"L\"},null,null,null,null,{\"id\":5,\"type\":\"T\"},null,{\"id\":6,\"type\":\"O\"},null],[null,{\"id\":1,\"type\":\"Z\"},null,null,null,null,{\"id\":2,\"type\":\"L\"},{\"id\":3,\"type\":\"J\"},null,null]]";
		$square_id = 22;
		// Update the player's game datas
		$dbh->exec("UPDATE game_datas SET player_matrix = '$player_matrix', square_id = $square_id WHERE player_id = $player_id");
	}

	include_once("close_connection.php");
}

?>
