/*
* MobileMe style particles
* by Lokesh Dhakar (http://lokeshdhakar.com)
* 
* See the much nicer original at: https://auth.me.com/authenticate?service=mail
* A lot of the core code was written by Seb Lee-Delisle (http://sebleedelisle.com).
*/


// Debugging
var SHOW_FORCES = false,
	SHOW_STATS = false;

var SLOW_BROWSER = ($.browser.mozilla || $.browser.msie)? true: false;

// screen size variables
var	SCREEN_WIDTH = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight,
	HALF_WIDTH = window.innerWidth / 2,
	HALF_HEIGHT = window.innerHeight / 2;

// canvas element and 2D context
  	canvas = document.createElement( 'canvas' ),
	context = canvas.getContext( '2d' ),
	container = document.createElement( 'div' );

 // Physix
	TO_RADIANS = Math.PI/180,
	TO_DEGREES = 180/Math.PI;

// Interaction
var mouseX = 0,
		mouseY = 0,
		mouseSpeed = 0,
		mouseDown = false;

// Particles
var particles = [],
		particleImage = new Image(),
		NEW_PARTICLE_RATE = 1,
		MAX_PARTICLES = 1000;

particleImage.src = 'img/mm_particle.png'

// forces
var forces = [],
		forceSets = [],
		activeForceSet = 0,
		forceTimer = 0; // Used to script force events
		
// The handling of force sets is not flexible at the moment. Refactor needed.
// First force in the set is centered and keeps the particles in the center for a bit
// before having it's mass reduced from 200 to 0. During that time, the 2nd and 3rd
// forces in the force set have their mass increased from to 20 to 0. This process is then 
// reversed and then the next forceset is loaded.
forceSets.push([  new Force(HALF_WIDTH, HALF_HEIGHT, 150),
									new Force(SCREEN_WIDTH/5, HALF_HEIGHT, 0),
								  new Force(SCREEN_WIDTH - SCREEN_WIDTH/5, HALF_HEIGHT/2, 0)]);

forceSets.push([  new Force(HALF_WIDTH, HALF_HEIGHT, 150),
									new Force(SCREEN_WIDTH/5, HALF_HEIGHT - HALF_HEIGHT/3, 0),
								  new Force(SCREEN_WIDTH - SCREEN_WIDTH/5, HALF_HEIGHT, 0)]);
		
/*
*	Setup canvas and forces
*/
function init() {

	// Canvas html setup
	document.body.appendChild(container);
	container.appendChild(canvas); 
	$(canvas).attr('id','particleCanvas');
	canvas.width = SCREEN_WIDTH; 
	canvas.height = SCREEN_HEIGHT;

	// Setup stats
	if(SHOW_STATS){
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild(stats.domElement);
	}

	// Create forces
    forces = forceSets[0].slice();

	// Set main loop to run at 30 fps
	setInterval(loop, 1000 / 30);

	// Setup interaction
	initMouseListeners(); 

}


/*
*	Main loop for render and update calls. Also clearing out of dead particles.
*/
function loop() {	

	// Debug force masses
/*	if(forceTimer%30 == 0){
		console.log(forceTimer + ' forces[1] ' + forces[1].mass);
		console.log('forces[1] ' + forces[1].mass);
		console.log('forces[2] ' + forces[2].mass);				
	}
*/
	forceTimer++;
	/*
	* Script to control the rate of particle creation and strength of forces.
	*/
	if(forceTimer == 1){
		forces[0].mass = 150;
		forces[1].mass = forces[2].mass = 0;
		if(forceTimer%2 == 0){
			makeParticle(1);
		}
	} else if(forceTimer < 100){
			forces[0].mass -=1.5;
			forces[1].mass = forces[2].mass += .1;
			makeParticle(1);
	} else if(forceTimer < 250){
			forces[1].mass = forces[2].mass += .2;
			makeParticle(2);
	} else if(forceTimer < 400){
			forces[0].mass += .33;
			forces[1].mass = forces[2].mass += .5;
	} else if(forceTimer < 500){
			forces[0].mass += 1;
			forces[1].mass = forces[2].mass -= 1;
			makeParticle(1);
	} else if(forceTimer = 550){
		 		toggleforceSet();
			forceTimer = 0;
	}

	// clear the canvas
	context.clearRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);

	// Make forces visible. For debugging.
	if(SHOW_FORCES){
		for (i=0; i<forces.length; i++) {
			var force = forces[i];
			force.render(context);
		}
	}

	// Check particle lifespans in loop. If dead, remove from array. 
	// Keep track of # removed because array will be shifting around.
	var deadParticleCount = 0;
  
	// iteratate through each particle
	for (i=0; i<particles.length; i++) {
		
		var particle = particles[i - deadParticleCount]; 

		// render it
		particle.render(context); 

		// and then update. We always render first so particle
		// appears in the starting point.
		particle.update();

		// Remove dead particle from array
		if(particle.lifespan == 0){
			particles.splice(i,1);
			deadParticleCount++;
		}
	}	

	// Keep taking the oldest particles away until we have 
	// fewer than the maximum allowed. 
	while(particles.length>MAX_PARTICLES){
		particles.shift();
	}

	if(SHOW_STATS){
		stats.update();			
	}
}



function makeParticle(particleCount) {

	for(var i=0; i<particleCount;i++) {

			// create a new particle in the middle of the stage
			var particle = new Particle(HALF_WIDTH, HALF_HEIGHT, particleImage); 

			// give it a random x and y velocity
			particle.velX = randomRange(-2,2);
			particle.velY = randomRange(-1.5,.25);
			particle.size = randomRange(.1,1.4);
			particle.gravity = 0; 
			particle.drag = 0.999;
			particle.shrink = 0.99; 
 			
			particle.alpha = .7; 
			particle.fade = 0.0015; 
			
			// sets the blend mode so particles are drawn with an additive blend
			particle.compositeOperation = 'lighter';

			// add it to the array
			particles.push(particle);

	}
}

function initMouseListeners() {
	$(document).bind('mousemove', onMouseMove);
	$(document).bind('mousedown', onMouseDown, false );
	$(document).bind('mouseup', onMouseUp, false );
}

function onMouseMove(e) {
	e.preventDefault();
//	xDiff = mouseX - e.clientX;
//	yDiff = mouseY - e.clientY;
//	mouseSpeed = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2));			
	mouseX = e.clientX;
	mouseY = e.clientY;
}

function onMouseDown(e) {
	mouseDown = true; 
}
function onMouseUp(e) {
	mouseDown = false; 
}

function toggleforceSet(){
	activeForceSet = (activeForceSet == 0)? 1: 0;
  forces = forceSets[activeForceSet].slice();
}

$(document).ready(function(){

	init();
 	if(SLOW_BROWSER){
		$('.browsers').show();
	}
	$('#loading').fadeOut(5000);
	
});