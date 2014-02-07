/************************/
/* Sprite Sheet Manager */
/************************/

var M_Spritesheet = (function () {

	var my = {};
	
	var jsonFile = 'art/spritesheet.json';
	var spritesheetImg = null;
	var spritesheetData = null;
	
	my.load = function (fn, context) {
	
		var onJsonFileLoaded = function () {
			
			ResourceLoader.flushCallbacks();
			
			spritesheetData = ResourceLoader.get(jsonFile);
			
			for (var i = 0; i < spritesheetData.sprites.length; i++) {
				//var s = new Sprite(spritesheetData.sprites[i]);
				//sheetTab[s.name] = s;
			}
			
			ResourceLoader.onReady(function() {
				ResourceLoader.flushCallbacks();
				spritesheetImg = ResourceLoader.get(spritesheetData.sheetFile);
				context[fn].call(context);
				
			});
			
			ResourceLoader.load(spritesheetData.sheetFile);
		};
		
		ResourceLoader.onReady(onJsonFileLoaded);
		ResourceLoader.load('art/spritesheet.json');
	};
	
	my.getScale = function () {
		if (spritesheetData) {
			return spritesheetData.sheetScale;
		} else {
			throw(new Error('Spritesheet data not loaded.'));
		}
	};
	
	my.getSheet = function () {
		if (spritesheetImg) {
			return spritesheetImg;
		} else {
			throw(new Error('Spritesheet not loaded.'));
		}
	};
	
	return my;
	
}());