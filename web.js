var express = require('express');
var logfmt = require('logfmt');
var app = express();

app.use(logfmt.requestLogger());

var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/app'));

app.listen(port, function() {
	console.log("Listening on " + port);
});