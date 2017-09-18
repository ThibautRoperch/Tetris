<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Tetris</title>
	<link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/index.css">
</head>

<body onload="connections()" onkeydown="keyPressed(event)">
	
	<header>
		<h1>Tetris</h1>
	</header>

	<section>
		<article>
			<ul>
				<?php
				include_once("resources/open_connection.php");

				foreach($dbh->query("SELECT * FROM lobbies") as $row) {
					$lobby_id = $row["id"];
					$statut = ($row["is_playing"] == 1) ? "Game in progress" : "Open";
					$players_nb = $dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND last_timestamp > 0")->rowCount();

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

<script>

function goToLobby(lobby_id) {
	document.location = "lobby.php?id=" + lobby_id;
}

</script>
