/* Velocity component */
var C_Velocity = function(spec) {

	var that = {};
	var vx = spec.vx || 0;
	var vy = spec.vy || 0;
	var vrot = spec.vrot || 0;
	var maxSpeed = spec.maxSpeed || Infinity;
	
	// Returns the module of velocity vector
	that.getSpeed = function () {
		return Math.sqrt(vx*vx + vy*vy);
	};

	that.getMaxSpeed = function () {
		return maxSpeed;
	}:

	that.getVx = function () {
		return vx;
	};

	that.setVx = function (value) {
		vx = value;
	};

	that.getVy = function () {
		return vy;
	};

	that.setVy = function () {
		vy = value;
	};

	that.getVrot = function () {
		return Vrot;
	};

	that.setVrot = function (value) {
		Vrot = value;
	};

	return that;
};