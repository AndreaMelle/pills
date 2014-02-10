/******************/
/* ResourceLoader */
/******************/

var ResourceLoader = (function () {

	var that = {}
	
	that.loadImage = function (url, cb) {
		var img = new Image();
		img.onload = function () {
			Assets.setTri(img);
			cb();
		};
		img.src = url;
	};
	
	return that;
	
}());