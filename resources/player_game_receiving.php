<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];

	// Receive user's game datas
	$player_game_datas = $dbh->query("SELECT * FROM game_datas WHERE player_id = $player_id ORDER BY id DESC LIMIT 1")->fetch(); // there might be many game datas for a player id, just take the most recent one
print_r($player_game_datas);
	$datas = "[";
	$datas .=
	" {
		\"matrix\" : \"".$player_game_datas["player_matrix"]."\",
		\"time\" : ".$player_game_datas["player_time"].",
		\"speed\" : ".$player_game_datas["player_speed"]."
	}";
	$datas .= "]";

	echo $datas;
	
	include_once("close_connection.php");
}

?>
