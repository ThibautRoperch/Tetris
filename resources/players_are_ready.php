<?php

session_start();

if (isset($_SESSION["lobby"])) {
	include_once("open_connection.php");
	
	$lobby_id = $_SESSION["lobby"];

	// Retrieve players of the lobby
	$players_are_ready = true;
	foreach($dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND last_timestamp > 0") as $row) {
		$players_are_ready = $players_are_ready & $row["is_ready"];
	}

	echo $players_are_ready;

	include_once("close_connection.php");	
}

?>
