<?php

session_start();

if (isset($_SESSION["player"]) && !empty($_GET["is_ready"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];

	// Set the player as ready
	$dbh->exec("UPDATE players SET is_ready = ".$_GET["is_ready"]." WHERE id = $player_id");

	include_once("close_connection.php");
}

?>
