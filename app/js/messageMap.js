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
	
	// components creation
	that.NEWSCREEN = 'ns'
	that.NEWPLAYER = 'np';
	that.REMOVEPLAYER = 'rp';

	// info
	that.SCREENINFO = 'si';
	that.PLAYERINFO = 'pi';

	// gameplay
	that.STAMINA = 'b';
	that.SCORE = 's';
	that.COMMAND = 'c';

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
	that.THRUSTON =  'ty';
	that.THRUSTOFF =  'tn';
	that.FIRE =  'f';

	return that;
}());