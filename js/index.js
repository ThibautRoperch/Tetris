
function refresh() {
	document.location = document.location;
}

function goToLobby(lobby_id) {
	var url = document.location.href;
	var new_url = url.substr(0, url.lastIndexOf("/")) + "/" + lobby_id;
	document.location = new_url;
}

function nothing() {
	
}
