/**********/
/* Sprite */
/**********/

var Sprite = function (from) {
	this.framesById = null;
	this.framesByName = null;
	this.currentFrameIdx = null;
	
	var i;
	for (i in from) {
		if (from.hasOwnProperty(i) && typeof from[i] !== "function") {
			this[i] = from[i];
		}
	}
	
	this.framesById = {};
	this.framesByName = {};
	
	var scale = SpriteManager.getScale();
	
	for (var i = 0; i < this.frames.length; i++) {
		this.framesById[this.frames[i].id] = i;
		this.framesByName[this.frames[i].name] = i;
		
		this.frames[i].crop.x = this.frames[i].crop.x / scale;
		this.frames[i].crop.y = this.frames[i].crop.y / scale;
		this.frames[i].crop.w = this.frames[i].crop.w / scale;
		this.frames[i].crop.h = this.frames[i].crop.h / scale;
		this.frames[i].proxy.x = this.frames[i].proxy.x / scale;
		this.frames[i].proxy.y = this.frames[i].proxy.y / scale;
		this.frames[i].proxy.w = this.frames[i].proxy.w / scale;
		this.frames[i].proxy.h = this.frames[i].proxy.h / scale;
		this.frames[i].anchor.x = this.frames[i].anchor.x / scale;
		this.frames[i].anchor.y = this.frames[i].anchor.y / scale;
	}
	
	this.setFrame(0);
};

Sprite.prototype = new DrawableComponent();

Sprite.method('setFrame', function (frame) {
	if (this.framesById[frame] !== undefined) {
		this.currentFrameIdx = this.framesById[frame];
	} else if (this.framesByName[frame] !== undefined) {
		this.currentFrameIdx = this.framesByName[frame]
	} else {
		throw(new Error('Unknown frame.'));
	}
});

Sprite.method('getFrame', function () {
	return this.frames[currentFrameIdx];
});

Sprite.method('getProxy', function (frame) {
	return this.getFrame(frame).proxy;
});

Sprite.method('draw', function (ctx) {

	var angleInRadians = this.rotation * Math.PI / 180;
	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.translate(this.x, this.y);
	ctx.rotate(angleInRadians);
	ctx.scale(this.scale, this.scale);
	
	ctx.rotate(+Math.PI / 2.0);
	
	if (Context.drawSprite) {
		this.drawSprite(ctx);
	}
	
	if (Context.drawBBox) {
		this.drawBBox(ctx);
	}
	
	if (Context.drawProxy) {
		this.drawProxy(ctx);
	}
	
	ctx.rotate(-Math.PI / 2.0);
	
	if (Context.drawLineArt) {
		this.drawLineArt(ctx);
	}
	
	ctx.restore();
});

Sprite.method('drawLineArt', function (context) {});

Sprite.method('drawSprite', function (ctx) {
		
	var c = this.frames[this.currentFrameIdx].crop;
	var a = this.frames[this.currentFrameIdx].anchor;
	
	ctx.drawImage(SpriteManager.getSheet(),
		c.x - c.w / 2, c.y - c.h / 2,
		c.w, c.h,
		 -a.x, -a.y,
		c.w, c.h
	);
});

Sprite.method('drawBBox', function (ctx) {
		
	var c = this.frames[this.currentFrameIdx].crop;
	var a = this.frames[this.currentFrameIdx].anchor;
	
	ctx.beginPath();
	ctx.lineWidth="1";
	ctx.strokeStyle="red";
	ctx.rect(-a.x,-a.y,c.w,c.h); 
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.arc(0,0, 3, 0, 2 * Math.PI, false);
  	ctx.fill();
	ctx.closePath();
});

Sprite.method('drawProxy', function (ctx) {
	var c = this.frames[this.currentFrameIdx].proxy;
		
	ctx.beginPath();
	ctx.lineWidth="1";
	ctx.strokeStyle="green";
	if (c.type === 'box') {
		ctx.rect( - c.w / 2, - c.h / 2,c.w,c.h);	
	} else if (c.type === 'circle') {
		ctx.arc(0, 0, (c.w + c.h) / 4, 0, 2 * Math.PI, false);
	} else {
		throw( new Error('Unknown proxy type.'));	
	}
	
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.fillStyle = 'green';
	ctx.arc(0, 0, 3, 0, 2 * Math.PI, false);
  	ctx.fill();
	ctx.closePath();
});

/*****************/
/* SpriteManager */
/*****************/

var SpriteManager = (function () {

	var my = {};
	
	var sheetJsonFile = 'art/spritesheet.json';
	var sheet = null;
	var sheetInfo = null;
	var sheetTab = {};
	
	my.load = function (fn, context) {
	
		var onSheetJson = function () {
			
			ResourceLoader.flushCallbacks();
			
			sheetInfo = ResourceLoader.get(sheetJsonFile);
			
			for (var i = 0; i < sheetInfo.sprites.length; i++) {
				var s = new Sprite(sheetInfo.sprites[i]);
				sheetTab[s.name] = s;
			}
			
			ResourceLoader.onReady(function() {
				ResourceLoader.flushCallbacks();
				sheet = ResourceLoader.get(sheetInfo.sheetFile);
				context[fn].call(context);
				
			});
			
			ResourceLoader.load(sheetInfo.sheetFile);
		};
		
		ResourceLoader.onReady(onSheetJson);
		ResourceLoader.load('art/spritesheet.json');
	};
	
	my.getScale = function () {
		if (sheetInfo) {
			return sheetInfo.sheetScale;
		} else {
			throw(new Error('SheetInfo not loaded.'));
		}
	};
	
	my.getSheet = function () {
		if (sheet) {
			return sheet;
		} else {
			throw(new Error('Sheet not loaded.'));
		}
	};
	
	my.getSprite = function (name) {
		if (sheetTab.hasOwnProperty(name)) {
			return sheetTab[name];
		} else {
			throw(new Error('Sprite ' + name + ' not found.'));
		}
	};
	
	return my;
	
}());