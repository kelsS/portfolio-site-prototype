var canvas;

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function setup() { 
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0,0);
	canvas.style('z-index', '-2');
	frameRate(30);

}

var canvas;
var dots = [];

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	canvas.style('z-index', '-1');
	canvas.style('background', '#000');

	for (var i = 0; i < 100; i++) {
		dots[i] = new Dot(random(width), random(height));
	}
}

function draw() {
	for (var i = 0; i < dots.length; i++) {
		dots[i].run(dots);
	}
	
}

function Dot(x,y) {
	this.acceleration = createVector(0, 0);
	this.velocity = p5.Vector.random2D();
	this.position = createVector(x, y);
	this.r = 3.0;
	this.maxspeed = 2;    
	this.maxforce = 0.05; 
}

Dot.prototype.run = function(dots) {
  this.flock(dots);
  this.update();
  this.borders();
  this.render();
}


Dot.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}


Dot.prototype.flock = function(dots) {
  var sep = this.separate(dots); 
  var ali = this.align(dots);    
  var coh = this.cohesion(dots); 
  sep.mult(3.5);
  ali.mult(2.0);
  coh.mult(1.8);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}


Dot.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  this.acceleration.mult(0.0);
}

Dot.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position); 
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  return steer;
}

Dot.prototype.render = function() {
  fill(0, 0, 128);
  stroke(0, 255, 255);
  ellipse(this.position.x, this.position.y, 18, 18);
}

Dot.prototype.borders = function() {
  if (this.position.x < -this.r) this.position.x = width + this.r;
  if (this.position.y < -this.r) this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

Dot.prototype.separate = function(dots) {
  var desiredseparation = 30.0;
  var steer = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < dots.length; i++) {
    var d = p5.Vector.dist(this.position, dots[i].position);
  
    if ((d > 0) && (d < desiredseparation)) {
      var diff = p5.Vector.sub(this.position, dots[i].position);
      diff.normalize();
      diff.div(d); 
      steer.add(diff);
      count++;
    }
  }

  if (count > 0) {
    steer.div(count);
  }

 
  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

Dot.prototype.align = function(dots) {
  var neighbordist = 60;
  var sum = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < dots.length; i++) {
    var d = p5.Vector.dist(this.position, dots[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(dots[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

Dot.prototype.cohesion = function(dots) {
  var neighbordist = 60;
  var sum = createVector(0, 0); 
  var count = 0;
  for (var i = 0; i < dots.length; i++) {
    var d = p5.Vector.dist(this.position, dots[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(dots[i].position); 
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);
  } else {
    return createVector(0, 0);
  }
}





