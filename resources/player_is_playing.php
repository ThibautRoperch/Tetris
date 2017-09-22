<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");
	
	$player_id = $_SESSION["player"];

	// Retrieve the player
	$player = $dbh->query("SELECT is_playing FROM players WHERE id = $player_id")->fetch();

	echo $player["is_playing"];

	include_once("close_connection.php");	
}

?>
