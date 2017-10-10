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
		\"current_piece\" : \"".addslashes($player_game_datas["current_piece"])."\",
		\"next_piece\" : \"".addslashes($player_game_datas["next_piece"])."\",
		\"player_time\" : ".$player_game_datas["player_time"].",
		\"player_speed\" : ".$player_game_datas["player_speed"].",
		\"square_id\" : ".$player_game_datas["square_id"].",
		\"pieces_dropped\" : ".$player_game_datas["pieces_dropped"].",
		\"lines_cleared\" : ".$player_game_datas["lines_cleared"].",
		\"items_list\" : \"".addslashes($player_game_datas["items_list"])."\"
	}";
	$datas .= "]";

	echo $datas;
	
	include_once("close_connection.php");
}

?>
