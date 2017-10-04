<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];
	
	// Set the player as did a Tetris
	$dbh->exec("UPDATE game_datas SET did_tetris = 1 WHERE player_id = $player_id");
	
	include_once("close_connection.php");
}

?>
