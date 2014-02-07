/*
InputManager.method('update', function () {
	var l = this.keyEvents.length - 1;
	
	for (var i = l; i >= 0; i--) {
		var keyEvent = this.keyEvents.splice(i,1)[0];
		this.fire('key',{ keyCode : keyEvent.keyCode, pressed : keyEvent.pressed });
	}
});
*/

var InputManager = (function () {
	
	var my = {};
	//makePublisher(my);
	
	var pressedKeys = [];
	
	my.keymap =  {
		p1 : {
			UP : 38,
			CCW : 37,
			CW : 39,
			ACTION : 32
		}
	};
	
	pressedKeys[my.keymap.p1.UP] = false;
	pressedKeys[my.keymap.p1.CCW] = false;
	pressedKeys[my.keymap.p1.CW] = false;
	pressedKeys[my.keymap.p1.ACTION] = false;
	
	my.init = function () {
		document.onkeydown = function (e) {
			e = e ? e : window.event;
			pressedKeys[e.keyCode] = true;
		};
		
		document.onkeyup = function (e) {
			e = e ? e : window.event;
			pressedKeys[e.keyCode] = false;
		};
	};
	
	my.getKeys = function () {
		return pressedKeys;
	};
	
	my.dispose = function () {
		document.onkeydown = null;
		document.onkeyup = null;
	};
	
	return my;
}());
		