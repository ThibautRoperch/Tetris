<?php

include_once("manage_session.php");

if (isset($_SESSION["lobby"]) && isset($_SESSION["player"])) {
	$lobby_id = $_SESSION["lobby"];
    $player_id = $_SESSION["player"];

    // Update the user's timestamp
    $dbh->exec("UPDATE players SET last_timestamp = ".time()." WHERE id = $player_id");

    // Deconnect players who have timeout
    $dbh->exec("UPDATE players SET last_timestamp = 0 WHERE last_timestamp < ".(time() - 3));
}

?>
