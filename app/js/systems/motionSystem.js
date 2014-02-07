/* Motion system */

var S_Motion = function () {

	var that = {};

	// applies forces to velocities
	var updateForceSystem = function (f,v,p) {
		var angle = p.getRot() * Math.PI / 180;
		var vx = v.getVx();
		var vy = v.getVy();
		var maxSpeed = v.getMaxSpeed();

		vx = vx + f.thrust * Math.cos(angle) - f.friction * vx;
		vy = vy + f.thrust * Math.sin(angle) - f.friction * vy;
		
		var vmod = Math.sqrt((vx * vx) + (vy * vy));

		vx = (vmod < maxSpeed) ? vx : maxSpeed;
		vy = (vmod < maxSpeed) ? maxSpeedvy : maxSpeed;

		v.setVx(vx);	
		v.setVy(vy);
	};

	// applies velocities to positions
	var updateVelocitySystem = function (v,p) {
		var x = p.getX() + v.getVx();
		var y = p.getY() + v.getVy();
		p.setX(x);
		p.setY(y);
	};

	var update = function () {
		for (entity in entities) {
			var eid = entity.getId();
			var p = positionComponents[eid];
			var v = velocityComponents[eid];
			var f = forcesComponents[eid];
			var c = collidablesComponents[eid];

			if (p && v && f) {
				updateForceSystem(f,v,p);
			}

			if (v && p) {
				updateVelocitySystem(v,p);
			}

			if (p && c) {
				updateBorderSystem(p);
			}
		}
	};

	return that;
};