<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];

	// Receive the player's game datas
	$player_game_datas = $dbh->query("SELECT * FROM game_datas WHERE player_id = $player_id")->fetch();

	$datas = "[";
	$datas .=
	" {
		\"matrix\" : \"".addslashes($player_game_datas["player_matrix"])."\",
		\"time\" : ".$player_game_datas["player_time"].",
		\"speed\" : ".$player_game_datas["player_speed"]."
	}";
	$datas .= "]";

	echo $datas;
	
	include_once("close_connection.php");
}

?>
