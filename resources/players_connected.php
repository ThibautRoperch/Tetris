<?php

session_start();

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];
	$player_id = $_SESSION["player"];

	// Retrieve the connected players list of the lobby
	$players = "[";
	foreach($dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND last_timestamp > 0 AND id != $player_id") as $row) {
		if (strlen($players) > 1) {
			$players .= ", ";
		}
		$players .=
		"{
			\"id\" : ".$row["id"].",
			\"pseudo\" : \"".$row["pseudo"]."\",
			\"is_ready\" : \"".$row["is_ready"]."\"
		}";
	}
	$players .= "]";

	echo $players;

	include_once("close_connection.php");	
}

?>
