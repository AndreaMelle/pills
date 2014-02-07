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