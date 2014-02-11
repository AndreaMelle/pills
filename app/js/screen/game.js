var Game = (function () {
	
	var my = {};
	
	var run = function () {

		Controllers.update();

		World.update();
		World.draw();
	};
	
	my.start = function () {
		GC.init();
		KeyboardManager.init();
		//WebSocketManager.init();
		World.init();
		setInterval(run, GC.intervalTime);
	};
	
	return my;
}());