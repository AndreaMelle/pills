var Player = function () {
	this.extraShipAtEach = 1000;
	this.friction = 0.02;
	this.missileFrameDelay = 5;
};

Player.method('init', function () {
	this.score = 0;
	this.lives = 3;
	this.extraShipsEarned = 0;
	this.isDead = false;
	this.sprite = SpriteManager.getSprite('ship');
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
});

Player.method('update', function () {

	this.checkForExtraShip();
	
	
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
	