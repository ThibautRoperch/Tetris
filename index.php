<?php
include_once("resources/manage_session.php");

$player = $dbh->query("SELECT * FROM players WHERE id = ".$_SESSION["player"])->fetch();
$pseudo = $player["pseudo"];
$is_ready = $player["is_ready"];

$lobby = $dbh->query("SELECT * FROM lobbies WHERE id = ".$_SESSION["lobby"])->fetch(); // provisoire, l'id du lobby sera dans le lien et pas dans un cookie
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
			<article>
				<?php
				// Display a message if a game is in progress, a ready button else
				if ($lobby["is_playing"]) {
					echo "Game in progress";
					// TODO spectate the game
					/* <button class="<?php echo ($is_ready == 1) ? "ready" : ""; ?>" onclick="<?php echo ($is_ready == 1) ? "setAsNotReady(this)" : "setAsReady(this)"; ?>">spectate the game</button>*/
				} else {
					?>
					<button class="<?php echo ($is_ready == 1) ? "ready" : ""; ?>" onclick="<?php echo ($is_ready == 1) ? "setAsNotReady(this)" : "setAsReady(this)"; ?>">ready</button>
					<?php
				}
				?>
			</article>

			<article>
				<ul id="players">
					<li>
						<ready class="<?php echo ($is_ready == 1) ? "ready" : ""; ?>">READY</ready>
						<input type="text" onkeyup="renamePlayer(this)" value="<?php echo $pseudo; ?>" required />
					</li>
				</ul>
				<chat>
					<ul id="messages">
					</ul>
				</chat>
			</article>
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
