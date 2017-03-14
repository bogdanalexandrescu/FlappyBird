function Bird() {
	this.x = width / 5;
	this.y = height / 2;
	this.diam = 20;
	this.gravity = 0.5;
	this.velocity = 0;

	this.display = function() {
		fill(200, 0, 100);
		noStroke();
		ellipse(this.x, this.y, this.diam, this.diam);
	}

	this.fly = function() {
		this.velocity = -10;
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
			if ((this.x<=obstacles[i].x && obstacles[i].x - this.x <= this.diam/2)|| (this.x > obstacles[i].x && this.x-obstacles[i].x <= this.diam/2 + obstacles[i].w))
				if (this.y <= obstacles[i].height1+this.diam/2|| this.y >= height - obstacles[i].height2-this.diam/2){
					obstacles[i].color = color(200,0,100);
					obstacles[i].display();
					return true;
				}
			}
			if(this.y == height-this.diam/2)
				return true;

			return false;

		}
		this.scored = function(){
			if(obstacles.length!=0)
				if(this.x-this.diam/2-obstacles[0].w -obstacles[0].x == 1)
					return true;
			}

		}

	