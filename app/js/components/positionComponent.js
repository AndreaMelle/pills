/* Position component 
 * Usaage: var p = PositionComponent({x:'x', y: 'y', rot:'rot'});
 */
var C_Position = function(spec) {

	var that = {};
	var x = spec.x || 0;
	var y = spec.y || 0;
	var rot = spec.rot || 0;

	var minX = spec.minX || RenderSystem.minX();
	var maxX = spec.maxX || RenderSystem.maxX();
	var minY = spec.minY || RenderSystem.minY();
	var maxY = spec.maxY || RenderSystem.maxY();

	that.getX = function () {
		return x;
	};

	that.setX = function (value) {
		x = value;
	};

	that.getY = function () {
		return y;
	};

	that.setY = function () {
		y = value;
	};

	that.getRot = function () {
		return rot;
	};

	that.setRot = function (value) {
		rot = value;
	};

	that.getMinX = function () {
		return minX;
	};

	that.setMinX = function (value) {
		minX = value;
	};

	that.getMaxX = function () {
		return maxX;
	};

	that.setMaxX = function (value) {
		maxX = value;
	};

	that.getMinY = function () {
		return minY;
	};

	that.setMinY = function (value) {
		minY = value;
	};

	that.getMaxY = function () {
		return maxY;
	};

	that.setMaxY = function (value) {
		maxY = value;
	};

	return that;
};