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

function draw() {
  background(0);
  ellipse(mouseX, mouseY, pmouseX, pmouseY);
  noFill();
  stroke(255);
}
