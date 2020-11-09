function init() {
	
	// Initialize Firebase.
	var config = {
	  apiKey: "AIzaSyBryJ-i-Q-ogDQeEjEbQGowRxjWCIzDDKg",
	  authDomain: "kody-dd8ab.firebaseapp.com",
	  databaseURL: "https://kody-dd8ab.firebaseio.com"
	};
	firebase.initializeApp(config);

	var user = assembleUserDetails();

	// Get Firebase Database reference.
	var firepadRef = getExampleRef();

	// Create ACE
	var editor = ace.edit("firepad-container");

	var session = editor.getSession();
	session.setUseWrapMode(true);
	session.setUseWorker(false);

	// Load mode list
	var modelist = ace.require("ace/ext/modelist");
	var $modesList = document.getElementById("modesList");
	modelist.modes.map(function(mode) {
	  var modeOpt = document.createElement("option");
	  modeOpt.innerText = mode.caption;
	  modeOpt.value = mode.mode;

	  $modesList.appendChild(modeOpt);
	});

	$modesList.onchange = function() {
	  session.setMode($modesList.value);
	  setMeta(firepadRef, "mode", $modesList.value);
	};

	onMeta(firepadRef, "mode", function(value) {
		session.setMode(value);
		document.querySelector('#modesList [value="' + value + '"]').selected = true;
	});

	// Load theme list
	var themelist = ace.require("ace/ext/themelist");
	var $themeList = document.getElementById("themeList");
	themelist.themes.map(function(theme) {
	  var themeOpt = document.createElement("option");
	  themeOpt.innerText = theme.caption;
	  themeOpt.value = theme.theme;

	  $themeList.appendChild(themeOpt);
	});

	$themeList.onchange = function() {
		editor.setTheme($themeList.value);
		setMeta(firepadRef, "theme", $themeList.value);
	};

	onMeta(firepadRef, "theme", function(value) {
		editor.setTheme(value);
		document.querySelector('#themeList [value="' + value + '"]').selected = true;
	});

	// Create Firepad.
	var firepad = Firepad.fromACE(firepadRef, editor, {
	  defaultText: "// Let's write some code!"
	});

	firepad.setUserId(user.id);
	firepad.setUserColor(user.color);

	window.onfocus = function () {
		firepad.setUserColor(user.color);
	}; 

	window.onblur = function () {
		firepad.setUserColor("#CCC");
	}; 

	onUsers(firepadRef, function(users) {
		updateUserList(users);
	})
  }

  // Helper to get hash from end of URL or generate a random one.
  function getExampleRef() {
	var ref = firebase.database().ref();
	var hash = window.location.hash.replace(/#/g, '');
	if (hash) {
	  ref = ref.child(hash);
	} else {
	  ref = ref.push(); // generate unique location.
	  window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
	}
	if (typeof console !== 'undefined') {
	  console.log('Data: ', ref.toString());
	}
	return ref;
  }