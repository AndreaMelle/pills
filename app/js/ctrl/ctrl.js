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
		pin = p;
		name = n;
		console.log('new player: ' + pin + ' ' + name);

		socket = io.connect('http://localhost:' + socketPort + socketEndPoint);

		socket.on(mp.IDENTIFY, function() {
			onIdentify();
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

	};

	var onIdentify = function () {
		console.log('sending identification data');
		if(pin && name) {
			socket.emit(NEWPLAYER, {mp.PIN : pin, mp.NAME : name});
		}
	};

	that.onPlayerInfo = function (data) {
		// here the color is given
		console.log('player info: ' + data[mp.DATA]);
	};

	that.onStaminaUpdate = function (data) {
		// when the player picks up a pill
		console.log('stamina: ' + data[mp.DATA]);
	};

	that.onScoreUpdate = function (data) {
		// when the player scores
		console.log('score: ' + data[mp.DATA]);
	};

	that.onEnd = function () {
		// remote point has disconnected
		console.log('game ended');
	};

	that.ctrlFire = function () {
		console.log("fire");
		socket.emit(mp.COMMAND, {
			mp.NAME : name,
			mp.DATA : mp.FIRE
		});
	};

	that.ctrlLeft = function () {
		console.log("ccw");
		socket.emit(mp.COMMAND, {
			mp.NAME : name,
			mp.DATA : mp.CCW
		});
	};

	that.ctrlRight = function () {
		console.log("cw");
		socket.emit(mp.COMMAND, {
			mp.NAME : name,
			mp.DATA : mp.CW
		});
	};

	that.ctrlThrust = function () {
		console.log("thrust");
		socket.emit(mp.COMMAND, {
			mp.NAME : name,
			mp.DATA : mp.THRUST
		});
	};

	that.ctrlRemovePlayer = function () {
		console.log('player wants to end');
		socket.emit(mp.REMOVEPLAYER);
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

			$('#formContainer').remove();

			cb(pin, name);
 			return false;
		});
	};

	return that;

}());


window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	
	
	Login.handleForm(function(pin, name) {
		Ctrl.init(pin, name);	
	});
	

}