/**********/
/* Saucer */
/**********/

var Saucer = function () {
	this.isDead = false;
	this.width = 28;
	this.height = 13;
	this.halfHeight = 6.5;
	this.halfWidth = 14;
	this.fireDelayCount = 0;
	this.hasFired = false;
};

Saucer.prototype = new gameComponent();
makeCollidable(Saucer);

Saucer.method('init', function (score, speed, fireRate, fireDelay, missileSpeed) {
	this.score = score;
	this.speed = speed;
	this.fireRate = fireRate;
	this.fireDelay = fireDelay;
	this.missileSpeed = missileSpeed;
	this.dy = Math.random() * 2;
	
	if (Math.floor(Math.random) * 2 == 1) {
		this.dy *= -1;
	}
	
	if (Math.floor(Math.random() * 2) == 1) {
		this.x = 450;
		this.dx = -1 * this.speed;
	} else {
		this.x = -50;
		this.dx = this.speed;
	}
	
	this.y = Math.floor(Math.random() * 400);
	
	CollisionManager.addCollidable(this);
});

Saucer.method('update', function () {
	this.hasFired = false;
	this.fireDelayCount++;

	if (Math.floor(Math.random() * 100) <= this.fireRate && this.fireDelayCount > this.fireDelay ) {
		this.hasFired = true;
		this.fireDelayCount= 0;
	}
	
	this.x += this.dx;
	this.y += this.dy;
	
	if (this.dx > 0 && this.x > Context.xMax()) {
		this.dead(true);
	} else if (this.dx < 0 && this.x < Context.xMin() - this.width) {
		this.dead(true);
	}
	
	if (this.y > Context.yMax() || this.y < Context.yMin() - this.width) {
		this.dy *= -1
	}
});

Saucer.method('draw', function (context) {
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.translate(this.x,this.y);
	context.strokeStyle = '#ffffff';
	context.beginPath();
	context.moveTo(4,0);
	context.lineTo(9,0);
	context.lineTo(12,3);
	context.lineTo(13,3);
	context.moveTo(13,4);
	context.lineTo(10,7);
	context.lineTo(3,7);
	context.lineTo(1,5);
	context.lineTo(12,5);
	context.moveTo(0,4);
	context.lineTo(0,3);
	context.lineTo(13,3);
	context.moveTo(5,1);
	context.lineTo(5,2);
	context.moveTo(8,1);
	context.lineTo(8,2);
	context.moveTo(2,2);
	context.lineTo(4,0);
	context.stroke();
	context.closePath();
	context.restore();
});

Saucer.method('dead', function(value) {
	this.isDead = value;
	this.setToDispose(value);
});

Saucer.method('dispose', function() {
	CollisionManager.removeCollidable(this);
});


/****************/
/* Evil Manager */
/****************/

// The Evil Manager is presponsible of managing the AI of the enemies

var EvilManager = (function () {

	var my = {};
	my.prototype = new gameComponent();
	
	var saucers = new Array();
	var missiles = new Array();
	
	var saucerScore = 0;
	var saucerSpeed = 0;
	var saucerFireDelay = 0;
	var saucerFireRate = 0;
	var saucerMissileSpeed = 0;
	var saucerMax = 0;
	var saucerOccurrenceRate = 0;
	
	var spanSaucer = function () {
		var s = new Saucer();
		s.init(saucerScore, saucerSpeed, saucerFireRate, saucerFireDelay, saucerMissileSpeed);
		saucers.push(s);
	};
	
	var fireSaucerMissile = function (saucer) {
		//var m = new SaucerMissile();
		//m.init(saucer.x, saucer.y, saucer.width, saucer.height, saucerMissileSpeed/* targetX, targetY */);
		//missiles.push(m);
	}
	
	my.init = function () {
		CollisionManager.on('collision', 'onCollision', EvilManager);
	};
	
	my.dispose = function () {
		EvilManager.reset();
		CollisionManager.remove('collision', 'onCollision', EvilManager);
	};
	
	my.reset = function () {
		saucers = new Array();
		missiles = new Array();
	};
	
	my.update = function () {
	
		if (saucers.length < saucerMax){
			if (Math.floor(Math.random()*100) <= saucerOccurrenceRate){
				//TODO: spanSaucer();
			}
		}
	
		var l = saucers.length-1;
		for (var i = l; i >= 0; i--) {
			if (saucers[i].hasFired) {
				fireSaucerMissile(saucers[i]);
			}
			saucers[i].update();
			if (saucers[i].getToDispose()) {
				saucers.splice(i,1)[0].dispose();
			}
		}
		
		l = missiles.length-1;
		for (var i = l; i >= 0; i--) {
			missiles[i].update();
			if (missiles[i].getToDispose()) {
				missiles.splice(i,1);
			}
		}
	};
	
	my.draw = function (context) {
		for (var i = 0; i < saucers.length; i++) {
			saucers[i].draw(context);
		}
		for (var i = 0; i < missiles.length; i++) {
			missiles[i].draw(context);
		}
	};
	
	my.onCollision = function (event) {

		if (event.obj1 instanceof PlayerMissile) {
			for (var i = 0; i < missiles.length; i++) {
				if (event.obj1 === missiles[i]) {
					obj1.dead(true);
					break;
				}
			}
		}
		
		if (event.obj2 instanceof PlayerMissile) {
			for (var i = 0; i < missiles.length; i++) {
				if (event.obj2 === missiles[i]) {
					obj2.dead(true);
					break;
				}
			}
		}
		
		if (event.obj1 === this) {
			this.dead(true);
			WorldManager.spanParticles(saucer.x + saucer.halfWidth, saucer.y + saucer.halfHeight,10);
		}
		
		if (event.obj2 === this) {
			this.dead(true);
			WorldManager.spanParticles(saucer.x + saucer.halfWidth, saucer.y + saucer.halfHeight,10);
		}
	};
	
	my.setSaucerParams = function (saucerData) {
		saucerScore = saucerData.score;
		saucerSpeed = saucerData.speed;
		saucerFireDelay = saucerData.fireDelay;
		saucerFireRate = saucerData.fireRate;
		saucerMissileSpeed = saucerData.missileSpeed;
		saucerMax = saucerData.max;
		saucerOccurrenceRate = saucerData.occurrenceRate;
	};
	
	return my;

} ());
