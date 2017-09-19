<?php
include_once("resources/manage_session.php");

// Update the lobby session with the URL
if (isset($_GET["id"])) {
	$_SESSION["lobby"] = $_GET["id"];
} else {
	header("Location: index.php");
}

include("resources/open_connection.php");

// Update the database with the lobby session
$dbh->exec("UPDATE players SET lobby_id = ".$_SESSION["lobby"]." WHERE id = ".$_SESSION["player"]);

$player = $dbh->query("SELECT * FROM players WHERE id = ".$_SESSION["player"])->fetch();
$pseudo = $player["pseudo"];
$is_ready = $player["is_ready"];
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>Tetris Lobby <?php echo $_GET["id"]; ?></title>
	<link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/lobby.css">
	<link rel="stylesheet" href="css/game.css">
</head>

<body onload="connections()" onkeydown="keyPressed(event)">
	
	<header>
		<h1>TETRIS</h1>
	</header>

	<section>
		<lobby>
			<article>
				<button id="close" class="ready">game in progress</button>
				<button id="open" class="<?php echo ($is_ready == 1) ? "ready" : ""; ?>" onclick="<?php echo ($is_ready == 1) ? "setAsNotReady(this)" : "setAsReady(this)"; ?>">ready</button>
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
					<form onsubmit="submitChatForm(event, this)" action="resources/message_sending.php" method="GET" >
						<input id="message" type="text" placeholder="Tapez un message" />
					</form>
				</chat>
			</article>
		</lobby>
		
		<game>
			<board>
				<well></well>
				<next></next>
			</board>
			<others>
				<!-- <player>
					<name>ducon</name>
					<field></field>
				</player> -->
			<others>
		</game>
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
<script src="js/lobby.js"></script>
<script src="js/classes.js"></script>
<script src="js/game.js"></script>
