var Donut = function(spec) {
	var that = {};

	var px;
	var py;
	var rotation;
	var thrust;
	var stamina;
	var particle;
	var repulsion;
	var attraction;
	var constForce;
	var color;

	var repulsionRadius = 50;
	var repulsionStrength = 1.0;
	var attractionRadius = 40;
	var attractionStrength = 0.5;
	var width = 20;
	var height = 20;
	var maxThrust = 0.03;
	var maxVelocity = 5; // not sure how to apply this in the physics lib
	var rotVelocity = 2 * Math.PI / 180;

	that.respawn = function(px, py, c) {

		px = px || 0;
		py = py || 0;
		rotation = 0;
		thrust = 0;
		stamina = 0;
		color = c || "#000000";

		if (repulsion) {
			World.P().removeBehavior(repulsion);
		}

		if (attraction) {
			World.P().removeBehavior(attraction);
		}

		if (particle) {
			if (constForce) {
				particle.removeBehavior(constForce);			
			}
			World.P().removeParticle(particle);
		}

		particle = new VerletParticle2D(px, py);
		particle.tag = "donut";
		repulsion = new AttractionBehavior(particle, repulsionRadius, -repulsionStrength);
		attraction = new AttractionBehavior(particle, attractionRadius, attractionStrength);
		constForce = new ConstantForceBehavior(new Vec2D(0,0));

		repulsion.addAffects("donut");
		attraction.addAffects("pill");

		particle.addBehavior(constForce);
		World.P().addParticle(particle);
		World.P().addBehavior(repulsion);
		World.P().addBehavior(attraction);

	};

	that.respawn(spec.x, spec.y, spec.color);

	that.update = function() {

		if (thrust === 0) {
			//particle.clearFoce();
			constForce.setForce(new Vec2D(0,0));

		} else {
			var fx = thrust * Math.cos(rotation);
			var fy = thrust * Math.sin(rotation);
			constForce.setForce(new Vec2D(fx, fy));
		}

		px = particle.x;
		py = particle.y;

	};

	var drawPhysicsDebug = function (ctx) {

		ctx.strokeStyle = "#0000FF";
		ctx.beginPath();
		ctx.arc(px, py, repulsionRadius, 0, 2 * Math.PI);
		ctx.stroke();
	};

	that.draw = function() {

		var r = width / 2.0;
		var ctx = GC.get();

		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(px, py, r, 0, 2 * Math.PI);
		ctx.stroke();

		var dx = r * Math.cos(rotation);
		var dy = r * Math.sin(rotation);

		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + dx, py + dy);
		ctx.stroke();
		ctx.closePath();

		if (DEBUG) {
			drawPhysicsDebug(ctx);
		}

	};

	that.thrustOn = function() {
		thrust = maxThrust;
	};

	that.thrustOff = function() {
		thrust = 0;
	};

	that.rotateCCW = function () {
		rotation -= rotVelocity;
	};

	that.rotateCW = function () {
		rotation += rotVelocity;
	};

	that.addStamina = function (value) {
		stamina += value;
	};

	that.removeStamina = function (value) {
		if(value) {
			stamina -= value;
		} else {
			stamina = 0;
		}
	};

	that.getStamina = function () {
		return stamina;
	};

	that.x = function () {
		return px;
	};

	that.y = function () {
		return py;
	};

	that.fx = function () {
		return particle.x;
	};

	that.fy = function () {
		return particle.y;
	};

	that.r = function () {
		return width / 2.0;
	};

	return that;
};