/****************/
/* Base Missile */
/****************/
var Missile = function () {
	this.isDead = false;
	this.lifeCtr = 0;
	this.life = 0;
};

Missile.prototype = new gameComponent();
makeCollidable(Missile);

//Missile.method('init', function () {});

Missile.method('update', function () {
	this.x += this.dx;
	this.y += this.dy;
	
	if (this.x > Context.xMax()) {
		this.x =- this.width;
	} else if (this.x < -this.width) {
		this.x = Context.xMax();
	}

	if (this.y > Context.yMax()) {
		this.y =- this.height;
	} else if (this.y < -this.height) {
		this.y = Context.yMax();
	}
	
	this.lifeCtr++;
	
	if (this.lifeCtr > this.life) {
		this.isDead = true;
	}
});

Missile.method('draw', function (context) {
	context.save();
	context.setTransform(1,0,0,1,0,0);
	context.translate(this.x + 1, this.y + 1);
	context.strokeStyle = '#ffffff';
	context.beginPath();
	context.moveTo(-1,-1);
	context.lineTo(1,-1);
	context.lineTo(1,1);
	context.lineTo(-1,1);
	context.lineTo(-1,-1);
	context.stroke();
	context.closePath();
	context.restore();
});

//Missile.method('reset', function () {});

Missile.method('dead', function(value) {
	this.isDead = value;
	this.setToDispose(value);
});


/****************/
/* Ship missile */
/****************/

var PlayerMissile = function () {};
PlayerMissile.prototype = new Missile();

PlayerMissile.method('init', function (shipX, shipY, shipW, shipH, shipRotation) {
	this.dx = 5*Math.cos(Math.PI*(shipRotation)/180);
	this.dy = 5*Math.sin(Math.PI*(shipRotation)/180);
	this.x = shipX + shipW / 2;
	this.y = shipY + shipH / 2;
	this.life = 60;
	this.width = 2;
	this.height = 2;
	CollisionManager.addCollidable(this);
});

PlayerMissile.method('dispose', function() {
	CollisionManager.removeCollidable(this);
});

//PlayerMissile.method('draw', function (context) {});
//PlayerMissile.method('reset', function () {});

/******************/
/* Saucer missile */
/******************/

var SaucerMissile = function () {};
SaucerMissile.prototype = new Missile();

SaucerMissile.method('init', function (saucerX, saucerY, saucerW, saucerH, speed, targetX, targetY) {
	this.x = saucerX + 0.5 * saucerW;
	this.y = saucerY + 0.5 * saucerH;
	this.width = 2;
	this.height = 2;
	this.speed = speed;
	var diffx = targetX - saucerX;
	var diffy = targetY - saucerY;
	var radians = Math.atan2(diffy, diffx);
	var degrees = 360 * radians / (2 * Math.PI);
	this.dx = this.speed * Math.cos(Math.PI*(degrees)/180);
	this.dy = this.speed * Math.sin(Math.PI*(degrees)/180);
	this.life = 160;
	CollisionManager.addCollidable(this);
});

SaucerMissile.method('dispose', function() {
	CollisionManager.removeCollidable(this);
});

//SaucerMissile.method('draw', function (context) {});
//SaucerMissile.method('reset', function () {});


