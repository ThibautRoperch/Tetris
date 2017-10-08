<?php

session_start();

if (isset($_SESSION["player"]) && !empty($_GET["pseudo"])) {
    include_once("open_connection.php");

    $player_id = $_SESSION["player"];
    $new_pseudo = $_GET["pseudo"];

    // Change the user's pseudo
    $dbh->exec("UPDATE players SET pseudo = '$new_pseudo' WHERE id = $player_id");

	include_once("close_connection.php");    
}

?>
