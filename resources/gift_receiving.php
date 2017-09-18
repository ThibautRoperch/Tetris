<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];
	
	// Retrieve gifts destined to the player and remove them
	$gifts = "[";
	foreach($dbh->query("SELECT * FROM gifts WHERE recipient_id = $player_id") as $row) {
		if (strlen($gifts) > 1) {
			$gifts .= ", ";
		}
		$gifts .=
		"{
			\"name\" : ".$row["name"].",
			\"sender\" : \"".$row["sender_id"]."\"
		}";
		$dbh->exec("DELETE FROM gifts WHERE id = ".$row["id"]);
	}
	$gifts .= "]";

	echo $gifts;
		
	include_once("close_connection.php");
}

?>
