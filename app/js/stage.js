var Stage = function () {};
makePublisher(Stage.prototype);
Stage.method('init', function () {});
Stage.method('run', function () {});
Stage.method('dispose', function (context) {});

/* Title stage */

var TitleStage = function () {
	this.background = null;
};

TitleStage.prototype = new Stage();
//makePublisher(TitleStage.prototype);

TitleStage.method('init', function () {
	this.background = new Background();
	this.background.init(Context.xMin(), Context.yMin(), Context.xMax(), Context.yMax());
});

TitleStage.method('dispose', function (context) {
	this.background.dispose();
	this.background = null;
});

TitleStage.method('run', function () {

	if (InputManager.getKeys()[InputManager.keymap.p1.ACTION]) {
		ConsoleLog.log('Game State New Game');
		this.fire('gameStateChange',GameController.GAME_STATE_NEW_GAME);
	} else {
		this.background.update();
		this.background.draw(Context.get());
		setTextStyle(Context.get());
		Context.get().fillText ("Geo Blaster Basic", 130, 70);
		Context.get().fillText ("Press Space To Play", 120, 140);
	}
});

TitleStage.method('onKey', function(e) {
	if (e.keyCode == 32 && e.pressed) {
		ConsoleLog.log('Game State New Game');
		this.fire('gameStateChange',GameController.GAME_STATE_NEW_GAME);
	}
});

/* GameOver stage */

var GameOverStage = function () {
	this.background = null;
};

GameOverStage.prototype = new Stage();

GameOverStage.method('init', function () {
	this.background = new Background();
	this.background.init(Context.xMin(), Context.yMin(), Context.xMax(), Context.yMax());
});

GameOverStage.method('dispose', function (context) {
	this.background.dispose();
	this.background = null;
});

GameOverStage.method('run', function () {

	if (InputManager.getKeys()[InputManager.keymap.p1.ACTION]) {
		ConsoleLog.log('Game State Title');
		this.fire('gameStateChange',GameController.GAME_STATE_TITLE);
	} else {

		this.background.update();
		this.background.draw(Context.get());
	
		//TODO: renderScoreBoard();
		setTextStyle(Context.get());
		Context.get().fillText ("Game Over!", 150, 70);
		Context.get().fillText ("Press Space To Play", 120, 140);
	}
});

GameOverStage.method('onKey', function(e) {
	if (e.keyCode == 32 && e.pressed) {
		ConsoleLog.log('Game State Title');
		this.fire('gameStateChange',GameController.GAME_STATE_TITLE);
	}
});

/* Game stage */

var GameStage = function () {
	this.player = null;
	this.currentLevel = null;
	this.currentLevelNumber = 0;
};

GameStage.prototype = new Stage();

GameStage.method('init', function () {
	this.player = new Player();
	this.player.init();
	WorldManager.init();
	EvilManager.init();
	CollisionManager.init();
	this.nextLevel();
});

GameStage.method('dispose', function (context) {
	this.currentLevel.remove('gameStateChange',this.onLevelStateChangeEvent, this);
	this.currentLevel.dispose();
	this.player.dispose();
});

GameStage.method('nextLevel', function () {
	
	if (this.currentLevel) {
		this.currentLevel.remove('gameStateChange',this.onLevelStateChangeEvent, this);
		this.currentLevel.dispose();	
	}
	
	this.currentLevelNumber++;
	this.currentLevel = new Level();
	this.currentLevel.init(this.player, this.currentLevelNumber);
	this.currentLevel.on('gameStateChange','onLevelStateChangeEvent', this);
});

GameStage.method('run', function () {
	this.currentLevel.run();
});

GameStage.method('onLevelStateChangeEvent', function (event) {
	if (event == GameController.GAME_STATE_GAME_OVER) {
		ConsoleLog.log('Game State Game Over');
		this.fire('gameStateChange',GameController.GAME_STATE_GAME_OVER);
	} else if (event == GameController.GAME_STATE_NEW_LEVEL) {
		this.nextLevel();
	}
});

GameStage.method('onKey', function(e) {
	/*
	if(this.currentLevel) {
		this.currentLevel.onKey(e);
	}
	*/
});