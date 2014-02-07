/* World 
 * The world is a container which creates and keep all entities.
 * The world ~corresponds to a level in a game
 * It is recycled, reset and re-initialized at the beginning of each level
 * Here it is modeled as a singleton, but multiple words could be allowed
 * @TODO: is this a manager, a system or simply something unique?
 */

 var World = (function () {
 	
 	var that = {};

 	var entities = new Array();

 	// @TODO: how to cache entities and components?

 	var ship = Object.create(ShipEntity());
 	entities.push(entities);

 	//ship.name
 	//ship.eid

 	// @TODO: go through all rock entities and make them explode if they're dead

 	// @TODO: go through all rock entities and make them split if they're dead

 	// @TODO: go through all rock entities and remove them if they are dead

 	//  @TODO: update all systems

 	return that;

 }());