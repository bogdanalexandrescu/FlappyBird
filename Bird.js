function Bird() {
	this.x = width / 5;
	this.y = height / 2;
	this.diam = 20;
	this.gravity = 0.4;
	this.velocity = 0;

	this.display = function() {
		fill(200, 0, 100);
		noStroke();
		ellipse(this.x, this.y, this.diam, this.diam);
	}

	this.fly = function() {
		this.velocity = -8;
	}

	this.update = function() {

		this.y += this.velocity;
		this.velocity += this.gravity;

		if (this.y > height - this.diam / 2)
			this.y = height - this.diam / 2;

		if (this.y < this.diam / 2) {
			this.y = this.diam / 2;
			this.velocity = 0;
		}
	}

	this.hit = function() {
		for (var i = 0; i < obstacles.length; i++) {
			if(collideRectCircle(obstacles[i].x,0,obstacles[i].w, obstacles[i].height1,this.x,this.y,this.diam) || collideRectCircle(obstacles[i].x,height - obstacles[i].height2,obstacles[i].w, obstacles[i].height2,this.x,this.y,this.diam)){
				obstacles[i].color = color(200,0,100);
				obstacles[i].display();
				return true;
			}

			if(this.y == height-this.diam/2)
				return true;

			return false;

		}
	}
	this.scored = function(){
		if(obstacles.length!=0)
			if(this.x-this.diam/2-obstacles[0].w -obstacles[0].x == 1)
				return true;
		}

	}

