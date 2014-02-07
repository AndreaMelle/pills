/* Collidable component
 *
 * Defines the shape of an object for collision computation
 * If proxy type is circle, width and height should be kept equal (diameter)
 */
 
var C_Collidable = function(spec) {

	var that = {};

	that.PROXY_POINT = 0; // maybe for particles and bullets.
	that.PROXY_CIRCLE = 1;
	that.PROXY_BOX = 2;

	var width = spec.width || 0;
	var height = spec.height || 0;
	var proxyType = (spec.proxyType >= 0 && spec.proxyType < 3) ? spec.proxyType : that.PROXY_POINT;

	that.getWidth = function () {
		return width;
	};

	that.setWidth = function (value) {
		width = value;
	};

	that.getHeight = function () {
		return height;
	};

	that.setHeight = function () {
		height = value;
	};

	that.getProxyType = function () {
		return proxyType;
	};

	that.setProxyType = function (value) {
		if (value >= 0 && value < 3) {
			proxyType = value;
		} else {
			throw(new Error('Unknown proxy type.'))
		}
	};

	return that;
};

/* Collision component
 * Keep tracks of one collision between two objects
 * Only offer constructor and getter, it's non-mutable
 */

var C_Collision = function(spec) {

	var that = {};

	var collider1 = spec.collider1 || null;
	var collider2 = spec.collider2 || null;
	var x = spec.x || 0;
	var y = spec.y || 0;

	that.getCollider1 = function () {
		return collider1;
	};

	that.getCollider2 = function () {
		return collider2;
	};

	that.getX = function () {
		return x;
	};

	that.getY = function () {
		return y;
	};

	return that;
};

