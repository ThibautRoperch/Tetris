<?php

include_once("manage_session.php");

if (isset($_SESSION["player"])) {
    $player_id = $_SESSION["player"];

    // Set the user not playing
    $dbh->exec("UPDATE players SET is_playing = 0 WHERE id = $player_id");
}

?>
