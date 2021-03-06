// @TODO: form validation
// @TODO check connection before sending out commands

var Ctrl = (function () {
	var that = {};
	var pin;
	var name;
	var socketPort = 5000;
	var socketEndPoint = '/sg'
	var socket = null;

	that.init = function (p, n) {

		View.wait();

		pin = p;
		name = n;
		console.log('new player: ' + pin + ' ' + name);

		//socket = io.connect('http://localhost:' + socketPort + socketEndPoint + '/' + pin);
		socket = io.connect(socketEndPoint + '/' + pin);

		socket.on(mp.IDENTIFY, function() {
			onIdentify();
		});

		socket.on(mp.NEWPLAYER, function (data) {
			onNewPlayer(data);
		});

		socket.on(mp.PLAYERINFO, function(data) {
			that.onPlayerInfo(data);
		});

		socket.on(mp.STAMINA, function(data) {
			that.onStaminaUpdate(data);
		});

		socket.on(mp.SCORE, function (data) {
			that.onScoreUpdate(data);
		});

		socket.on(mp.END, function () {
			that.onEnd();
		});

		socket.on(mp.ERROR, function (data) {
			onErr(data);
		});

	};

	that.dispose = function () {
		if(socket) {
			that.ctrlRemovePlayer();
		}
	}

	var onNewPlayer = function (data) {
		console.log("actual name: " + data);
		name = data;
		View.showControls();
		View.updateName(name);
	};

	var onIdentify = function () {
		console.log('sending identification data');
		if(pin && name) {
			var out = {};
			out[mp.PIN] = pin;
			out[mp.NAME] = name;
			socket.emit(mp.NEWPLAYER, out);
		}
	};

	var onErr = function (data) {
		if(data == mp.NAME) {
			View.errName();
			socket = null;
		}
	};

	var sendCommand = function (command) {
		var out = {};
		out[mp.NAME] = name;
		out[mp.DATA] = command;
		socket.emit(mp.COMMAND, out);
	};

	that.onPlayerInfo = function (data) {
		// here the color is given
		console.log('player info: ' + data[mp.DATA]);
		View.updateColor(data[mp.DATA]);
	};

	that.onStaminaUpdate = function (data) {
		// when the player picks up a pill
		console.log('stamina: ' + data[mp.DATA]);
	};

	that.onScoreUpdate = function (data) {
		// when the player scores
		console.log('score: ' + data[mp.DATA]);
		View.updateScore(data[mp.DATA]);
	};

	that.onEnd = function () {
		// remote point has disconnected
		console.log('game ended');
	};

	that.ctrlFire = function () {
		console.log("fire");
		sendCommand(mp.FIRE);
	};

	that.ctrlLeft = function () {
		console.log("ccw");
		sendCommand(mp.CCW);
	};

	that.ctrlRight = function () {
		console.log("cw");
		sendCommand(mp.CW);
	};

	that.ctrlLeftOn = function () {
		console.log("ccw on");
		sendCommand(mp.CCWON);
	};

	that.ctrlRightOn = function () {
		console.log("cw on");
		sendCommand(mp.CWON);
	};

	that.ctrlLeftOff = function () {
		console.log("ccw off");
		sendCommand(mp.CCWOFF);
	};

	that.ctrlRightOff = function () {
		console.log("cw off");
		sendCommand(mp.CWOFF);
	};

	that.ctrlThrustOn = function () {
		console.log("thrust on");
		sendCommand(mp.THRUSTON);
	};

	that.ctrlThrustOff = function () {
		console.log("thrust off");
		sendCommand(mp.THRUSTOFF);
	};

	that.ctrlRemovePlayer = function () {
		console.log('player wants to end');
		socket.emit(mp.REMOVEPLAYER, name);
	};



	return that;
}());

var View = (function() {

	var that = {};

	that.init = function () {
		$('#fireButton').on('touchstart', function() { Ctrl.ctrlFire() });
		//$('#fireButton').addEventListener( 'touchend', onTouchEnd, false );

		$('#thrustButton').on('touchstart', function() { Ctrl.ctrlThrustOn() });
		$('#thrustButton').on('touchend', function() { Ctrl.ctrlThrustOff() });

		$('#leftButton').on('touchstart', function() { Ctrl.ctrlLeftOn() });
		$('#leftButton').on('touchend', function() { Ctrl.ctrlLeftOff() });

		$('#rightButton').on('touchstart', function() { Ctrl.ctrlRightOn() });
		$('#rightButton').on('touchend', function() { Ctrl.ctrlRightOff() });

		/*
		$('#fireButton').on('click', function () { Ctrl.ctrlFire(); });
		//$('#fireButton').addEventListener( 'touchend', onTouchEnd, false );
		$('#thrustButton').on('click', function () { Ctrl.ctrlThrustOn(); });
		$('#thrustButton').on('click', function () { Ctrl.ctrlThrustOff(); });
		$('#leftButton').on('click', function () { Ctrl.ctrlLeft(); });
		$('#rightButton').on('click', function () { Ctrl.ctrlRight(); });
		*/
	};

	that.updateName = function (name) {
		$('#displayName').text(name);
		$(document).attr('title', name);
	};

	that.updateScore = function (score) {
		$('#displayScore').text(score);
	};

	that.updateColor = function (color) {
		$('#fireButton').css('background-color', color);
		$('#fireButton').css('border-color', color);
	};

	that.wait = function () {
		$('#waitContainer').show();
	};

	that.showControls = function () {
		$('#waitContainer').hide();
		$('#controllerContainer').show();
	};

	that.errName = function () {
		$('#waitContainer').hide();
		$('#controllerContainer').hide();
		$('#formContainer').show();
		$('#displayError').text('Player name already in use');
		$('#displayError').show();
	};

	that.errEmpty = function (what) {
		$('#waitContainer').hide();
		$('#controllerContainer').hide();
		$('#formContainer').show();
		$('#displayError').text('Missing ' + what);
		$('#displayError').show();
	};

	that.errTouch = function () {
		$('#waitContainer').hide();
		$('#controllerContainer').hide();
		$('#formContainer').hide();
		$('#displayNoTouch').show();
	};

	return that;

}());

var Login = (function() {

	var that = {};

	that.handleForm = function (cb) {
		$('#newplayer').submit(function (event) {

			var pin = $('#pin').val();
			var name = $('#name').val();
			event.preventDefault();

			if(pin && name) {
				$('#formContainer').hide();
				$('#waitContainer').show();
				$('#displayError').hide();
				cb(pin, name);
			} else {
				if(!pin) {
					View.errEmpty('pin');
				} else {
					View.errEmpty('name');
				}
			}
 			return false;
		});
	};

	return that;

}());

window.addEventListener('unload', eventWindowUnloaded, false);
window.addEventListener('pagehide', eventWindowUnloaded, false);
window.addEventListener('load', eventWindowLoaded, false);

function eventWindowUnloaded() {
	Ctrl.dispose();
}

function eventWindowLoaded() {
	var touchable =  !!('ontouchstart' in window);

	//$('#formContainer').remove();
	$('#displayNoTouch').hide();
	$('#waitContainer').hide();
	$('#controllerContainer').hide();
	$('#formContainer').hide();
	$('#displayError').hide();

	if (!touchable) {
		View.errTouch();
	} else {
		$('#formContainer').show();

		Login.handleForm(function(pin, name) {
			View.init();
			Ctrl.init(pin, name);
		});
	}
}