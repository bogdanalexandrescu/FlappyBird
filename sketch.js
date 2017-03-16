function setup() {
	createCanvas(400, 500);
	bird = new Bird();
	textSize(15);
	backgroundColor = color("#4C3F54");
	popupColor = bird.color;
}
var bird;
var obstacles = [];
var coins = [];
var spawnTime = 1500;
var spawnInterval;
var maxScore=0;
var currentScore=0;
var started = 0;
var backgroundColor;
var popupColor;
function draw() {
	if(started == 0){
		background(backgroundColor);
		fill(popupColor);
		noStroke();
		ellipse(width/2,height/2,200,100);
		fill(255);
		text("Press ENTER to start",width/2-70,height/2-5);
		text("Play using UP ARROW",width/2-75,height/2+15);
	}
	else if(started == 1){
		background(backgroundColor);
		for (var i = obstacles.length - 1; i >= 0; i--) {
			obstacles[i].update();
			obstacles[i].display();

			if (obstacles[i].offScreen())
				obstacles.splice(i, 1);
		}

		for (var i = coins.length - 1; i >= 0; i--) {
			coins[i].update();
			coins[i].display();

			if (coins[i].offScreen())
				coins.splice(i, 1);
			if(dist(bird.x,bird.y,coins[i].x,coins[i].y)<=bird.diam/2){
				currentScore += 100;
				coins.splice(i, 1);
			}
		}
		bird.update();
		bird.display();

		if (bird.hit()) {
			noLoop();
			fill(popupColor);
			ellipse(width/2,height/2,200,100);
			fill(255);
			text("Oops!",width/2-20,height/2-5)
			text("Press ENTER to restart",width/2-75,height/2+15);
			if(currentScore > maxScore)
				maxScore = currentScore;
		}

		if(bird.scored())
			currentScore += 50;

		showScore();

	}
}
function addCoinsAndObs(){
	obstacles.push(new Obstacles());
	coins.push(new Coin((height-obstacles[obstacles.length-1].height2+obstacles[obstacles.length-1].height1)/2));

}
function showScore(){
	fill(255);
	text("Max Score:" + maxScore,width-120,20);
	text("Score:" + currentScore,width-120,40);
}
function mousePressed() {
	bird.fly();
}

function keyPressed() {
	if(keyCode == UP_ARROW)
		bird.fly();
	if(keyCode == ENTER){
		reset();
		loop();
		started = 1;
	}
}


function reset(){
	currentScore = 0;
	obstacles = [];
	coins = [];
	bird = new Bird();
	clearInterval(spawnInterval);
	spawnInterval = setInterval(addCoinsAndObs,spawnTime);
	obstacles = [];
}