
var Controllers = (function () {

	var that = {};
	var controllers = [];

	that.update = function() {
		for(var c in controllers) {
			controllers[c].update();
		}
	};

	that.add = function (c) {
		controllers.push(c);
	};

	that.remove = function (c) {
		var idx = controllers.indexOf(c);
		if(idx > -1) {
			controllers.splice(idx,1)[0];
		}
	};

	return that;

}());

var KeyboardController = function(spec) {

	var that = {};
	var context = null;
	var keyMap = [];
	var keySet = {};
	var a = 0;
	var name;

	var initKey = function (k) {
		keySet[k] = {};
		keySet[k].code = spec[k];
		keySet[k].pressed = false;
		keySet[k].onPressed = function() {};
		keySet[k].onReleased = function() {};
		keyMap[spec[k]] = k;
	};

	initKey('PLAYER');
	initKey('UP');
	initKey('CCW');
	initKey('CW');
	initKey('ACTION');
	name = spec.name || "";

	that.bind = function (player) {
		context = player;
		keySet['UP'].onPressed = player.thrustOn;
		keySet['UP'].onReleased = player.thrustOff;
		keySet['CCW'].onPressed = player.rotateCCW;
		keySet['CW'].onPressed = player.rotateCW;
		keySet['ACTION'].onPressed = player.fire;
		player.controller = that;
	};

	that.unbind = function (player) {
		context = null;
		keySet['UP'].onPressed = null;
		keySet['UP'].onReleased = null;
		keySet['CCW'].onPressed = null;
		keySet['CW'].onPressed = null;
		keySet['ACTION'].onPressed = null;
		player.controller = null;
	};

	that.update = function () {
		
		if(!context) {
			return;
		}

		for (var k in keySet) {
			
			if (keySet[k].pressed) {
				keySet[k].onPressed.call(keySet[k].context);
			} else {
				keySet[k].onReleased.call(keySet[k].context)
			}
		}
	};

	that.onDown = function (e) {
		if(!keySet[keyMap[e]]) {
			return;
		}
		keySet[keyMap[e]].pressed = true;
	}

	that.onUp = function (e) {
		if(!keySet[keyMap[e]]) {
			return;
		}

		if (keySet['PLAYER'].code === e) {
			if(context) {
				World.destroyPlayer(context);
			} else {
				console.log("New player request");
				World.createPlayer(that);
			}
		}

		keySet[keyMap[e]].pressed = false;
	}

	that.getName = function () {
		return name;
	};

	return that;
};
		