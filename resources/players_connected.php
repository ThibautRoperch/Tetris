<?php

include_once("manage_session.php");

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
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
			\"pseudo\" : \"".$row["pseudo"]."\"
		}";
	}
	$players .= "]";
}

echo $players;

?>
