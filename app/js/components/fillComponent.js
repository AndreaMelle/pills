/* Dynamic fill component */
/* No idea how to name it.
 * Models refillable quantities, such as 
 * lives, damage, shields, ammo
 */

 var C_DynamicFill = function (spec) {
 	var that = {};

 	var currFill = spec.initFill || 0;
 	var maxFill = spec.maxFill || Infinite;
 	var minFill = spec.minFill || 0;

 	that.increase = function (value) {
 		futureFill = currFill + value;
 		currFill = futureFill < maxFill ? futureFill : maxFill;
 	};

 	that.decrease = function (value) {
 		futureFill = currFill - value;
 		currFill = futureFill > minFill ? futureFill : minFill;
 	};

 	that.getCurrFill = function () {
 		return currFill;
 	};

 	return that;
 };


/* Life component */
var C_Life = function (spec) {

	var spec = {
		currFill : spec.lifeCounter,
		maxFill : spec.maxLives,
		minFill : 0
	};

	var that = {};
	var d  = Object.create(DynamicFillComponent(spec));

	that.addLife = function () {	
		d.increase(1);
	};

	that.removeLife = function () {
		d.decrease(1);
	};

	that.getLifeCount = function () {
		return d.getCurrFill();
	};

	return that;
};

/* Damage component */
var C_Damage = function (spec) {
	var that = Object.create(DynamicFillComponent(spec));
	return that;
};

/* Hit flag */
/*
 * Useful to keep track of a previous hit
 */
var C_HitFlag = function (spec) {
	var hit = false;
	var that = {};
	that.get = function () { return hit; }
	that.on = function () { hit = true; }
	that.off = function () { hit = false; }
};


