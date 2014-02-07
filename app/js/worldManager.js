/********/
/* Rock */
/********/

var Rock = function (rockType, score, scale) {
	this.score = score;
	this.scale = scale;
	this.rockType = rockType;
	this.maxSpeed = 0;
	this.isHit = false;
	this.isDead = false;
	this.sprite = null;
};

Rock.prototype = new DrawableComponent();
makeCollidable(Rock.prototype);

Rock.method('init', function (maxSpeed, x, y) {

	this.width = Math.ceil(50 / this.scale);
	this.height = Math.ceil(50 / this.scale);
	
	this.halfWidth = this.width / 2;
	this.halfHeight = this.height / 2;
	
	this.maxSpeed = maxSpeed;
	this.dx = (Math.random()*2) + this.maxSpeed;
	this.dy = (Math.random()*2) + this.maxSpeed;
	
	if (Math.random()<.5) {
		this.dx*=-1;
	}
	
	if (Math.random()<.5) {
		this.dy*=-1;
	}
	
	this.rotationInc = (Math.random()*5)+1;
	if (Math.random()<.5) {
		this.rotationInc*=-1;
	}
	
	this.x = x || Math.floor(Math.random()*50);
	this.y = y || Math.floor(Math.random()*50);
	
	/*
	if (typeof x != 'undefined' && typeof y != 'undefined') {
		this.x = x;
		this.y = y;		
	} else {
		this.x = Math.floor(Math.random()*50);
		this.y = Math.floor(Math.random()*50);
	}
	*/
	
});

Rock.method('update', function () {
	this.x += this.dx;
	this.y += this.dy;
	this.rotation += this.rotationInc;
	
	if (this.x > Context.xMax()) {
		this.x = Context.xMin() - this.width;
	} else if (this.x < Context.xMin() - this.width) {
		this.x = Context.xMax();
	}
	
	if (this.y > Context.yMax()) {
		this.y = Context.yMin() - this.height;
	} else if (this.y < Context.yMin() - this.height) {
		this.y = Context.yMax();
	}
});

Rock.method('draw', function (context) {

	this.sprite.x = this.x + this.halfWidth;
	this.sprite.y = this.y + this.halfHeight;
	this.sprite.rotation = this.rotation;
	this.sprite.scale = 1;
	this.sprite.draw(context);

	/*
	context.strokeStyle = '#ffffff';
	context.beginPath();
	context.moveTo(-(this.halfWidth-1),-(this.halfHeight-1));
	context.lineTo((this.halfWidth-1),-(this.halfHeight-1));
	context.lineTo((this.halfWidth-1),(this.halfHeight-1));
	context.lineTo(-(this.halfWidth-1),(this.halfHeight-1));
	context.lineTo(-(this.halfWidth-1),-(this.halfHeight-1));
	context.stroke();
	context.closePath();
	*/
	context.restore();
});

Rock.method('hit', function(value) {
	this.isHit = value;
});

Rock.method('dead', function(value) {
	this.isDead = value;
	this.setToDispose(value);
});

//Rock.method('dispose', function() {});

/************/
/* Particle */
/************/

var Particle = function () {
	this.isDead = false;
	this.lifeCtr = 0;
};

Particle.prototype = new DrawableComponent();

Particle.method('init', function (x,y) {
	
	this.dx = Math.random() * 3;
	
	if (Math.random() < 0.5){
		this.dx *= -1;
	}
	
	this.dy = Math.random()*3;
	
	if (Math.random() < 0.5) {
		this.dy *= -1;
	}
	
	this.life = Math.floor(Math.random() * 30 + 30);
	
	this.x = x;
	this.y = y;
});

Particle.method('update', function () {
	this.x += this.dx;
	this.y += this.dy;
	this.lifeCtr++;
	
	if (this.lifeCtr > this.life) {
		this.dead(true);
	} else if ((this.x > Context.xMax()) || (this.x < Context.xMin()) || (this.y > Context.yMax()) || (this.y < Context.yMin())) {
		this.dead(true);
	}
});

Particle.method('draw', function (context) {
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.translate(this.x, this.y);
	context.strokeStyle = '#ffffff';
	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(1,1);
	context.stroke();
	context.closePath();
	context.restore();
});

Particle.method('dead', function(value) {
	this.isDead = value;
	this.setToDispose(value);
});

//Particle.method('reset', function () {});

/*****************/
/* World Manager */
/*****************/

// The World Manager is responsible to manage rocks and other non-intelligent elements
var WorldManager = (function () {

	var my = {};
	my.prototype = new gameComponent();
	
	var scoreRockL = 50;
	var scoreRockM = 75;
	var scoreRockS = 100;

	var scaleRockL = 1;
	var scaleRockM = 2;
	var scaleRockS = 4;
	
	var rocks = new Array();
	var particles = new Array();
	
	var rockMaxSpeed = 0;
	
	var spanRock = function (type, speed, x, y) {
		
		var r = null;
		
		switch (type) {
			case WorldManager.ROCK_LARGE:
				r = new Rock(WorldManager.ROCK_LARGE,scoreRockL,scaleRockL);
				r.sprite = SpriteManager.getSprite('largeRock');
				break;
			case WorldManager.ROCK_MEDIUM:
				r = new Rock(WorldManager.ROCK_MEDIUM,scoreRockM,scaleRockM);
				r.sprite = SpriteManager.getSprite('mediumRock');
				break;
			case WorldManager.ROCK_SMALL:
				r = new Rock(WorldManager.ROCK_SMALL,scoreRockS,scaleRockS);
				r.sprite = SpriteManager.getSprite('smallRock');
				break;
			default:
				throw { name : 'TypeError', message : 'Rock type unknown' };	
		}
		
		if (r != null) {
			r.init(speed,x,y);
			CollisionManager.addCollidable(r);
			rocks.push(r);
		}
		
		return r;
	};
	
	var splitRock = function (rock) {
	
		newRockType = null;
		newRockNum = null;
		
		switch (rock.rockType) {
			case WorldManager.ROCK_LARGE:
				newRockType = WorldManager.ROCK_MEDIUM;
				newRockNum = 2;
				break;
			case WorldManager.ROCK_MEDIUM:
				newRockType = WorldManager.ROCK_SMALL;
				newRockNum = 2;
				break;
			case WorldManager.ROCK_SMALL:
				newRockNum = 0;
				break;
			default:
				throw { name : 'TypeError', message : 'Rock type unknown' };	
		}
	
		for (var i = 0; i < newRockNum; i++){
			var r = spanRock(newRockType,rock.maxSpeed,rock.x,rock.y);
			r.dx = Math.random() * 3;
			r.dy = Math.random() * 3;
		}
		
		WorldManager.spanParticles(rock.x + rock.halfWidth, rock.y + rock.halfHeight, 10);
		CollisionManager.removeCollidable(rock);
		rock.dead(true);
	};
	
	my.init = function () {
		CollisionManager.on('collision', 'onCollision', WorldManager);
	};
	
	my.reset = function () {
		rocks = new Array();
		particles = new Array();
	};
	
	my.dispose = function () {
		WorldManager.reset();
		CollisionManager.remove('collision', 'onCollision', WorldManager);
	};
	
	my.onCollision = function (event) {
		
		if ( (event.obj1 instanceof Rock) && !(event.obj2 instanceof Rock) ) {
			event.obj1.hit(true);
		}
		if ( (event.obj2 instanceof Rock) && !(event.obj1 instanceof Rock) ) {
			event.obj2.hit(true);
		}
	};
	
	my.update = function () {
		
		var l = rocks.length - 1;
		for (var i = l; i >= 0; i--) {
			if (rocks[i].isHit) {
				splitRock(rocks[i]);
			}
			rocks[i].update();
			
			if (rocks[i].getToDispose()) {
				rocks.splice(i,1)[0].dispose();
			}
		}
		
		l = particles.length-1;
		for (var i = l; i >= 0; i--) {
			particles[i].update();
			
			if (particles[i].getToDispose()) {
				particles.splice(i,1)[0].dispose();
			}
		}
	};
	
	my.draw = function (context) {
		for (var i = 0; i < rocks.length; i++) {
			rocks[i].draw(context);
		}
		
		for (var i = 0; i < particles.length; i++) {
			particles[i].draw(context);
		}
	};
	
	my.spanRocks = function (num, type) {
		for (var i = 0; i < num; i++) {
			spanRock(type,rockMaxSpeed);
		}
	};
	
	my.spanParticles = function (x,y,num) {
		for (var i = 0; i < num; i++) {
			var p = new Particle();
			p.init(x,y);
			particles.push(p);
		}
	};
	
	my.setRockMaxSpeed = function (value) {
		rockMaxSpeed = value;
	};
	
	my.getNumRocks = function () {
		return rocks.length;
	};
	
	my.getNumParticles = function () {
		return particles.length;
	};
	
	my.ROCK_LARGE = 1;
	my.ROCK_MEDIUM = 2;
	my.ROCK_SMALL = 3;
	
	return my;

} ());