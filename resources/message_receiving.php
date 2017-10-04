<?php

session_start();

if (isset($_SESSION["player"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];
	
	// Retrieve all recent messages
	$messages = "[";
	foreach($dbh->query("SELECT * FROM messages WHERE sending_timestamp >= ".(time() - 6)." AND sender_id != $player_id ORDER BY id ASC") as $row) {
        $sender_pseudo = $dbh->query("SELECT pseudo FROM players WHERE id = ".$row["sender_id"])->fetch()[0];
		if (strlen($messages) > 1) {
			$messages .= ", ";
		}
		$messages .=
		"{
			\"id\" : ".$row["id"].",
			\"contents\" : \"".$row["contents"]."\",
			\"sender\" : \"$sender_pseudo\",
			\"sending_timestamp\" : \"".$row["sending_timestamp"]."\"
		}";
	}
	$messages .= "]";

	echo $messages;
		
	include_once("close_connection.php");
}

?>
