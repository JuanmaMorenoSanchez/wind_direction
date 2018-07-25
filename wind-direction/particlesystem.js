var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
  this.img = particleImg;
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin, this.img));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};