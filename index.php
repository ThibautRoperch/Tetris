<?php
include_once("resources/manage_session.php");

include("resources/open_connection.php");

$player_id = $_SESSION["player"];
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Tetris</title>
	<link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/index.css">
</head>

<body onload="executeScript('player_deconnection.php', nothing)">
	
	<header>
		<h1><a href="index.php">TETRIS</a></h1>
	</header>

	<section>
		<article style="margin:10px 25px;">
			<button onclick="refresh()" style="float: right">&#11118;</button>
		</article>
		<article>
			<ul>
				<?php
				foreach($dbh->query("SELECT * FROM lobbies") as $row) {
					$lobby_id = $row["id"];
					$players_nb = $dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND last_timestamp > 0 AND id != $player_id")->rowCount();
					$statut = ($row["is_playing"] == 1 && $players_nb > 0) ? "Game in progress" : "Open";
					
					if ($players_nb == 0) {
						$dbh->exec("UPDATE lobbies SET is_playing = 0 WHERE id = $lobby_id");
					}
					
					echo "<li>";
						echo "<name>Lobby $lobby_id</name>";
						echo "<playing>$statut</playing>";
						echo "<players>$players_nb players</players>";
						echo "<button onclick=\"goToLobby($lobby_id)\">go to lobby $lobby_id</button>";
					echo "</li>";
				}
				?>
			</ul>
		</article>
	</section>
	
	<footer>
		RIP IN PEACE BLOCKBATTLE.NET
	</footer>

</body>

</html>

<?php
include("resources/close_connection.php");				
?>				

<script src="js/oXHR.js"></script>
<script src="js/index.js"></script>
