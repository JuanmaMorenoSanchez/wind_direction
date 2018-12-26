// A simple Particle class
var Particle = function(position, img) {
	this.acceleration = createVector((sin(radians(windRad))/50), (cos(radians(windRad))/200)-nasdaqPerf/100);
	this.velocity = createVector(random(-1, 1), random(-1, 0));
	this.position = position.copy();
	this.lifespan = 600;
	this.texture = img;
	this.size = random(30, 120);
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  if (this.lifespan < 255){
	tint(255, this.lifespan);
  } 
  image(
	this.texture, 
	this.position.x,
	this.position.y,
	//this.position.x+round(random(-12,12)), 
	//this.position.y+round(random(-12,12)), 
	this.size, 
	this.size
  );
  
  noTint();
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};