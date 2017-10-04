<?php

session_start();

if (isset($_SESSION["player"]) && !empty($_GET["matrix"]) && isset($_GET["time"]) && isset($_GET["speed"]) && isset($_GET["square_id"]) && isset($_GET["pieces"]) && isset($_GET["rows"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];
	$player_matrix = $_GET["matrix"];
	$player_time = $_GET["time"];
	$player_speed = $_GET["speed"];
	$square_id = $_GET["square_id"];
	$pieces_dropped = $_GET["pieces"];
	$lines_cleared = $_GET["rows"];

	// Update the player's game datas
	$dbh->exec("UPDATE game_datas SET player_matrix = '$player_matrix', player_time = $player_time, player_speed = $player_speed, square_id = $square_id, pieces_dropped = $pieces_dropped, lines_cleared = $lines_cleared WHERE player_id = $player_id");

	include_once("close_connection.php");
}

?>
