
// var TO_RADIANS = Math.PI / 180; 

function ImageParticle(img, posx, posy) {

	// the position of the particle
	this.posX = posx; 
	this.posY = posy; 
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	
	// multiply the particle size by this every frame
	this.shrink = 1; 
	this.size = 1; 
	
	// if maxSize is a positive value, limit the size of 
	// the particle (this is for growing particles).
	this.maxSize = 2;
	
	// multiply the velocity by this every frame to create
	// drag. A number between 0 and 1, closer to one is 
	// more slippery, closer to 0 is more sticky. values
	// below 0.6 are pretty much stuck :) 
	this.drag = 1; 
	
	// add this to the yVel every frame to simulate gravity
	this.gravity = 0; 
	
	// current transparency of the image
	this.alpha = 1; 
	// subtracted from the alpha every frame to make it fade out
	this.fade = 0; 
	
	// the blendmode of the image render. 'source-over' is the default
	// 'lighter' is for additive blending.
	this.compositeOperation = 'source-over';

	// the image to use for the particle. 
	this.img = img; 

	this.update = function() {

		// simulate drag
		this.velX *= this.drag; 
		this.velY *= this.drag;
		
		// add gravity force to the y velocity 
		this.velY += this.gravity; 
		
		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY; 
		
		// Mouse attraction
		var mouseDistance = distanceBetween(this.posX, this.posY, mouseX, mouseY);
		if(mouseDistance < 10){
			this.posX += (this.posX - mouseX) / 10;
			this.posY += (this.posY - mouseY) / 10;				
		} else if(mouseDistance < 40){
			this.posX -= (this.posX - mouseX) / 20;
			this.posY -= (this.posY - mouseY) / 20;				
		} else if(mouseDistance < 75){
			this.posX -= (this.posX - mouseX) / 200;
			this.posY -= (this.posY - mouseY) / 200;				
		} else if(mouseDistance < 200){
			this.posX -= (this.posX - mouseX) / 500;
			this.posY -= (this.posY - mouseY) / 500;				
		}

		// Left attractor
		var leftAttractorX = 100,
			leftAttractorY = HALF_HEIGHT,
			leftAttractorDistance = distanceBetween(this.posX, this.posY, leftAttractorX, leftAttractorY);

		if(leftAttractorDistance < 50){
			this.posX -= (this.posX - leftAttractorX) / 20;
			this.posY -= (this.posY - leftAttractorY) / 20;				
		} else if(leftAttractorDistance < 200){
			this.posX -= (this.posX - leftAttractorX) / 200;
			this.posY -= (this.posY - leftAttractorY) / 200;				
		} else if(leftAttractorDistance < HALF_WIDTH){
			this.posX -= (this.posX - leftAttractorX) / 500;
			this.posY -= (this.posY - leftAttractorY) / 500;				
		}
		
		// Right attractor
		var rightAttractorX = SCREEN_WIDTH - 100,
			rightAttractorY = HALF_HEIGHT,
			rightAttractorDistance = distanceBetween(this.posX, this.posY, rightAttractorX, rightAttractorY);

		if(rightAttractorDistance < 50){
			this.posX -= (this.posX - rightAttractorX) / 20;
			this.posY -= (this.posY - rightAttractorY) / 20;				
		} else if(rightAttractorDistance < 200){
			this.posX -= (this.posX - rightAttractorX) / 200;
			this.posY -= (this.posY - rightAttractorY) / 200;				
		} else if(rightAttractorDistance < HALF_WIDTH){
			this.posX -= (this.posX - rightAttractorX) / 500;
			this.posY -= (this.posY - rightAttractorY) / 500;				
		}		

		// shrink the particle
		this.size *= this.shrink;
		// if maxSize is set and we're bigger, resize!
		if((this.maxSize>0) && (this.size>this.maxSize))
			this.size = this.maxSize; 
		
		// and fade it out
		this.alpha -= this.fade; 	
		if(this.alpha<0) this.alpha = 0; 
		
	 
	};
	
	this.render = function(c) {
	
		// if we're fully transparent, no need to render!
		if(this.alpha ==0) return;
		
		// save the current canvas state
		c.save(); 
		
		// move to where the particle should be
		c.translate(this.posX, this.posY);

		// scale it dependent on the size of the particle
		var s = this.shimmer ? this.size * randomRange(.5,1) : this.size; //this.shimmer ? this.size * 0 : this.size; 
		c.scale(s,s);

		// move the draw position to the center of the image
		c.translate(img.width*-0.5, img.width*-0.5);
		
		// set the alpha to the particle's alpha
		c.globalAlpha = this.alpha; 
		
		// set the composition mode
		c.globalCompositeOperation = this.compositeOperation;
				
		// and draw it! 
		c.drawImage(img,0,0);
		
		// and restore the canvas state
		c.restore();
					
	};


}


function randomRange(min, max) {
	return ((Math.random()*(max-min)) + min); 
}

function distanceBetween(x1, y1, x2, y2) {
	var dx = x1-x2;
	var dy = y1-y2;
	return Math.sqrt(dx*dx + dy*dy);
}