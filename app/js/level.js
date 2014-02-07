/**************/
/* Level Data */
/**************/

// a level data object makes it easy to manage generative and loaded from file levels as well.
var LevelData = {
	levelNum : 0,
	saucerData : {
		score : 300,
		speed : 1,
		fireDelay : 300,
		fireRate : 30,
		missileSpeed : 1,
		max : 1,
		occurrenceRate : 25
	},
	rockData : {
		maxSpeedAdjust : 1,
		maxSpeed : 0,
		numRocks : 0
	}
};

// Generative
var generateLevelParameters = function(level) {

	var levelData = Object.create(LevelData);

	levelData.levelNum = level;
	levelData.rockData.maxSpeedAdjust = level * .25;
	levelData.rockData.maxSpeed = Math.min(3 ,levelData.rockData.maxSpeedAdjust);
	levelData.rockData.numRocks = level + 3;
	levelData.saucerData.max = Math.min(1 + Math.floor(level/10) , 5);
	levelData.saucerData.occurrenceRate = Math.min(10 + 3 * level , 35);
	levelData.saucerData.speed = Math.min(1 + 0.5 * level , 5);
	levelData.saucerData.fireDelay = Math.min(120 - 10 * level , 20);
	levelData.saucerData.fireRate = Math.min(20 + 3 * level , 50);
	levelData.saucerData.missileSpeed = Math.min(1 + 0.2 * level , 4);
	
	return levelData;
};

//TODO: from file
var loadLevelParameters = function (file) {
	return null;
};

/*********/
/* Level */
/*********/

var Level = function () {
	this.player = null;
	this.runnable = null;
	this.levelData = null;
	this.background = null;
	this.scoreboard = null;
	this.alphaAnimation = null;
};

makePublisher(Level.prototype);

Level.method('init', function (player, level) {
	
	this.levelData = generateLevelParameters(level);
	this.player = player;

	WorldManager.reset();
	EvilManager.reset();
	CollisionManager.reset();
	this.player.reset();
	
	WorldManager.setRockMaxSpeed(this.levelData.rockData.maxSpeed);
	EvilManager.setSaucerParams(this.levelData.saucerData);
	
	WorldManager.spanRocks(this.levelData.rockData.numRocks, WorldManager.ROCK_LARGE);
	
	this.background = new Background();
	this.scoreboard = new Scoreboard();
	this.alphaAnimation = new Animation();
	this.background.init(Context.xMin(), Context.yMin(), Context.xMax(), Context.yMax());
	this.scoreboard.init(player.score, player.lives, FrameRateManager.countFrames());
	this.alphaAnimation.init(0,1,0.02);
	
	CollisionManager.addCollidable(this.player);
	
	this.runnable = this.intro;
});

Level.method('dispose', function () {
	CollisionManager.removeCollidable(this.player);
	this.background.dispose();
	this.scoreboard.dispose();
	this.background = null;
	this.scoreboard = null;
});

Level.method('run', function () {
	this.runnable();
});

Level.method('intro', function () {
	
	this.alphaAnimation.update();
	
	if (this.alphaAnimation.isOver()) {
		this.runnable = this.gameLoop;
		return;
	} else {
		
		this.applyInput();
		this.background.update();
		this.player.update();
		WorldManager.update();
	
		this.background.draw(Context.get());
		WorldManager.draw(Context.get());
		this.scoreboard.draw(Context.get());
	
		Context.get().globalAlpha = this.alphaAnimation.getValue();
		this.player.draw(Context.get());
		Context.get().globalAlpha = 1;
	}	
});

Level.method('outro', function () {
	if (WorldManager.getNumParticles() > 0) {
		WorldManager.update();
		EvilManager.update();
		
		this.background.draw(Context.get());
		WorldManager.draw(Context.get());
		EvilManager.draw(Context.get());
		//this.scoreboard.draw(Context.get());
		
		this.player.update();
		//this.player.draw(Context.get());
	} else {
		if (this.player.isDead) {
			ConsoleLog.log('Game State Game Over');
			this.fire('gameStateChange', GameController.GAME_STATE_GAME_OVER);
		} else {
			this.player.reset();
			this.alphaAnimation.init(0,1,0.02);
			this.runnable = this.intro;
			return;
		}
	}
});

Level.method('applyInput', function() {
	if (InputManager.getKeys()[InputManager.keymap.p1.UP]) {
		this.player.thrustOn();
	} else if (!InputManager.getKeys()[InputManager.keymap.p1.UP]) {
		this.player.thrustOff();
	}
	
	if (InputManager.getKeys()[InputManager.keymap.p1.CCW]) {
		this.player.rotateCCW();
	}
	
	if (InputManager.getKeys()[InputManager.keymap.p1.CW]) {
		this.player.rotateCW();
	}
	
	if (InputManager.getKeys()[InputManager.keymap.p1.ACTION]) {
		this.player.fireMissile();
	}
});

Level.method('gameLoop', function () {
	
	this.applyInput();
	this.background.update();
	
	CollisionManager.update();
	
	this.player.update();
	EvilManager.update();
	WorldManager.update();
	
	this.scoreboard.setScoreInfo(this.player.score);
	this.scoreboard.setLifeInfo(this.player.lives);
	this.scoreboard.setFramerateInfo(FrameRateManager.countFrames());
	this.scoreboard.update();
	
	this.background.draw(Context.get());
	WorldManager.draw(Context.get());
	EvilManager.draw(Context.get());
	this.player.draw(Context.get());
	this.scoreboard.draw(Context.get());
	
	if (WorldManager.getNumRocks() == 0) {
		ConsoleLog.log('Game State New Level');
		this.fire('gameStateChange', GameController.GAME_STATE_NEW_LEVEL);
	}
	
	if(this.player.isHit) {
		WorldManager.spanParticles(this.player.x + this.player.halfWidth, this.player.y + this.player.halfWidth, 50);
		this.runnable = this.outro;
		return;
	}
	
});

Level.method('onKey', function (e) {
	if (e.keyCode == 38 && e.pressed) {
		this.player.thrustOn();
	} else if (e.keyCode == 38 && !e.pressed) {
		this.player.thrustOff();
	}
	
	if (e.keyCode == 37 && e.pressed) {
		this.player.rotateCCW();
	}
	
	if (e.keyCode == 39 && e.pressed) {
		this.player.rotateCW();
	}
	
	if (e.keyCode == 32 && e.pressed) {
		this.player.fireMissile();
	}
});