var mp = (function () {
	var that = {};
	var socketPort = 5000;
	var socketEndPoint = '/sg'

	/*
	 * Commands
	 */

	// game session
	that.IDENTIFY = 'l';
	that.END = 'e'; // fired when game disconnected
	that.ERROR = 'q';
	
	// components creation
	that.NEWSCREEN = 'ns'
	that.NEWPLAYER = 'np';
	that.REMOVEPLAYER = 'rp';

	// info
	that.SCREENINFO = 'si';
	that.PLAYERINFO = 'pi';

	

	/*
	 * Values
	 */

	// game session
	that.PIN = 'p';
	that.NAME = 'n';
	that.DATA = 'd';

	// gameplay
	that.CCW =  'l';
	that.CW =  'r';
	that.CCWON =  'lt';
	that.CWON =  'rt';
	that.CCWOFF =  'lf';
	that.CWOFF =  'rf';
	that.THRUSTON = 'ty';
	that.THRUSTOFF = 'tn';
	that.FIRE = 'f';
	// gameplay
	that.STAMINA = 'b';
	that.SCORE = 's';
	that.COMMAND = 'c';

	return that;
}());

if(typeof module != 'undefined') {
	module.exports = mp;
}