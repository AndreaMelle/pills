var C_Frame = function(spec) {
	var that = {};

	var id = spec.id || null; // frame id as specified in json file
	var name = spec.name || null; // frame name as specified in json file

	// optionally specify a value to scale all quantities at creation time
	var scale = spec.scale || 1;

	// crop data is to extract sprite image from sprite sheet
	var cropX = (spec.cropX || 0) / scale;
	var cropY = (spec.cropY || 0) / scale;
	var cropW = (spec.cropW || 0) / scale;
	var cropH = (spec.cropH || 0) / scale;

	// anchor (center) of sprite in sprite local coord system
	// usually not where to start cropping, that's top left corner
	var anchorX = (spec.anchorX || (cropW / 2.0) ) / scale;
	var anchorY = (spec.anchorY || (cropH / 2.0) ) / scale;

	/* We don't allow to set frame quantities after creation */

	that.getId = function () {
		return id;
	};

	that.getName = function () {
		return name;
	};

	that.getCropX = function () {
		return cropX;
	};

	that.getCropY = function () {
		return cropY;
	};

	that.getCropW = function () {
		return cropW;
	};

	that.getCropH = function () {
		return cropH;
	};

	that.getAnchorX = function () {
		return anchorX;
	};

	that.getAnchorY = function () {
		return anchorY;
	};

	return that;
};

/* Sprite component */
var C_Sprite = function(spec) {

	var that = {};

	// the associated sprite sheet
	// use as SpriteManager.getSheet(sprite.getSheetId())
	var sheetId = spec.sheetId || null;
	var id = spec.id || null; // sprite id as specified in json file
	var name = spec.name || null; // sprite name as specified in json file
	var frames = [];

	var currentFrameIdx = null;
	var framesById = {}; // frames lookup table by id
	var framesByName = {}; // frames lookup table by name

	for (var i = 0; i < spec.frames.length; i++) {
		var frame = spec.frames[i];
		framesById[frame.id] = i;
		framesByName[frame.name] = i;
		frames.push(Object.create(FrameComponent(frame)))
	};

	that.setFrame(0);

	/* We don't allow to set frame quantities after creation */

	that.getId = function () {
		return id;
	};

	that.getName = function () {
		return name;
	};

	that.getCurrentFrame = function() {
		return frames[currentFrameIdx];
	};

	that.setCurrentFrame = function (value) {
		if (framesById[value] !== undefined) {
			currentFrameIdx = framesById[value];
		} else if (framesByName[value] !== undefined) {
			currentFrameIdx = framesByName[value]
		} else {
			throw(new Error('Unknown frame.'));
		}
	};
	

	return that;
};