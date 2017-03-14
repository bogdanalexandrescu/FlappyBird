function Obstacles() {
	this.x = width;
	this.height1 = random(50, height / 2);
	this.height2 = height-random(100,150)-this.height1;
	this.w = 20;
	this.speed = 1;
	this.color = color(255);
	this.display = function() {
		fill(this.color);
		noStroke();
		rect(this.x, 0, this.w, this.height1);
		rect(this.x, height - this.height2, this.w, this.height2);
	}

	this.update = function() {
		this.x -= this.speed;
	}

	this.offScreen = function() {
		if (this.x < -(this.w+2))
			return true;
		else return false;
	}
	

}