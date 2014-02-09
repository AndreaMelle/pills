/* consoleLog singleton */
var ConsoleLog = (function () {

	var my = {}
	
	my.log = function (message) {
		if(typeof(console) !== 'undefined' && console != null) {
			console.log(message);
		}
	};
	
	return my;

}());

/* Base game object */
/*
var gameComponent = function () {
	this.toDispose = false;
};

gameComponent.method('init', function () {});
gameComponent.method('update', function () {});
gameComponent.method('reset', function () {});
gameComponent.method('dispose', function () {});
gameComponent.method('setToDispose', function (value) {
	this.toDispose = value;
});
gameComponent.method('getToDispose', function (value) {
	return this.toDispose;
});
*/




