var DEBUG = false;

var World = (function () {

	var my = {};
	var Coll = {};
	
	var worldBox;
	var donuts = new Array();
	var pills = new Array();
	var bullets = new Array();	
	var physics;
	var newPills;

	var next = 0;
	var radius = 35;
	var maxNumPlayers = 5;

	var KILLSCORE = 100;
	var PILLSCORE = 1;

	var spanPills = function (num) {
		for(var i = 0; i < num; i++) {
			var px = (Math.random() * worldBox.width) + worldBox.x;
			var py = (Math.random() * worldBox.height) + worldBox.y;
			pills.push(new Pill({
				x : px,
				y : py,
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

		for (var b in bullets) {
			bullets[b].update();
		}

		for (var d in donuts) {
			donuts[d].update();
		}

		
		for (var p in pills) {
			pills[p].update();
		}

	};

	
	
	my.draw = function () {
		var ctx = GC.get();

		Assets.background.draw(ctx);

		for (var p in pills) {
			pills[p].draw();
		}

		for (var b in bullets) {
			bullets[b].draw();
		}

		for (var d in donuts) {
			donuts[d].draw();
		}

		if (donuts.length <= 0) {
			Assets.welcome.drawSocket(ctx);
		}

		Assets.leaderboard.draw(ctx, donuts);
	};

	my.createPlayer = function (controller) {
		if(donuts.length < maxNumPlayers) {
			var c = Assets.playerColors[next % Assets.playerColors.length];
			var d = new Donut({
				x : worldBox.width / 2.0,
				y : worldBox.height / 2.0,
				color : c
			});
			next+=1;
			controller.bind(d);
			donuts.push(d);
			controller.on(mp.PLAYERINFO, c);
			return true;
		} else {
			console.log('Maxium number of players reached');
			return false;
		}
	};

	my.destroyPlayer = function (player) {
		var idx = donuts.indexOf(player);
		if(idx > -1) {
			var d = donuts.splice(idx,1)[0];
			var c = d.controller;
			d.dispose();
			c.unbind(d);
			c = null;
			d = null;
		}
	};

	my.fireBullet = function (bullet) {
		bullets.push(bullet);
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

	Coll.bulletCCD = function (d, b) {

		// bbox for rought check
		var box = {};
		box.xmin = Math.min(d.x() - d.r(), d.fx() - d.r());
		box.ymin = Math.min(d.y() - d.r(), d.fy() - d.r());
		box.xmax = Math.max(d.x() + d.r(), d.fx() + d.r());
		box.ymax = Math.max(d.y() + d.r(), d.fy() + d.r());

		var p0 = {x : b.x(), y : b.y()};
		var p1 = {x : b.fx(), y : b.fy()};
		var same = false;

		if(p0.x === p1.x && p0.y === p1.y) {
			same = true;
			return false;
		}

		if(same) {
			result = Math.checkPointBoxIntersect(p0, box);
		} else {
			result = Math.checkLineBoxIntersect(p0, p1, box);
		}

		if (!result.accept) {
			return false;
		}

		// rotated bbox
		var rot = Math.getRotFromTwoPoints({x : d.x(), y : d.y()}, {x : d.fx(), y : d.fy()});
		var c0 = Math.rotate(d.x(), d.y(), rot);
		var c1 = Math.rotate(d.fx(), d.fy(), rot);
			p0 = Math.rotate(b.x(), b.y(), rot);
			p1 = Math.rotate(b.fx(), b.fy(), rot);

		box.xmin = Math.min(c0.x - d.r(), c1.x - d.r());
		box.ymin = Math.min(c0.y - d.r(), c1.y - d.r());
		box.xmax = Math.max(c0.x + d.r(), c1.x + d.r());
		box.ymax = Math.max(c0.y + d.r(), c1.y + d.r());

		// intersect
		if(same) {
			result = Math.checkPointBoxIntersect(p0, box);
		} else {
			result = Math.checkLineBoxIntersect(p0, p1, box);
		}

		if (!result.accept) {
			return false;
		}

		if( p0.x < c0.x && p1.x < c0.x ) {
			if(!same) {
				return Math.checkLineCircleIntersect(p0, p1, c0, d.r());
			} else {
				return Math.checkPointCircleIntersect(p0, c0, d.r());
			}
		} else if( p0.x > c1.x && p1.x > c1.x ) {
			if(!same) {
				return Math.checkLineCircleIntersect(p0, p1, c1, d.r());
			} else {
				return Math.checkPointCircleIntersect(p0, c1, d.r());	
			}
		} else {
			return true;
		}

	};

	Coll.checkBullets = function () {
		var l_bullets = bullets.length - 1;
		for (var i = l_bullets; i >= 0; i--) {

			var b = bullets[i];

			if( b.x() < worldBox.x ||
				b.x() > worldBox.x + worldBox.width ||
				b.y() < worldBox.y ||
				b.y() > worldBox.y + worldBox.height ) {

				bullets.splice(i,1)[0].dispose();
			} else {

				for (var j in donuts) {
					var d = donuts[j];
					if(b.owner() !== d) {
						if( Coll.bulletCCD(d, b) ) {
							b.owner().addScore(KILLSCORE);
							bullets.splice(i,1)[0].dispose();
							d.respawn(worldBox.width / 2.0, worldBox.height / 2.0);
							break;
						}
					}
				}
			}

		}
	};

	Coll.checkCollisions = function () {

		Coll.checkBullets();

		// @TODO: need to implement coarse grid-based optimization
		// @TODO: it might be actually cool without CCD

		var l_donuts = donuts.length - 1;
		newPills = 0;

		for(var i = l_donuts; i >= 0; i--) {
			var d = donuts[i];
			var l_pills = pills.length - 1;
			for (var j = l_pills; j >= 0; j--) {

				var p = pills[j];

				var distsq = (d.x() - p.x())*(d.x() - p.x()) + (d.y() - p.y())*(d.y() - p.y());
				var sumr = (d.r() + p.r()) * (d.r() + p.r());

				if ( distsq <= sumr ) {//|| Coll.ccd(d,p) ) {
					d.addStamina(p.getStamina());
					d.addScore(PILLSCORE);
					pills.splice(j,1)[0].dispose();
					newPills++;
				}
			}
		}

		spanPills(newPills);

	};
	
	return my;

} ());