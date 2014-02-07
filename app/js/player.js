var Player = function () {
	this.extraShipAtEach = 1000;
	this.width = 20;
	this.height = 20;
	this.thrustAcceleration = 0.05; //0.05;
	this.maxVelocity = 5;
	this.friction = 0.02;
	this.rotationalVelocity = 5; //5;
	this.missileFrameDelay = 5;
	this.halfWidth = this.width / 2;
	this.halfHeight = this.height / 2;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.vmod = 0;
};

Player.prototype = new gameComponent();
makeCollidable(Player.prototype);

Player.method('init', function () {
	this.score = 0;
	this.lives = 3;
	this.extraShipsEarned = 0;
	this.isDead = false;
	
	this.sprite = SpriteManager.getSprite('ship');
	
	CollisionManager.on('collision', 'onCollision', this);
	this.reset();
});

Player.method('reset', function () {
	this.x = 0.5 * Context.xMax();
	this.y = 0.5 * Context.yMax();
	this.rotation = 270;
	this.scale = 1;
	this.thrust = false;
	this.isHit = false;
	this.missileFrameCount = 0;
	this.missiles = new Array();
});

Player.method('dispose', function () {
	this.reset();
	CollisionManager.remove('collision', 'onCollision', this);
});

Player.method('update', function () {

	this.checkForExtraShip();
	
	var acc = this.thrust ? this.thrustAcceleration : 0;
	var angle = this.rotation * Math.PI / 180;
	
	this.vx = this.vx + acc * Math.cos(angle) - this.friction * this.vx;
	this.vy = this.vy + acc * Math.sin(angle) - this.friction * this.vy;
	
	this.vmod = Math.sqrt((this.vx * this.vx) + (this.vy * this.vy));
	this.vx = (this.vmod < this.maxVelocity) ? this.vx : this.maxVelocity;
	this.vy = (this.vmod < this.maxVelocity) ? this.vy : this.maxVelocity;
	
	this.x += this.vx;
	this.y += this.vy;
	
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
	
	this.missileFrameCount++;
	
	var l = this.missiles.length - 1;
	for (var i = l; i >= 0; i--) {
		this.missiles[i].update();
		if (this.missiles[i].getToDispose()) {
			this.missiles.splice(i,1)[0].dispose();
		}
	}
});

Player.method('draw', function (context) {
	
	this.sprite.x = this.x + this.halfWidth;
	this.sprite.y = this.y + this.halfHeight;
	this.sprite.rotation = this.rotation;
	this.sprite.scale = this.scale; 
	this.sprite.setFrame( (this.thrust ? 'thrustOn' : 'thrustOff') );
	this.sprite.draw(context);
	
	/*
	if (Context.drawLineArt) {
		context.strokeStyle = '#ffffff';
		context.beginPath();
		context.moveTo(-10,-10);
		context.lineTo(10,0);
		context.moveTo(10,1);
		context.lineTo(-10,10);
		context.lineTo(1,1);
		context.moveTo(1,-1);
		context.lineTo(-10,-10);
		
		if (this.thrust == 1 && this.scale == 1) {
			context.moveTo(-4,-2);
			context.lineTo(-4,1);
			context.moveTo(-5,-1);
			context.lineTo(-10,-1);
			context.moveTo(-5,0);
			context.lineTo(-10,0);
		}
		
		context.stroke();
		context.closePath();
	}
	*/
	
	for (var i = 0; i < this.missiles.length; i++) {
		this.missiles[i].draw(context);
	}
	
});

Player.method('onCollision', function(event) {

	var myCollision = false;

	if (event.obj1 instanceof PlayerMissile && (event.obj2 instanceof Saucer || event.obj2 instanceof Rock)) {
		for (var i = 0; i < this.missiles.length; i++) {
			if (event.obj1 === this.missiles[i]) {
				event.obj1.dead(true);
				myCollision = true;
				break;
			}
		}
	}
	if (event.obj2 instanceof PlayerMissile && (event.obj1 instanceof Saucer || event.obj1 instanceof Rock)) {
		for (var i = 0; i < this.missiles.length; i++) {
			if (event.obj2 === this.missiles[i]) {
				event.obj2.dead(true);
				myCollision = true;
				break;
			}
		}
	}
	
	if (event.obj1 === this && (event.obj2 instanceof Saucer || event.obj2 instanceof Rock)) {
		this.hit(true);
		myCollision = true;
	}
	if (event.obj2 === this && (event.obj1 instanceof Saucer || event.obj1 instanceof Saucer)) {
		this.hit(true);
		myCollision = true;
	}
	
	
	if (myCollision && (event.obj1 instanceof Saucer || event.obj1 instanceof Rock)) {
		this.addToScore(event.obj1.score);
	}
	if (myCollision && (event.obj2 instanceof Saucer || event.obj2 instanceof Saucer)) {
		this.addToScore(event.obj2.score);
	}
	
});

Player.method('thrustOn', function () {
	this.thrust = true;
});

Player.method('thrustOff', function () {	
	this.thrust = false;
});

Player.method('rotateCCW', function () {
	this.rotation -= this.rotationalVelocity;
});

Player.method('rotateCW', function () {
	this.rotation += this.rotationalVelocity;
});

Player.method('fireMissile', function () {
	if (this.missileFrameCount > this.missileFrameDelay) {
		var p = new PlayerMissile();
		p.init(this.x, this.y, this.width, this.height, this.rotation);
		this.missiles.push(p);
		this.missileFrameCount = 0;
	}
});

Player.method('addToScore', function (value) {
	this.score += value;
});

Player.method('checkForExtraShip', function () {
	if (Math.floor(this.score / this.extraShipAtEach) > this.extraShipsEarned) {
		this.lives++;
		this.extraShipsEarned++;
	}
});

Player.method('dead', function(value) {
	this.isDead = value;
	this.setToDispose(value);
});

Player.method('hit', function() {
	this.isHit = true;
	this.lives--;
	if (this.lives < 1) {
		this.dead(true);
	}
});

Player.method('getNumMissiles', function() {
	return this.missiles.length;
});
	