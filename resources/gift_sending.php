<?php

session_start();

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"]) && !empty($_GET["item"])) {
	include_once("open_connection.php");

	$lobby_id = $_SESSION["lobby"];
	$player_id = $_SESSION["player"];
	$gift_name = $_GET["item"];

	// Send the gift to one player if their is a recipient, to all players else
	if (!empty($_GET["recipient"])) {
		$recipient_id = $_GET["recipient"];
		// Append the gift
		$dbh->exec("INSERT INTO gifts (name, sender_id, recipient_id) VALUES('$gift_name', $player_id, $recipient_id)");
	} else {
		// Append gifts
		foreach($dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND is_playing = 1 AND id != $player_id") as $row) {
			$recipient_id = $row["id"];
			$dbh->exec("INSERT INTO gifts (name, sender_id, recipient_id) VALUES('$gift_name', $player_id, $recipient_id)");
		}
	}

	// Update the number of items sent of the player
	$items_sent = $dbh->query("SELECT items_sent FROM game_datas WHERE player_id = $player_id")->fetch()[0];
	$dbh->exec("UPDATE game_datas SET items_sent = $items_sent + 1 WHERE player_id = $player_id");

	include_once("close_connection.php");
}

?>
