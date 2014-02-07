/* Animation system */

var S_Animation = function () {

	/* Not sure what is this thing doing:
	 * The idea would be that in each entity we could bind some parameters
	 * and their values to certan key frames like
	 * when('thrust').is('on').set('currentFrame').to('thrustOn');
	*/ 

	/*
	* Shoudl this system also manages real animation, tweening and stuff??
	*/

};

/* Render system */

var S_Render = function () {

	var that = {};

	var drawSprite = function (frame) {
		ctx.drawImage(
			SpriteManager.getSheet(),
			frame.getCropX() - frame.getCropW() / 2,
			frame.getCropY - frame.getCropH() / 2,
			frame.getCropW(),
			frame.getCropH(),
			-frame.getAnchorX(),
			-frame.getAnchorY(),
			frame.getCropW(),
			frame.getCropH()
		);
	};

	var drawBoundingBox = function () {
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "red";
		ctx.rect(-frame.getAnchorX(),-frame.getAnchorY(),frame.getCropW(),frame.getCropH());
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.arc(0,0, 3, 0, 2 * Math.PI, false);
	  	ctx.fill();
		ctx.closePath();
	};

	var drawCollisionProxy = function (proxy) {
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "green";
		if (proxy.getProxyType === CollidableComponent.PROXY_BOX) {
			ctx.rect(-proxy.getWidth() / 2, - proxy.getHeight() / 2,proxy.getWidth(),proxy.getHeight());
		} else if (proxy.getProxyType === CollidableComponent.PROXY_CIRCLE) {
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
	};

	var update = function () {
		for (entity in entities) {
			var eid = entity.getId();
			var p = positionComponents[eid];
			var v = velocityComponents[eid];
			var f = forcesComponents[eid];
			var c = collidablesComponents[eid];
			var s = spriteComponents[eid];

			p.x + this.halfWidth (?)
			p.y + this.halfHeight (?)
			//p.scale

			// @TODO: where to put the logic that choose the frame??
			s.setFrame(?);

			var angleInRadians = p.rot * Math.PI / 180;
			var ctx = RenderSystem.getCtx();

			ctx.save();
			ctx.setTransform(1,0,0,1,0,0);
			ctx.translate(p.x, p.y);
			ctx.rotate(angleInRadians);
			//ctx.scale(p.scale, p.scale);
			
			var frame = s.getCurrentFrame();

			if (RenderSystem.drawSprite) {	
				drawSprite(frame);
			}
			
			if (Context.drawBBox) {
				this.drawBBox(ctx);
			}
			
			if (Context.drawProxy) {
				this.drawProxy(ctx);
			}
			
			if (Context.drawLineArt) {
				this.drawLineArt(ctx);
			}
			
			ctx.restore();



		}
	};

	return that;

};