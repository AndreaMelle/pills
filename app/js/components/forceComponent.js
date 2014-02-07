/* Force component */
var C_Force = function(spec) {

	var that = {};
	var thrust = spec.thrust || 0;
	var friction = spec.friction || 0;
	var maxThrust = spec.maxThrust || 0;

	that.getThrust = function () {
		return thrust;
	};

	that.setThrust = function (value) {
		thrust = value;
	};

	that.getFriction = function () {
		return friction;
	};

	that.setFriction = function () {
		friction = value;
	};

	that.getMaxThrust = function () {
		return maxThrust;
	};

	that.setMaxThrust = function (value) {
		maxThrust = value;
	};

	return that;
};