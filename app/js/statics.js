/* Background object */
var Background = function () {};

Background.prototype = new gameComponent();

Background.method('init', function (xMin, yMin, xMax, yMax) {
	this.xMin = xMin;
	this.yMin = yMin;
	this.xMax = xMax;
	this.yMax = yMax;
});

Background.method('update', function () {});

Background.method('draw', function (context) {
	context.fillStyle = '#000000';
	context.fillRect(this.xMin, this.yMin, this.xMax - this.xMin, this.yMax - this.yMin);
});

/* Scoreboard object */
var Scoreboard = function () {};

Scoreboard.prototype = new gameComponent();

Scoreboard.method('init', function (scoreInfo, lifeInfo, framerateInfo) {
	this.scoreInfo = scoreInfo;
	this.lifeInfo = lifeInfo;
	this.framerateInfo = framerateInfo;
});

Scoreboard.method('update', function () {});

Scoreboard.method('draw', function (context) {
	context.fillStyle = "#ffffff";
	context.fillText('Score ' + this.scoreInfo, 10, 20);
	//TODO: render an icon instead of a text - renderPlayerShip(200,16,270,.75);
	context.fillText('Lives: ' + this.lifeInfo, 220, 20);
	context.fillText('FPS: ' + this.framerateInfo, 300,20);
});

Scoreboard.method('setScoreInfo', function (scoreInfo) {
	this.scoreInfo = scoreInfo;
});

Scoreboard.method('setLifeInfo', function (lifeInfo) {
	this.lifeInfo = lifeInfo;
});

Scoreboard.method('setFramerateInfo', function (framerateInfo) {
	this.framerateInfo = framerateInfo;
});

/* Other utils */

function setTextStyle(context) {
	context.fillStyle = '#ffffff';
	context.font = '15px _sans';
	context.textBaseline = 'top';
}