/******************/
/* ResourceLoader */
/******************/

var ResourceLoader = (function () {

	var my = {}
	
	var resourceCache = {};
	var loading = [];
	var readyCallbacks = [];
	
	var _getExtension = function (filename) {
		return filename.split('.').pop();
	};
	
	var _assignAndFire = function (url, content) {
		resourceCache[url] = content;	
    	if (ResourceLoader.isReady()) {
			readyCallbacks.forEach(function (func) { func(); });
		}
	};
	
	var _loadJSON = function(url) {   
	    var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
	    xobj.open('GET', url, true);
	    xobj.onreadystatechange = function () {
	        if (xobj.readyState == 4 && xobj.status == "200") {
	        	_assignAndFire(url, JSON.parse(xobj.responseText));
	        }
	    };
	    xobj.send(null);
	}
	
	var _loadImage = function (url) {
		var img = new Image();
		img.onload = function () {
			_assignAndFire(url, img);
		};
		resourceCache[url] = false;
		img.src = url;
	};
	
	var _load = function (url) {
		if (resourceCache[url]) {
			return resourceCache[url];
		} else {
			if (_getExtension(url) === 'png') {
				_loadImage(url);
			} else if (_getExtension(url) === 'json') {
				_loadJSON(url);
			} else {
				throw(new Error('Unknown file format.'));
			}
		}
	};
	
	my.load = function (urlOrArr) {
		if (urlOrArr instanceof Array) {
			urlOrArr.forEach( function(url) {
				_load(url);
			});
		} else {
			_load(urlOrArr);
		}
	};
	
	my.get = function (url) {
		return resourceCache[url];
	};
	
	my.onReady = function (func) {
		readyCallbacks.push(func);
	};
	
	// TODO: here we need options to register a once vs. forever callbacks
	my.flushCallbacks = function () {
		readyCallbacks = [];
	};
	
	my.isReady = function () {
		var ready = true;
		for (var k in resourceCache) {
			if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
				ready = false;
			}
		}
		return ready;
	};
	
	return my;
	
}());