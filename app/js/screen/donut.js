var Donut = function(spec) {
	var that = {};

	var px;
	var py;
	var dx;
	var dy;
	var rotation;
	var thrust;
	var stamina;
	var particle;
	var repulsion;
	var attraction;
	var constForce;
	var asset;
	var score = 0;
	var fireCounter = 0;
	that.controller = null;

	var radius = 27;
	var repulsionRadius = radius * 3;
	var repulsionStrength = 1.0;
	var attractionRadius = radius * 2;
	var attractionStrength = 0.5;
	var maxThrust = 0.03;
	var maxVelocity = 5; // not sure how to apply this in the physics lib
	var rotVelocity = 2 * Math.PI / 180;
	var maxStamina = 8;
	var fireDelay = 15; // @TODO: should be dependent on actual framerate

	that.respawn = function(_px, _py, color) {

		px = _px || 0;
		py = _py || 0;
		rotation = -Math.PI / 2;
		dx = Math.cos(rotation);
		dy = Math.sin(rotation);
		thrust = 0;
		fireCounter = 0;
		stamina = 1;//0;

		that.dispose();

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

	that.dispose = function () {
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
	};

	that.respawn(spec.x, spec.y, spec.color);
	asset = Assets.donut({ color : spec.color, radius : radius, 'maxStamina' : maxStamina });

	that.update = function() {
		
		dx = Math.cos(rotation);
		dy = Math.sin(rotation);

		if (thrust === 0) {
			//particle.clearFoce();
			constForce.setForce(new Vec2D(0,0));

		} else {
			constForce.setForce(new Vec2D(thrust * dx, thrust * dy));
		}

		px = particle.x;
		py = particle.y;

		fireCounter--;
	};

	var drawPhysicsDebug = function (ctx) {

		ctx.strokeStyle = "#0000FF";
		ctx.beginPath();
		ctx.arc(px, py, repulsionRadius, 0, 2 * Math.PI);
		ctx.stroke();
	};

	that.draw = function() {
		var ctx = GC.get();

		var text = stamina;

		asset.draw(ctx, px, py, dx, dy, rotation, text);

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

	that.fire = function () {

		if(stamina > 0 && fireCounter <= 0) {

			World.fireBullet(Bullet({
				'x' : px,
				'y' : py,
				'dx' : dx,
				'dy' : dy,
				'owner' : that,
				'color' : asset.color()
			}));

			that.removeStamina(1);
			fireCounter = fireDelay;
		}
	};

	that.addStamina = function (value) {
		if( stamina < maxStamina) {
			stamina += value;
			that.controller.on(mp.STAMINA, stamina);
		}
	};

	that.removeStamina = function (value) {
		if(value) {
			stamina -= value;
		} else {
			stamina = 0;
		}
		that.controller.on(mp.STAMINA, stamina);
	};

	that.getStamina = function () {
		return stamina;
	};

	that.getMaxStamina = function () {
		return maxStamina;
	};

	that.addScore = function (value) {
		score += value;
		that.controller.on(mp.SCORE, score);
	};

	that.getScore = function () {
		return score;
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
		return radius;
	};

	return that;
};