<?php

session_start();

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];
	$player_id = $_SESSION["player"];

	// Retrieve the statistics of the player, then the statistics of other lobby's players
	$stats = "[";
	foreach($dbh->query("SELECT * FROM game_datas WHERE player_id = $player_id") as $row) {
		$stats .=
		"{
			\"id\" : ".$row["player_id"].",
			\"player_time\" : ".$row["player_time"].",
			\"pieces_dropped\" : ".$row["pieces_dropped"].",
			\"lines_cleared\" : ".$row["lines_cleared"].",
			\"items_sent\" : ".$row["items_sent"].",
			\"did_tetris\" : ".$row["did_tetris"].",
			\"is_winner\" : ".$row["is_winner"]."
		}";
	}
	foreach($dbh->query("SELECT * FROM game_datas WHERE player_id IN (SELECT id FROM players WHERE lobby_id = $lobby_id) AND player_id != $player_id") as $row) {
		$stats .= ", ";
		$stats .=
		"{
			\"id\" : ".$row["player_id"].",
			\"player_time\" : ".$row["player_time"].",
			\"pieces_dropped\" : ".$row["pieces_dropped"].",
			\"lines_cleared\" : ".$row["lines_cleared"].",
			\"items_sent\" : ".$row["items_sent"].",
			\"did_tetris\" : ".$row["did_tetris"].",
			\"is_winner\" : ".$row["is_winner"]."
		}";
	}
	$stats .= "]";

	echo $stats;

	include_once("close_connection.php");	
}

?>
