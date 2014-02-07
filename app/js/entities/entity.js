/* Entity */

var Entity = function (spec) {
	var that;

	if (!spec.eid) {
		throw(new Error("Cannot create entities without id"));
	};

	var eid = spec.eid;
	var ename = spec.ename || '';
	var ecomponents = spec.ecomponents || [];

	that.getEid = function () {
		return eid;
	};

	that.getName = function () {
		return ename;
	};

	that.getComponents = function () {
		return ecomponents;
	};

	that.getComponentByType = function (value) {
		// Check if entity has component and return it
	};

	that.removeComponent = function (value) {
		return ecomponents.pop(values);
	};

	that.addComponent = function (value) {
		ecomponents.push(value);
	};

	return that;
};

