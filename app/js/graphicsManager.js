var GC = (function () {
	
	var my = {};

	var _canvas;
	var context = null;
	var isInit = false;
	var width = 1200;
	var height = 1200 * 9 / 16;
	
	var lastFrameCount = 0;
	var dateTemp = new Date();
	var frameLast = dateTemp.getTime();
	var frameCtr = 0;
	
	var frameRate = 40;
	var intervalTime = 1000 / frameRate;
	
	my.countFrames = function () {
		var dateTemp = new Date();
		frameCtr++;
		
		if (dateTemp.getTime() >= frameLast + 1000) {
			//ConsoleLog.log("frame event");
			lastFrameCount = frameCtr;
			frameLast = dateTemp.getTime();
			frameCtr = 0;
		}
		return lastFrameCount;
	};
	
	my.left = function () {
		return 0;
	};
	
	my.right = function () {
		return width;
	};
	
	my.top = function () {
		return 0;
	};
	
	my.bottom = function () {
		return height;
	};

	my.width = function () {
		return width;
	};

	my.height = function () {
		return height;
	};

	my.intervalTime = function () {
		return intervalTime;
	};
	
	my.init = function () {
		_canvas = document.getElementById('canvas');
		if (!_canvas || !_canvas.getContext) {
			console.log('No canvas found.');
			return null;
		}

		_canvas.width = width;
		_canvas.height = height;
	
		context = _canvas.getContext("2d");
	
		if (!context) {
			console.log('No context found.');
			return null;
		}
		
		console.log('Canvas context found.');
		
		isInit = true;
		return context;
	};
	
	my.get = function () {
		if (isInit) {
			return context;
		} else {
			return null;
		}
	};
	
	return my;

}());