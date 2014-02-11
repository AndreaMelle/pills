var Assets = (function() {
	var that = {};

	var colorDark = "#002935";
	var colorLight = "#BFF4F5";
	var tri = '<svg>' + 
	'<path fill="#BFF4F5" d="M0,2.598c0-2.314,2.284-3.261,4.306-2.104l8.878,4.903c2.021,1.157,2.179,3.05,0.158,4.207l-9.115,4.903 C2.205,15.663,0,14.717,0,12.403V2.598z"/>' + 
	'</svg>';

	that.playerColors = [
	'#C02942',
	'#ECD078',
	'#D95B43',
	'#542437',
	'#C7F464'
	];

	var bckg = {
		x : 0,
		y : 0,
		width : GC.width(),
		height : GC.height()
	};

	bckg.draw = function (ctx) {
		ctx.clearRect(bckg.x, bckg.y, bckg.width, bckg.height);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#BFF4F5";
		ctx.fillStyle = "#002935";
		ctx.fillRect(bckg.x, bckg.y, bckg.width, bckg.height);
		ctx.strokeRect(bckg.x, bckg.y, bckg.width, bckg.height);
	};

	var wlc = {
		x : GC.width() / 2 - 421/2,
		y : GC.height() / 2 - 318/2,
		width : 421,
		height : 318,
		fontSize : 16,
		font : "px FreePixel",
	};

	wlc.draw = function (ctx) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#BFF4F5";
		ctx.fillStyle = "#002935";
		ctx.fillRect(wlc.x, wlc.y, wlc.width, wlc.height);
		ctx.strokeRect(wlc.x, wlc.y, wlc.width, wlc.height);

		ctx.font = wlc.fontSize + wlc.font;
		ctx.fillStyle = colorLight;
		ctx.setTransform(1,0,0,1,0,0);
		ctx.translate(wlc.x + 30,wlc.y + 30);
		var ty = 0;
		ctx.fillText("Hi! Pick up pills to fire bullets.", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("Press '1' for player 1:", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		'w' : thrust", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		'a' : rotate left", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		'd' : rotate right", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		's' : fire", 0, ty);
		ty += wlc.fontSize + 10;

		ctx.fillText("Press '2' for player 2:", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		'up' : thrust", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		'left' : rotate left", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		'right' : rotate right", 0, ty);
		ty += wlc.fontSize + 10;
		ctx.fillText("		'down' : fire", 0, ty);
		ty += wlc.fontSize + 10;

		ctx.setTransform(1,0,0,1,0,0);
	};

	var leaderboard = {
		fontSize : 16,
		font : "px FreePixel",
		color : colorLight
	};

	leaderboard.draw = function (ctx, donuts) {
		// @TODO: leading zeros
		ctx.font = leaderboard.fontSize + leaderboard.font;
		ctx.fillStyle = leaderboard.color;
		var tx = 20;
		var ty = 20;
		ctx.fillText("leaderboard:", tx, ty);
		ty += leaderboard.fontSize + 10;

		for(var i = 0; i < donuts.length; i++) {
			var d = donuts[i];
			var name = d.controller.getName();
			var score = d.getScore();
			var n = i + 1;
			ctx.fillText(
				n.toString() + '. ' +
				name + ' - ' +
				score.toString(),
				tx, ty);

			ty += leaderboard.fontSize + 10;
		}
	};

	var donut = function (spec) {

		var radius = spec.radius;
		var lineWidth = 2;
		var font = "10px Arial";
		var color = spec.color || "#000000";
		var colorOut = "#BFF4F5";
		var colorIn = "#002935";

		var buffer = document.createElement('canvas');
		buffer.width = 3 * radius;
		buffer.height = 3 * radius;
		var bufferCtx = buffer.getContext("2d");

		bufferCtx.setTransform(1,0,0,1,0,0);
		bufferCtx.translate(buffer.width/2, buffer.height/2);
		
		bufferCtx.drawSvg(tri, 23, -15/2.0, 15, 15);

		bufferCtx.lineWidth = lineWidth;
		bufferCtx.strokeStyle = colorOut;
		bufferCtx.fillStyle = colorIn;
		bufferCtx.beginPath();
		bufferCtx.arc(0, 0, radius, 0, 2 * Math.PI);
		bufferCtx.stroke();
		bufferCtx.fill();
		
		bufferCtx.fillStyle = color;
		bufferCtx.beginPath();
		bufferCtx.arc(0, 0, radius - 6, 0, 2 * Math.PI);
		bufferCtx.fill();

		bufferCtx.fillStyle = colorIn;
		bufferCtx.beginPath();
		bufferCtx.arc(0, 0, radius - 17, 0, 2 * Math.PI);
		bufferCtx.fill();

		bufferCtx.fillStyle = colorOut;
		bufferCtx.imageSmoothingEnabled = false;
		bufferCtx.fillRect(-1, -3, 2, 6);
		bufferCtx.fillRect(-3, -1, 6, 2);
		bufferCtx.imageSmoothingEnabled = true;
		bufferCtx.setTransform(1,0,0,1,0,0);
		

		var draw = function (ctx, px, py, dx, dy, rot, stamina) {
			//if (DEBUG) { drawPhysicsDebug(ctx); }

			ctx.setTransform(1,0,0,1,0,0);
			ctx.translate(px, py);
			ctx.rotate(rot);
			ctx.translate(-buffer.width/2, -buffer.height/2);
			ctx.drawImage(buffer, 0, 0);
			ctx.setTransform(1,0,0,1,0,0);
		};

		return {
			'draw' : draw,
			color : function () { return color; }
		};

	};

	var bullet = function (spec) {

		var radius = 4;
		var color = spec.color || "#000000";

		var draw = function (ctx, px, py) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(px, py, radius, 0, 2 * Math.PI);
			ctx.fill();
		};

		return {
			'draw' : draw
		};

	};

	var pill = function (spec) {
		var radius = spec.radius || 0;
		var colorOut = "#BFF4F5";
		var colorIn = "#002935";

		var buffer = document.createElement('canvas');
		buffer.width = 3 * radius;
		buffer.height = 3 * radius;
		var bufferCtx = buffer.getContext("2d");

		bufferCtx.setTransform(1,0,0,1,0,0);
		bufferCtx.translate(buffer.width/2, buffer.height/2);
		
		bufferCtx.fillStyle = colorOut;
		bufferCtx.beginPath();
		bufferCtx.arc(0, 0, radius, 0, 2 * Math.PI);
		bufferCtx.fill();

		bufferCtx.fillStyle = colorIn;
		bufferCtx.imageSmoothingEnabled = false;
		bufferCtx.fillRect(-1, -3, 2, 6);
		bufferCtx.fillRect(-3, -1, 6, 2);
		bufferCtx.imageSmoothingEnabled = true;
		
		bufferCtx.setTransform(1,0,0,1,0,0);

		var draw = function (ctx, px, py) {

			ctx.setTransform(1,0,0,1,0,0);
			ctx.translate(px-buffer.width/2, py-buffer.height/2);
			ctx.drawImage(buffer, 0, 0);
			ctx.setTransform(1,0,0,1,0,0);
		};

		return {
			'draw' : draw
		};
	};

	that.background = bckg;
	that.donut = donut;
	that.leaderboard = leaderboard;
	that.pill = pill({radius : 8});
	that.bullet = bullet;
	that.welcome = wlc;

	that.setTri = function (value) {
		tri = value;
	}

	return that;
}());



/*
var drawPhysicsDebug = function (ctx) {

	ctx.strokeStyle = "#0000FF";
	ctx.strokeRect(worldBox.x,worldBox.y,worldBox.width,worldBox.height);


	for(var i = 0; i < worldBox.width; i++) {

		ctx.beginPath();
		ctx.arc(i * radius, worldBox.y, radius, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(i * radius, worldBox.y + worldBox.height, radius, 0, 2 * Math.PI);
		ctx.stroke();
	}

	for(var i = 0; i < worldBox.height; i++) {

		ctx.beginPath();
		ctx.arc(worldBox.x, i * radius, radius, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(worldBox.x + worldBox.width, i * radius, radius, 0, 2 * Math.PI);
		ctx.stroke();
		
	}
};
*/