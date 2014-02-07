/*********************/
/* Collision Manager */
/*********************/

//A classic collision manager, which uses 'collidable' objects as inputs
// and check their bounding boxes.
// Events are fired on collision, returning the objects which collided

var CollisionEvent = {
	obj1 : null,
	obj2 : null
};

var Collidable = {
	x : 0,
	y : 0,
	width : 0,
	height : 0
};

function makeCollidable(o) {
	var i;
	for (i in Collidable) {
		if (Collidable.hasOwnProperty(i) && typeof Collidable[i] === "function") {
			o[i] = Collidable[i];
		}
	}
}

var CollisionManager = (function () {

	var my = {};
	my.prototype = new gameComponent();
	
	makePublisher(my);
	
	var events = new Array();
	var collidables = new Array();
	
	my.init = function () {
		
	};
	
	my.update = function () {
		
		for (var i = 0; i < collidables.length; i++) {
			for (var j = 1; j < collidables.length; j++) {
				
				if (collidables[i] !== collidables[j]) {
					if (boundingBoxCollide(collidables[i],collidables[j])) {
						events.push({obj1 : collidables[i], obj2 : collidables[j]});
					}
				}
			}
		}
		
		// risolve overlapping (?)
		// we don't fire as soon as the collision is detected, but we wait to collect all collisions
		// this allows us to implement a more complex collision solver in the future
		
		// fire events to listeners
		l = events.length-1;
		for (var i = l; i >= 0; i--) {
			CollisionManager.fire('collision',events.splice(i,1)[0]);
		}
		
	};
	
	my.reset = function () {
		events = new Array();
		collidables = new Array();
	};
	
	my.dispose = function () {
		reset();
	};
	
	my.addCollidable = function (c) {
		collidables.push(c);
	};
	
	my.removeCollidable = function (c) {
		for (i = 0; i < collidables.length; i++) {
			if (collidables[i] === c) {
				collidables.splice(i, 1);
				break;
			}
		}
	};
	
	return my;

} ());
