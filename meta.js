function getMeta(ref, key, callback) {
	return ref.child("meta").child(key).once("value").then(function(snapshot) {
		return callback(snapshot.val());
	});
}

function setMeta(ref, key, value) {
	ref.child("meta").child(key).set(value);
}

function onMeta(ref, key, callback) {
	ref.child("meta").child(key).on("value", function(snapshot) {
		return callback(snapshot.val());
	});
}

function assembleUserDetails() {

	function uuidv4() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}	  

	function slugify(text) {
		return text
			.toString()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-')
	}

	storedUsername = localStorage.getItem("username");

	var username = prompt("Pick a username:", storedUsername && storedUsername != "null" ? storedUsername : "");

	if(username) {
		username = slugify(username);
		localStorage.setItem("username", username);
	}
	else {
		username = "Anonymous";
	}

	return {
		username: username,
		id: username + "____" + uuidv4(),
		color: randomColor()
	}
}