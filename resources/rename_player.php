<?php

include_once("manage_session.php");

if (isset($_SESSION["player"])) {
    $player_id = $_SESSION["player"];
    $new_pseudo = $_GET["pseudo"];

    // Change the user's pseudo
    $dbh->exec("UPDATE players SET pseudo = '$new_pseudo' WHERE id = $player_id");
}

?>
