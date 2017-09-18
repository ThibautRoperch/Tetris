<?php

include_once("manage_session.php");

if (isset($_SESSION["player"]) && isset($_GET["is_ready"])) {
    $player_id = $_SESSION["player"];

    // Set the user ready
    $dbh->exec("UPDATE players SET is_ready = ".$_GET["is_ready"]." WHERE id = $player_id");
}

?>
