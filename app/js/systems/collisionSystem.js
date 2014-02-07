/* Collision system */

var S_Collision = function () {

	var that = {};

	var eid1 = null;
	var eid2 = null;
	var pos1 = null;
	var pos2 = null;
	var col1 = null;
	var col2 = null;
	var x = 0;
	var y = 0;

	var events = null;

	var bboxIntersection = function (p1, p2, c1, c2) {
		
		if (p1.getY() + c1.getHeight() < p2.getY()
			|| p1.getY() > p2.getY() + c2.getHeight
			|| p1.getX() + c1.getWidth() < p2.getX()
			|| p1.getX() > p2.getX() + c2.getWidth()) {

			return false;
		}

		return true;
	};

	var checkCollisions = function () {

		events = new Array();

		for (e1 in entities) {

			eid1 = e1.getId();
			pos1 = positionComponents[eid1];
			col1 = collidablesComponents[eid1];

			if (!pos1 || !col1) {
				continue
			};

			for (e2 in entities) {

				eid2 = e2.getId();

				if (eid1 === eid2) {
					continue;
				}

				pos2 = positionComponents[eid2];
				col2 = collidablesComponents[eid2];

				if (!pos2 || !col2) {
					continue
				};

				if (bboxIntersection(pos1, pos2, col1, col2)) {
					events.push(Object.create(C_Collision({
						collider1 : eid1,
						collider2 : eid2,
						x : (pos1.x + pos2.x) / 2,
						y : (pos1.y + pos2.y) / 2
					})));
				}

			}
		}

		/* @TODO: to risolve overlapping?
		 * we don't fire as soon as the collision is detected,
		 * but we wait to collect all collisions
		 * allows us to implement a more complex collision solver in the future
		 */

		for (e in events) {
			entities[e.collider1].addComponent(e);
			entities[e.collider2].addComponent(e);
		};
	};

	var checkBorder = function () {

		/*
		 * This is probably wrong.
		 * The collision system should here add a collision component
		 * Which will be then handled by position system and so on.
		 */

		for (e in entities) {
			eid1 = e.getId();
			pos1 = positionComponents[eid1];
			col1 = collidablesComponents[eid1];

			if (pos1 && col1) {
				
				x = pos1.getX();
				y = pos1.getY();

				if (x > pos1.getMaxX()) {
					x = pos1.getMinX() - col1.getWidth();
				} else if (x < pos1.getMinX()- col1.getWidth()) {
					x = pos1.getMaxX();
				}
				
				if (y > pos1.MaxY()) {
					y = pos1.MinY() - col1.getHeight();
				} else if (y < pos1.MinY() - col1.getHeight()) {
					y = pos1.MaxY();
				}

				pos1.setX(x);
				pos1.setY(y);
			}
	};

	that.update = function () {
		checkCollisions();
		checkBorder();
	};

	return that;
};