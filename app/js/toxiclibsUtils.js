var Rect = toxi.geom.Rect;
var Vec2D = toxi.geom.Vec2D;
var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
var VerletParticle2D = toxi.physics2d.VerletParticle2D;
var AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior;
var ConstantForceBehavior = toxi.physics2d.behaviors.ConstantForceBehavior;
var RectConstraint = toxi.physics2d.constraints.RectConstraint;

Math.CS_INSIDE = 0;
Math.CS_LEFT = 1;
Math.CS_RIGHT = 2;
Math.CS_BOTTOM = 4;
Math.CS_TOP = 8;

Math.getRotFromTwoPoints = function(p0, p1) {

	var a = p1.y - p0.y;
	var b = p1.x - p0.x;
	var c = Math.sqrt( a*a + b*b );

	if (c == 0) {
		return {cos : 1, sin : 0};
	}

	var sin = a / c;
	var cos = b / c;

	return {cos : cos, sin : sin};
};

Math.rotate = function (px, py, rot) {
	var x = px * rot.cos - py * rot.sin;
	var y = px * rot.sin + py * rot.cos;
	return {x : x, y : y};
};

Math.computeCsCode = function (px, py, box) {
	var code = Math.CS_INSIDE;
	if (px < box.xmin) {
		code = code | Math.CS_LEFT;
	}
	else if (px > box.xmax) {
		code = code | Math.CS_RIGHT;
	}
	if (py < box.ymin) {
		code = code | Math.CS_BOTTOM;
	}
	else if (py > box.ymax) {
		code = code | Math.CS_TOP;
	}
	return code;
};

Math.checkLineBoxIntersect = function (_p0, _p1, box) {
	var p0 = _p0; var p1 = _p1;
	var outcode0 = Math.computeCsCode(p0.x, p0.y, box);
	var outcode1 = Math.computeCsCode(p1.x, p1.y, box);

	var accept = false;

  	while (true) {
		if (0 == (outcode0 | outcode1)) {
			accept = true;
			break;
		}
		else if ((outcode0 & outcode1) > 0) {
			break;
		} 
		else {
			var x = 0;
			var y = 0;

			var outcodeOut = outcode1;
			if (outcode0 > 0) {
				outcodeOut = outcode0;
			}

			if ( (outcodeOut & Math.CS_TOP) > 0) {
				x = p0.x + (p1.x - p0.x) * (box.ymax - p0.y) / (p1.y - p0.y);
				y = box.ymax;
			} 
			else if ((outcodeOut & Math.CS_BOTTOM) > 0) {
				x = p0.x + (p1.x - p0.x) * (box.ymin - p0.y) / (p1.y - p0.y);
				y = box.ymin;
			} 
			else if ((outcodeOut & Math.CS_RIGHT) > 0) {
				y = p0.y + (p1.y - p0.y) * (box.xmax - p0.x) / (p1.x - p0.x);
				x = box.xmax;
			} 
			else if ((outcodeOut & Math.CS_LEFT) > 0) {
				y = p0.y + (p1.y - p0.y) * (box.xmin - p0.x) / (p1.x - p0.x);
				x = box.xmin;
			}

			if (outcodeOut === outcode0) {
				p0.x = x;
				p0.y = y;
				outcode0 = Math.computeCsCode(p0.x, p0.y, box);
			} 
			else {
				p1.x = x;
				p1.y = y;
				outcode1 = Math.computeCsCode(p1.x, p1.y, box);
			}
		}
	}
	
	return {
		'accept' : accept,
		'p0' : p0,
		'p1' : p1	
	};

};

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
};

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
};

Math.checkLineCircleIntersect = function (p0, p1, c, r) {
	var m = Math.orthoLine(p0.x, p0.y, p1.x, p1.y);
	var i = c.y;
	if(m) {
		i -= m * c.x;
	}

	var intersect = Math.intersectLines(
		p0.x, p0.y, p1.x, p1.y,
		c.x, c.y, 0, i);

	if(!intersect) {
		return false;
	}

	var distsq = (c.x - intersect.x)*(c.x - intersect.x) + (c.y - intersect.y)*(c.y - intersect.y);

	if (distsq <= r*r) {
		return true;
	}

	return false;
};

Math.checkPointCircleIntersect = function(p0, c, r) {

	var distsq = (p0.x - c.x)*(p0.x - c.x) + (p0.y - c.y)*(p0.y - c.y);
	if (distsq <= r*r) {
		return true;
	}

	return false;
};

Math.checkPointBoxIntersect = function(p0, box) {

	if(p0.x > box.xmin && p0.x < box.xmax && p0.y > box.ymin && p0.y < box.ymax) {
		return true;
	}

	return false;
};


