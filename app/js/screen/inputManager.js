var WebSocketManager = (function () {

	var that = {};
	var socketPort = 5000;
	var socketEndPoint = '/sg'
	var socket = null;
	var pin = null;

	var onIdentify = function () {
		console.log('Sending new screen request.');
		socket.emit(mp.NEWSCREEN);
	};

	var onScreenInfo = function (data) {
		// contains the pin to display
		console.log('Pin: ' + data);
		pin = data;
		// ready to render - call a callback or something

		//socket = io.connect('http://localhost:' + socketPort + socketEndPoint + '/' + pin);

		socket.on(mp.NEWPLAYER, function(data) {
			onNewplayer(data);
		});

		socket.on(mp.REMOVEPLAYER, function(data) {
			onRemoveplayer(data);
		});

		socket.on(mp.END, function () {
			onEnd();
		});

	};

	var onNewplayer = function (data) {
		console.log('new player: ' + data);
		Controllers.add(SocketController({
			'socket' : socket,
			'name' : data
		}));
	};

	var onRemoveplayer = function (data) {
		console.log('remove player: ' + data);
		Controllers.removeByName(data);
	};

	var onEnd = function () {
		console.log('game ended');
		Controllers.removeAll();
	};

	that.init = function () {
		socket = io.connect('http://localhost:' + socketPort + socketEndPoint);

		socket.on(mp.IDENTIFY, function() {
			onIdentify();
		});

		socket.on(mp.SCREENINFO, function(data) {
			onScreenInfo(data);
		});
	};

	that.dispose = function () {
		console.log('screen wants to end');
		socket.emit(mp.END);
		socket = null;
	};

	return that;

}());

var KeyboardManager = (function () {
	
	var that = {};

	var k1 = KeyboardController({
		PLAYER : 49,
		UP : 87,
		CCW : 65,
		CW : 68,
		ACTION : 83,
		name : 'p1'
	});

	var k2 = KeyboardController({
		PLAYER : 50,
		UP : 38,
		CCW : 37,
		CW : 39,
		ACTION : 40,
		name : 'p2'
	});
	
	that.init = function () {
		var t = that;
		document.onkeydown = function (e) {
			e = e ? e : window.event;
			k1.onDown(e.keyCode);
			k2.onDown(e.keyCode);
		};
		
		document.onkeyup = function (e) {
			e = e ? e : window.event;
			k1.onUp(e.keyCode);
			k2.onUp(e.keyCode);
		};

		Controllers.add(k1);
		Controllers.add(k2);

	};
	
	that.dispose = function () {
		Controllers.remove(k1);
		Controllers.remove(k2);
		document.onkeydown = null;
		document.onkeyup = null;
	};
	
	return that;
}());