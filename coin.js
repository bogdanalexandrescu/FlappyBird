function Coin(y){
	this.diam = 5;
	this.x = width + 10;
	this.y = y;
	this.speed = 1;

	this.display = function(){
		noStroke();
		fill(200,200,0);
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