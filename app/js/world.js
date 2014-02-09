var DEBUG = false;

var World = (function () {

	var my = {};
	var Coll = {};
	
	var worldBox;
	var donuts = new Array();
	var pills = new Array();	
	var physics;
	var newPills;

	var colors = [];
	colors.push("#FF0000");
	colors.push("#00FF00");
	var next = 0;
	var radius = 20;

	var spanPills = function (num) {
		for(var i = 0; i < num; i++) {
			var px = (Math.random() * worldBox.width) + worldBox.x;
			var py = (Math.random() * worldBox.height) + worldBox.y;
			pills.push(new Pill({
				x : px,
				y : py,
				color: "#FF00FF",
				stamina : 1
			}));
		}
	};

	
	my.init = function () {
		worldBox = new Rect(
			GC.left() + 10,
			GC.top() + 10,
			GC.width() - 20,
			GC.height() - 20
		);
		physics = new VerletPhysics2D();
		physics.setDrag(0.01);
		physics.setWorldBounds(worldBox);

		
		for(var i = 0; i < worldBox.width; i++) {
			World.P().addBehavior(
				new AttractionBehavior(new Vec2D(i * radius, worldBox.y), radius, -1.2));
			World.P().addBehavior(
				new AttractionBehavior(new Vec2D(i * radius, worldBox.y + worldBox.height), radius, -1.2));
		}

		for(var i = 0; i < worldBox.height; i++) {
			World.P().addBehavior(
				new AttractionBehavior(new Vec2D(worldBox.x, i * radius), radius, -1.2));
			World.P().addBehavior(
				new AttractionBehavior(new Vec2D(worldBox.x + worldBox.width, i * radius), radius, -1.2));
		}

		newPills = 5;
		spanPills(newPills);

	};
	
	my.update = function () {
		
		physics.update();

		Coll.checkCollisions();

		for (var d in donuts) {
			donuts[d].update();
		}

		for (var p in pills) {
			pills[p].update();
		}

	};

	var drawPhysicsDebug = function (ctx) {

		ctx.strokeStyle = "#0000FF";
		ctx.strokeRect(worldBox.x,worldBox.y,worldBox.width,worldBox.height);


		for(var i = 0; i < worldBox.width; i++) {

			ctx.beginPath();
			ctx.arc(i * radius, worldBox.y, radius, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(i * radius, worldBox.y + worldBox.height, radius, 0, 2 * Math.PI);
			ctx.stroke();
		}

		for(var i = 0; i < worldBox.height; i++) {

			ctx.beginPath();
			ctx.arc(worldBox.x, i * radius, radius, 0, 2 * Math.PI);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(worldBox.x + worldBox.width, i * radius, radius, 0, 2 * Math.PI);
			ctx.stroke();
			
		}
	};
	
	my.draw = function () {
		var ctx = GC.get();
		ctx.clearRect(0,0,GC.width(),GC.height());
		ctx.strokeStyle = "#000000";
		ctx.strokeRect(0,0,GC.width(),GC.height());

		for (var d in donuts) {
			donuts[d].draw();
		}

		for (var p in pills) {
			pills[p].draw();
		}
		if (DEBUG) {
			drawPhysicsDebug(ctx);
		}
	};

	my.createPlayer = function (controller) {
		var d = new Donut({
			x : worldBox.width / 2.0,
			y : worldBox.height / 2.0,
			color : colors[next % colors.length]
		});
		next+=1;
		controller.bind(d);
		donuts.push(d);
	};

	my.destroyPlayer = function (player) {
		var idx = donuts.indexOf(player);
		if(idx > -1) {
			var d = donuts.splice(idx,1)[0];
			d.controller.unbind(d);
			d = null;
		}
	};

	my.P = function () {
		return physics;
	};

	my.getWorldBox = function () {
		return worldBox;
	};

	Coll.ccd = function (d, p) {
		// @TODO: this is not conisdering that the donut is also moving high speed, but it's a start
		var m = Math.orthoLine(p.x(), p.y(), p.fx(), p.fy());
		var i = d.y();
		if(m) {
			i -= m * d.x();
		}

		var intersect = Math.intersectLines(
			p.x(), p.y(), p.fx(), p.fy(),
			d.x(), d.y(), 0, i);

		if(!intersect) {
			return false;
		}

		var distsq = (d.x() - intersect.x)*(d.x() - intersect.x) + (d.y() - intersect.y)*(d.y() - intersect.y);

		if (distsq <= d.r()) {
			return true;
		}

		return false;

	};

	Coll.handleCollision = function (d, p, j) {
		d.addStamina(p.getStamina());
		pills.splice(j,1)[0].dispose();
		console.log("stamina: " + d.getStamina());
		newPills++;
	};

	Coll.checkCollisions = function () {

		// @TODO: need to implement coarse grid-based optimization
		// @TODO: it might be actually cool without CCD

		var l_donuts = donuts.length;
		var l_pills = pills.length;
		newPills = 0;

		for(var i = l_donuts-1; i >= 0; i--) {
			for (var j = l_pills-1; j >= 0; j--) {
				var d = donuts[i];
				var p = pills[j];

				var distsq = (d.x() - p.x())*(d.x() - p.x()) + (d.y() - p.y())*(d.y() - p.y());
				var sumr = (d.r() + p.r()) * (d.r() + p.r());

				if ( distsq <= sumr ) {//|| Coll.ccd(d,p) ) {
					Coll.handleCollision(d, p, j);
				}
			}
		}

		spanPills(newPills);

	};
	
	return my;

} ());