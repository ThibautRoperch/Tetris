<?php

session_start();

if (isset($_SESSION["lobby"])) {
	$lobby_id = $_SESSION["lobby"];

	foreach($dbh->query("SELECT * FROM players WHERE lobby_id = $lobby_id AND connected = true") as $row) {
		echo "<li>";
		if ($row["id"] == $player_id) {
			echo "<input type=\"text\" onchange=\"renamePlayer(this)\" value=\"".$row["pseudo"]."\" />";
		} else {
			echo $row["pseudo"];
		}
		echo "</li>";
	}

}


?>
