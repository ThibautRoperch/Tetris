<?php

session_start();

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];
	$player_id = $_SESSION["player"];

	// Receive all game's datas of players that are in the lobby, expect this player
	$datas = "[";
	foreach($dbh->query("SELECT player_id, player_matrix, items_list FROM game_datas WHERE player_id IN (SELECT id FROM players WHERE lobby_id = $lobby_id AND is_playing = 1) AND player_id != $player_id") as $row) {
        $player = $dbh->query("SELECT pseudo FROM players WHERE id = ".$row["player_id"])->fetch()[0];
		if (strlen($datas) > 1) {
			$datas .= ", ";
		}
		$datas .=
		" {
			\"id\" : ".$row["player_id"].",
			\"name\" : \"".$player."\",
			\"matrix\" : \"".addslashes($row["player_matrix"])."\",
			\"items\" : \"".addslashes($row["items_list"])."\"
		}";
	}
	$datas .= "]";
	
	echo $datas;
	
	include_once("close_connection.php");
}

?>
