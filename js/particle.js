function Particle(posx, posy, img) {

	// the position of the particle
	this.posX = posx; 
	this.posY = posy; 
	// the velocity 
	this.velX = 0; 
	this.velY = 0; 
	
	this.lifespan = 300;
	this.mass = 1;
	
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
	
	// Current transparency of the image
	this.alpha = 1; 

	// subtracted from the alpha every frame to make it fade out
	this.fade = 0; 
	
	// the blendmode of the image render. 'source-over' is the default
	// 'lighter' is for additive blending.
	this.compositeOperation = 'source-over';

	// the image to use for the particle. 
	this.img = img; 

	this.update = function() {

		// Slowly, but gently kill particle
		this.lifespan--;

		// simulate drag
		this.velX *= this.drag; 
		this.velY *= this.drag;
		
		// add gravity force to the y velocity 
		this.velY += this.gravity; 
		
		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY; 
		


	    for (var i = 0; i < forces.length; i++) {
	    	var force = forces[i];
			var xDiff = force.posX - this.posX;
			var yDiff = force.posY - this.posY;
			var force = (Math.sqrt(force.mass) / Math.sqrt(((xDiff*xDiff) + (yDiff*yDiff))))/8; 
			this.posX += xDiff * force;
			this.posY += yDiff * force;
		}

		// Mouse attraction
		// If mouse is near center (on top of cloud), disable mouse magnetism as it could
		// potentially keep all the particles behind cloud and confuse user.
		var distanceCenter = distanceBetween(HALF_WIDTH, HALF_HEIGHT, mouseX, mouseY);
		if(distanceCenter > 100){
			var mouseDistance = distanceBetween(this.posX, this.posY, mouseX, mouseY);
			if(mouseDistance < 10){
				this.posX += (this.posX - mouseX) / 10;
				this.posY += (this.posY - mouseY) / 10;
			} else if(mouseDistance < 50){
				this.posX -= (this.posX - mouseX) / 20;
				this.posY -= (this.posY - mouseY) / 20;				
			} else if(mouseDistance < 100){
				this.posX -= (this.posX - mouseX) / 200;
				this.posY -= (this.posY - mouseY) / 200;				
			} else if(mouseDistance < 200){
				this.posX -= (this.posX - mouseX) / 500;
				this.posY -= (this.posY - mouseY) / 500;				
			}
		}

		// shrink the particle
		this.size *= this.shrink;

		// if maxSize is set and we're bigger, resize!
		if((this.maxSize>0) && (this.size>this.maxSize)){
			this.size = this.maxSize; 
		}
		
		// fade particle
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
		c.scale(this.size, this.size);

		// move the draw position to the center of the image
		c.translate(img.width*-0.5, img.width*-0.5);
		
		// set the alpha to the particle's alpha
	 	if(!$.browser.mozilla && !$.browser.msie){
			c.globalAlpha = this.alpha; 
		}
		
		// set the composition mode
		c.globalCompositeOperation = this.compositeOperation;
				
		// and draw it! 
		c.drawImage(img,0,0);
		
		// and restore the canvas state
		c.restore();
					
	};

}