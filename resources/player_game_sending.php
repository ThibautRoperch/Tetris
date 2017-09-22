<?php

session_start();

if (isset($_SESSION["player"]) && isset($_GET["matrix"]) && isset($_GET["time"]) && isset($_GET["speed"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];
	$player_matrix = $_GET["matrix"];
	$player_time = $_GET["time"];
	$player_speed = $_GET["speed"];

	// Update user's game datas
	$dbh->exec("UPDATE game_datas SET player_matrix = '$player_matrix', player_time = $player_time, player_speed = $player_speed WHERE player_id = $player_id");
	// TODO la matrice ne passe pas, changer le format de la db pour JSON ?

	include_once("close_connection.php");
}

?>
