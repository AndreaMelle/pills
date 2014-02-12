var http = require('http');
var express = require('express');
var mp = require(__dirname + '/app/js/messageMap');

var pin = 1111;

var app = express();
var port = process.env.PORT || 5000;
app.set('port', port);

//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.static(__dirname + '/app'));

// development only
/*
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
*/

var httpd = http.createServer(app);
var io = require('socket.io').listen(httpd);
io.set('log level', 2);

httpd.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



/*
var news = io
  .of('/news')
*/

var sg = io.of('/sg');

var newGameContext = function (pin, gameSocket) {

	var gameCtx = io.of('/sg/' + pin);

	var players = [];

	gameCtx.on('connection', function(socket) {

		gameSocket.on(mp.SCORE, function (data) {
			socket.get('name', function(err, name) {
				if(err) { throw err; }
				if(data[mp.NAME] === name) {
					socket.emit(mp.SCORE, data);
				}
			});
		});

		gameSocket.on(mp.STAMINA, function (data) {
			socket.get('name', function(err, name) {
				if(err) { throw err; }
				if(data[mp.NAME] === name) {
					socket.emit(mp.STAMINA, data);
				}
			});
		});

		gameSocket.on(mp.PLAYERINFO, function (data) {
			socket.get('name', function(err, name) {
				if(err) { throw err; }
				if(data[mp.NAME] === name) {
					socket.emit(mp.PLAYERINFO, data);
				}
			});
		});

		gameSocket.on('disconnect', function() {
			// screen died
			socket.emit(mp.END);
		});

		socket.on(mp.COMMAND, function (data) {
			gameSocket.emit(mp.COMMAND, data);
		});

		socket.on(mp.REMOVEPLAYER, function (data) {

			console.log('Player: ' + data + ' left the game');
			var idx = players.indexOf(data);
			if(idx > -1) {
				players.splice(idx,1)[0];
				gameSocket.emit(mp.REMOVEPLAYER, data);
			}			

		});

		socket.on(mp.NEWPLAYER, function(data) {

			console.log("User connection request: " + data[mp.PIN] + ' ' + data[mp.NAME]);
			
			if(data[mp.PIN] === pin) {
				var name = data[mp.NAME];
				if(!name) {
					name = socket.id;
				}
				var idx = players.indexOf(name);
				if(idx > -1) {
					socket.emit(mp.ERROR, mp.NAME);
				} else {
					socket.set('name', name, function(err) {
						if (err) { throw err; }
						players.push(name);
						gameSocket.emit(mp.NEWPLAYER, name);
						socket.emit(mp.NEWPLAYER, name);
					});
				}
				
			} else {
				console.log("Game context " + data[mp.PIN] + " not found.")
			}
		});

		socket.on('disconnect', function () {
			// the player left
			socket.get('name', function(err, data) {
				if(err) { throw err; }
				// @TODO: duplicate code
				console.log('Player: ' + data + ' left the game');
				var idx = players.indexOf(data);
				if(idx > -1) {
					players.splice(idx,1)[0];
					gameSocket.emit(mp.REMOVEPLAYER, data);
				}
			});
		});

		socket.emit(mp.IDENTIFY);
	});

};

sg.on('connection', function(socket) {

	socket.on(mp.NEWSCREEN, function() {
		// joining as a screen brings no data
		var pin_str = (pin++).toString(); // @TODO: generate new pin
		console.log("Screen connection request. Pin: " + pin_str);
		newGameContext(pin_str, socket);
		socket.emit(mp.SCREENINFO, pin_str);
	});

	console.log('New connection request.');
	socket.emit(mp.IDENTIFY);

});