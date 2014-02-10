var Pill = function(spec) {
	var that = {};

	var px;
	var py;
	var stamina;
	var particle;
	var radius = 8;

	that.respawn = function(_px, _py, s) {

		px = _px || 0;
		py = _py || 0;
		stamina = s || 0;

		if (particle) {
			World.P().removeParticle(particle);
		}

		particle = new VerletParticle2D(px, py);
		particle.tag = "pill";

		World.P().addParticle(particle);
	};

	that.dispose = function() {
		if (particle) {
			World.P().removeParticle(particle);
		}
	};

	that.respawn(spec.x, spec.y, spec.stamina);

	that.update = function() {
		px = particle.x;
		py = particle.y;
	};

	that.draw = function() {
		var ctx = GC.get();
		Assets.pill.draw(ctx, px, py);
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
		return radius;
	};

	return that;
};