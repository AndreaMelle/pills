var WebSocketManager = (function () {

	var that = {};

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
		name : 'player1'
	});

	var k2 = KeyboardController({
		PLAYER : 50,
		UP : 38,
		CCW : 37,
		CW : 39,
		ACTION : 40,
		name : 'player2'
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