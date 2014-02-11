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
			controllers.splice(idx,1)[0].dispose();
		}
	};

	that.getByName = function (name) {
		for (var c in controllers) {
			if(controllers[c].getName() === name) {
				return controllers[c];
			}
		}
	};

	that.removeByName = function (name) {
		for (var c in controllers) {
			if(controllers[c].getName() === name) {
				var ctrl = controllers.splice(c,1)[0];
				ctrl.dispose();
				ctrl = null;
			}
		}
	};

	that.removeAll = function (name) {
		for (var c in controllers) {
			that.remove(controllers[c]);
		}
		controllers = [];
	};

	return that;

}());

var SocketController = function(spec) {
	var that = {};
	var socket = spec.socket || null;
	var name = spec.name || null;
	var player = null;

	var commands = {
		'thrust' : false,
		'ccw' : false,
		'cw' : false,
		'fire' : false
	};

	that.update = function () {
		if(commands['thrust']) {
			player.thrustOn();
		} else {
			player.thrustOff();
		}

		if(commands['ccw']) {
			player.rotateCCW();
		}

		if(commands['cw']) {
			player.rotateCW();
		}

		if(commands['fire']) {
			player.fire();
			commands['fire'] = false;
			// @NOTE: currently we don't allow continous firing
			// you gotta press the button again to fire again
		}

	};

	that.bind = function (p) {
		p.controller = that;
		player = p;
	};

	that.unbind = function (p) {
		p.controller = null;
		player = null;
	};

	that.getName = function () {
		return name;
	};

	that.dispose = function () {
		if (player) {
			World.destroyPlayer(player);
		}
	};

	that.on = function(evt, data) {
		var out = {};
		out[mp.NAME] = name;
		out[mp.DATA] = data;

		if (evt === mp.PLAYERINFO) {
			socket.emit(mp.PLAYERINFO, out);
		} else if (evt === mp.STAMINA) {
			socket.emit(mp.STAMINA, out);
		} else if (evt === mp.SCORE) {
			socket.emit(mp.SCORE, out);
		}
	};

	socket.on(mp.COMMAND, function(data) {
		if(data[mp.NAME] === name) {
			var val = data[mp.DATA];

			if(val === mp.THRUSTON) {
				commands['thrust'] = true;
			} else if(val === mp.THRUSTOFF) {
				commands['thrust'] = false;
			} else if(val === mp.CCWON) {
				commands['ccw'] = true;
			} else if(val === mp.CCWOFF) {
				commands['ccw'] = false;
			} else if(val === mp.CWON) {
				commands['cw'] = true;
			} else if(val === mp.CWOFF) {
				commands['cw'] = false;
			}  
			else if(val === mp.FIRE) {
				commands['fire'] = true;
			}

			return false; // event used
		}
		return true; // pass on
	});

	World.createPlayer(that);

	return that;
};

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

	that.dispose = function () {

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
		