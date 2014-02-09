var Pill = function(spec) {
	var that = {};

	var px;
	var py;
	var stamina;
	var particle;
	var color;

	var width = 5;
	var height = 5;

	that.respawn = function(px, py, c, s) {

		px = px || 0;
		py = py || 0;
		thrust = 0;
		stamina = s || 0;
		color = c || "#000000";

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

	that.respawn(spec.x, spec.y, spec.color, spec.stamina);

	that.update = function() {
		px = particle.x;
		py = particle.y;
	};

	that.draw = function() {

		var r = width / 2.0;
		var ctx = GC.get();

		ctx.strokeStyle=color;
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.arc(px, py, r, 0, 2 * Math.PI);
		ctx.stroke();
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