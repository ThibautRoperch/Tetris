<?php

session_start();

if (isset($_SESSION["player"]) && !empty($_GET["contents"])) {
	include_once("open_connection.php");

	$player_id = $_SESSION["player"];
	$message_contents = $_GET["contents"];
	
	// Append the message
	$dbh->exec("INSERT INTO messages (contents, sender_id, sending_timestamp) VALUES('$message_contents', $player_id, ".time().")");

	// Remove old messages
	$dbh->exec("DELETE messages WHERE sending_timestamp < ".(time() - 3600)); // 1 hour
	
	include_once("close_connection.php");
}

?>
