var pg1;
var pg2;

var balls = [];
var particles = [];

var xoff = 0.0;

xoff = xoff + .1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg1 = createGraphics(windowWidth, windowHeight);
	// pg2 = createGraphics(windowWidth, windowHeight/5*4);
}
function draw() {
  background(255);
  pg1.background(50);
	// pg2.background(50);
	image(pg1, 100, 100, windowWidth/3, windowWidth/3);
	image(pg1, windowWidth/2, 100, windowWidth/3, windowWidth/3);


	var target = createVector(mouseX, mouseY);
	for(i = 0; i < balls.length; i++) {
		balls[i].arrive(target);
		balls[i].separate(balls);
		//
		balls[i].update();
		balls[i].display();
		balls[i].clean();
	}

	for (var i = 0; i < particles.length; i++) {
    var gravity = createVector(0, 0.1 * particles[i].mass );
    particles[i].applyForce(gravity);

    var target = createVector(mouseX, height)
    particles[i].arrive(target);


    particles[i].update();
    particles[i].edges();
    particles[i].display();
		particles[i].clean();
  }
}

function mouseDragged() {
	if ((mouseX + mouseY) % 10 == 0 ) {
		if(mouseX < windowWidth/2){
			balls.push(new Ball(mouseX, mouseY));
		}
		else {
			particles.push(new Particle(mouseX, mouseY, 10*xoff));
		}
	}
}

function Ball(x, y, z){
	this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
	this.maxspeed = 3;
	this.maxforce = 0.1;


	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.separate = function(balls) {
    var desiredseparation = 30;
    var sum = createVector();
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < balls.length; i++) {
      var d = p5.Vector.dist(this.pos, balls[i].pos);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.pos, balls[i].pos);
        diff.normalize();
        diff.div(d);        // Weight by distance
        sum.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      sum.div(count);
      // Our desired vector is the average scaled to maximum speed
      sum.normalize();
      sum.mult(this.maxspeed);
      // Implement Reynolds: Steering = Desired - Velocity
      var steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }



	this.arrive = function(target) {
		var desire = p5.Vector.sub(target, this.pos);

		var d = desire.mag();
		if (d < 50){
			var n = mag(d, 0, 50, 0, this.maxspeed);
			desire.setMag(n);
		}
		else{
			desire.setMag(this.maxspeed);
		}

		var steering = p5.Vector.sub(desire, this.vel);
		steering.limit(this.maxforce);
		this.applyForce(steering);
	}

	this.clean = function() {
		if(this.pos.x > windowWidth/2-50 )
			balls.pop(balls);
	}


	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.set(0, 0);
}

	this.display = function() {
		fill(255, 200);
		noStroke();
		ellipse(this.pos.x, this.pos.y, 30, 30);
	}
//
}

function Particle(x, y, m) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.mass = m;
  this.maxspeed = 5;
  this.maxforce = .1;

  this.applyForce = function(force) {
    var f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  this.arrive = function(target) {
    var desire = p5.Vector.sub(target, this.pos);

    var d = desire.mag();
    if (d < 50){
      var n = mag(d, 0, 50, 0, this.maxspeed);
      desire.setMag(n);
    }
    else{
      desire.setMag(this.maxspeed);
    }

    var steering = p5.Vector.sub(desire, this.vel);
    steering.limit(this.maxforce);
    this.applyForce(steering);
  }

	this.clean = function() {
		if(this.pos.x < windowWidth/2){
			particles.pop(particles);
		}
	}


  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  this.display = function() {
    fill(255, 150);
		noStroke();
    ellipse(this.pos.x, this.pos.y, this.mass*30, this.mass*30);
  }

  this.edges = function() {
    if (this.pos.y > width/3+100) {
      this.vel.y *= -1;
      this.pos.y = width/3+100;
    }

  }
}
