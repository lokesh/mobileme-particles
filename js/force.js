function Force(posx, posy, mass) {

	this.posX = posx; 
	this.posY = posy; 
	this.mass = mass; 
	
	this.size = 5;
	
	// Make force visible. For debugging.
	this.render = function(c) {
	
		// set the fill style to have the right alpha
		c.fillStyle = "rgba(255,000,000,1)";
		
		// draw a circle of the required size
		c.beginPath();
		c.arc(this.posX, this.posY, this.size, 0, Math.PI*2);
		c.closePath();
		
		// and fill it
		c.fill();					
	};

}
