/* The application singleton, managing the states */

var GameController = (function () {
	
	var my = {};
	
	my.GAME_STATE_TITLE = 0;
	my.GAME_STATE_NEW_GAME = 1;
	my.GAME_STATE_GAME_OVER = 2;
	
	var currentGameState = 0;
	var currentStage = null;
	//var inputManager = null;
	
	var replaceStage = function (nextStage) {
		
		if (currentStage != null) {
			currentStage.remove('gameStateChange','onGameStateChangeEvent', GameController);
			//inputManager.remove('key', currentStage.onKey, currentStage);
			currentStage.dispose();
			currentStage = null;
		}
		
		currentStage = nextStage;
		currentStage.init();
		currentStage.on('gameStateChange','onGameStateChangeEvent', GameController);
		//inputManager.on('key', currentStage.onKey, currentStage);
	};
	
	var runGame = function () {
		//inputManager.update();
		currentStage.run();	
	};
	
	my.onGameStateChangeEvent = function (event) {
		switchGameState(event);
	};
	
	var switchGameState = function (newState) {
		switch (newState) {
			case GameController.GAME_STATE_TITLE:
				currentGameState = GameController.GAME_STATE_TITLE;
				replaceStage(new TitleStage());
				break;
			case GameController.GAME_STATE_NEW_GAME:
				currentGameState = GameController.GAME_STATE_NEW_GAME;
				replaceStage(new GameStage());
				break;
			case GameController.GAME_STATE_GAME_OVER:
				currentGameState = GameController.GAME_STATE_GAME_OVER;
				replaceStage(new GameOverStage());
				break;
		}
	};
	
	my.start = function () {
		//inputManager = new InputManager();
		InputManager.init();
		Context.init();
		switchGameState(GameController.GAME_STATE_TITLE);
		setInterval(runGame, FrameRateManager.intervalTime);
		
		//TODO: how the hell we get to be here???
		//inputManager.dispose();
		//currentStage.dispose();
	};
	
	return my;
}());