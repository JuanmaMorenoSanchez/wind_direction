// A simple Particle class
var Particle = function(position, img) {
	this.acceleration = createVector(sin(radians(windRad))/200, (cos(radians(windRad))/200)*nasdaqPerf);
	this.velocity = createVector(random(-1, 1), random(-1, 0));
	this.position = position.copy();
	this.lifespan = 1000;
	this.texture = img;
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
  stroke(200, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};