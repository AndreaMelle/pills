var Rect = toxi.geom.Rect;
var Vec2D = toxi.geom.Vec2D;
var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
var VerletParticle2D = toxi.physics2d.VerletParticle2D;
var AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior;
var ConstantForceBehavior = toxi.physics2d.behaviors.ConstantForceBehavior;
var RectConstraint = toxi.physics2d.constraints.RectConstraint;

Math.lineSlope = function (x0, y0, x1, y1) {
	var den = (x1 - x0);
	if(den == 0) {
		return null;
	}
	var m = (y1 - y0) / den;
	return m;
};

Math.orthoLine = function (x0, y0, x1, y1) {
	return -Math.lineSlope(x0, y0, x1, y1);
};

Math.det = function (a, b, c, d) {
	return (a * d - b * c);
}

Math.intersectLines = function (x1, y1, x2, y2, x3, y3, x4, y4) {

	var m = Math.lineSlope(x1, y1, x2, y2);
	var i = y1;
	if(m) {
		i -= m * x1;
	}

	var num = Math.det(
		Math.det(x1,y1,x2,y2), (x1 - x2),
		Math.det(x3,y3,x4,y4), (x3 - x4));

	var den = Math.det(x1-x2, y1-y2, x3-x4, y3-y4);

	if (den == 0) {
		return null;
	}

	var x = num / den;
	var y = m * x + i;

	return {'x' : x, 'y' : y};
}


