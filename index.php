<?php
include_once("resources/manage_session.php");

$pseudo = $dbh->query("SELECT pseudo FROM players WHERE id = ".$_SESSION["player"])->fetch()[0];
?>

<!-- à terme deviendra lobby.php, index.php sera l'accueil des différents lobbies -->

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Play Tetris</title>
	<link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/lobby.css">
	<link rel="stylesheet" href="css/game.css">
</head>

<body onload="connections()" onkeydown="keyPressed(event)">
	
	<header>
		<h1>Tetris</h1>
	</header>

	<section>
		<lobby>
			Liste des joueurs :

			<ul id="players">
				<li>
					<input type="text" onchange="renamePlayer(this)" value="<?php echo $pseudo; ?>" />
				</li>
			</ul>

			<button onclick="launchGame()">JOUER</button>
		</lobby>
		
		<game>
			<left-neighbour></left-neighbour>
			<board>
				<well></well>
				<next></next>
			</board>
			<right-neighbour></right-neighbour>
		</game>
	</section>

	<footer>
		RIP IN PEACE BLOCKBATTLE.NET
	</footer>

</body>

</html>

<?php
include_once("resources/close_connection.php");
?>

<script src="js/lobby.js"></script>
<script src="js/oXHR.js"></script>
<script src="js/classes.js"></script>
<script src="js/game.js"></script>
