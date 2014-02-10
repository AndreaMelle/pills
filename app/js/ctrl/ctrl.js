
var Ctrl = (function () {
	var that = {};

	that.init = function () {

	};

	that.onFire = function () {
		console.log("fire")
	};

	that.onLeft = function () {
		console.log("left")
	};

	that.onRight = function () {
		console.log("right")
	};

	that.onThrust = function () {
		console.log("thrust")
	};

	return that;
}());


window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	
	Ctrl.init();

}