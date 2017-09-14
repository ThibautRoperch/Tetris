
var HITBOXES = document.getElementsByTagName("hitboxes")[0];
var TIMER = document.getElementsByTagName("timer")[0];
var SPEED2 = document.getElementsByTagName("speed")[0];

HITBOXES.style.width = UNITE * COLUMNS_NB + "px";
HITBOXES.style.height = UNITE * ROWS_NB + "px";

debugClock();

function debugClock() {
	setTimeout(function() {
        displayMatrix();
        TIMER.innerHTML = TIME + " seconds";
        SPEED2.innerHTML = SPEED + " squares/s";
		debugClock();
	}, 50);
}

function displayMatrix() {
	HITBOXES.innerHTML = "";

	// Display each square of the matrix
	for (r = 0; r < MATRIX.length; ++r) {
		for (c = 0; c < MATRIX[r].length; ++c) {
			var square = document.createElement("square");
			square.style.width = SIDE + "px";
			square.style.height = SIDE + "px";
			square.style.borderWidth = BORDER + "px";
			if (MATRIX[r][c] == null) {
				square.className = "invisible";
			} else {
				square.innerHTML = MATRIX[r][c].id;
			}
			HITBOXES.appendChild(square);
		}
	}
}
