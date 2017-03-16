function Obstacles() {
	this.x = width;
	this.gate = 100;
	this.height1 = random(50, height / 2);
	this.height2 = height-this.gate-this.height1;
	this.w = 20;
	this.speed = 2;
	this.color = color("#486824");
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