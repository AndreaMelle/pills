/* Render manager
 *
 * Handle creation and management of graphics context,
 * double buffering, time intervals, etc.
 * Different from render system, which does the actual drawings
 */

 var renderSpec = {
 	minX : 0,
 	maxX : 800,
 	minY : 0,
 	maxY : 600,
 	framerate : 40,
 	renderSpriteBox : true,
 	renderCollisionProxy : true,
 	renderSprite : true
 };

var M_Render = (function (spec) {
	var that = {};

	var _canvas = null;
	var context = null;

	var xMin = spec.minX || 0;
	var xMax = spec.maxX || 0;
	var yMin = spec.minY || 0;
	var yMax = spec.maxY || 0;

	var renderSpriteBox = spec.renderSpriteBox || false;
 	var renderCollisionProxy = spec.renderCollisionProxy || false;
 	var renderSprite = spec.renderSprite || false;

	var lastFrameCount = 0;
	var dateTemp = new Date();
	var frameLast = dateTemp.getTime();
	var frameCtr = 0;
	var framerate = spec.framerate || 0;
	var intervalTime = 1000 / my.framerate;
	
	my.init = function () {
		_canvas = document.getElementById('canvas');
		if (!_canvas || !_canvas.getContext) {
			console.log('No canvas found.');
			return null;
		}
	
		context = _canvas.getContext("2d");
	
		if (!context) {
			console.log('No context found.');
			return null;
		}
		
		console.log('Canvas context initialized.');
		
		return context;
	};
	
	my.getCtx = function () {
		return ( context ? context : throw(new Error('No context found.')) );
	};
	
	my.getFrameCount = function () {
		var dateTemp = new Date();
		frameCtr++;
		
		if (dateTemp.getTime() >= frameLast + 1000) {
			lastFrameCount = frameCtr;
			frameLast = dateTemp.getTime();
			frameCtr = 0;
		}
		
		return lastFrameCount;
	};

	my.xMin = function () {
		return xMin;
	};
	
	my.xMax = function () {
		return xMax;
	};
	
	my.yMin = function () {
		return yMin;
	};
	
	my.yMax = function () {
		return yMax;
	};

	return that;
	
}(renderSpec));



