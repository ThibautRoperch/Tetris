<?php
session_start();

include_once("resources/open_connection.php");

// Retrieve the session lobby and session player if exists, create a session else 
if (!isset($_SESSION["lobby"])) {
	$_SESSION["lobby"] = 0;
}
if (!isset($_SESSION["player"])) {
	$pseudo = "Guest";
	$dbh->query("INSERT INTO players (connected, lobby_id) VALUES (1, $lobby_id)");
	$_SESSION["player"] = $dbh->lastInsertId();
}

$lobby_id = $_SESSION["lobby"];
$player_id = $_SESSION["player"];
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Play Tetris</title>
	<link rel="stylesheet" href="css/main.css">
</head>

<body onload="playerConnection(), executeScript('players_connected.php', displayPlayers)">

	Liste des joueurs :

	<ul id="players">
		<?php
		
		foreach($dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND connected = true") as $row) {
			echo "<li>";
			if ($row["id"] == $player_id) {
				echo "<input type=\"text\" onchange=\"renamePlayer(this)\" value=\"".$row["pseudo"]."\" />";
			} else {
				echo $row["pseudo"];
			}
			echo "</li>";
		}

		?>
	</ul>

</body>

</html>

<?php
include_once("resources/close_connection.php");
?>

<script src="js/lobby.js"></script>
<script src="js/oXHR.js"></script>
