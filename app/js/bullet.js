var Bullet = function(spec) {
	var that = {};

	var px;
	var py;
	var dx;
	var dy;
	var fx;
	var fy;
	var owner;
	var asset;

	var speed = 5;

	that.respawn = function(_px, _py, _dx, _dy, ow, c) {
		px = _px || 0;
		py = _py || 0;
		dx = _dx || 0;
		dy = _dy || 0;
		asset = Assets.bullet({
			color : c
		})
		owner = ow;
		fx = px;
		fy = py;
	};

	that.dispose = function() {
		owner = null;
	};

	that.respawn(spec.x, spec.y, spec.dx, spec.dy, spec.owner, spec.color);

	that.update = function() {
		// cache old position for ccd
		fx = px;
		fy = py;

		// assume direction normalized already
		px = px + speed * dx;
		py = py + speed * dy;

	};

	that.draw = function() {
		var ctx = GC.get();
		asset.draw(ctx, px, py);
	};

	that.x = function () {
		return px;
	};

	that.y = function () {
		return py;
	};

	that.fx = function () {
		return fx;
	};

	that.fy = function () {
		return fy;
	};

	that.r = function () {
		return width / 2.0;
	};

	that.owner = function () {
		return owner;
	};

	return that;
};