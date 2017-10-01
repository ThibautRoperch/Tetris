<?php

session_start();

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];
	$player_id = $_SESSION["player"];

	// Receive all game's datas of players that are in the lobby, expect this player
	$datas = "[";
	foreach($dbh->query("SELECT * FROM game_datas WHERE player_id IN (SELECT id FROM players WHERE lobby_id = $lobby_id) AND player_id != $player_id") as $row) {
        $player = $dbh->query("SELECT pseudo FROM players WHERE id = ".$row["player_id"])->fetch()[0];
		if (strlen($datas) > 1) {
			$datas .= ", ";
		}
		$datas .=
		" {
			\"player\" : \"".$player."\",
			\"matrix\" : \"".addslashes($row["player_matrix"])."\"
		}";
	}
	$datas .= "]";
	
	echo $datas;
	
	include_once("close_connection.php");
}

?>
