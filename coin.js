function Coin(y){
	this.diam = 5;
	this.x = width + 10;
	this.y = y;
	this.speed = 2;
	this.color = color("#F2C057")
	this.display = function(){
		noStroke();
		fill(this.color);
		ellipse(this.x,this.y,this.diam,this.diam);
	}

	this.update = function(){
		this.x -= this.speed;
	}
	this.offScreen = function() {
		if (this.x < -this.diam/2-2)
			return true;
		else return false;
	}


}