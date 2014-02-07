/* Ship entity */
var ShipEntity = function () {

	spec = {
		eid : UUID.get(),
		ename : 'ship',
		ecomponents : []
	};

	// add all components

	var that = Object.create(Entity(spec));
	return that;
};