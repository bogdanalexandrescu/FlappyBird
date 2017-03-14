function setup() {
	createCanvas(400, 600);
	bird = new Bird();
	spawnInterval = setInterval(addCoinsAndObs,spawnTime);
	textSize(15);
}
var bird;
var obstacles = [];
var coins = [];
var spawnTime = 3000;
var spawnInterval;
var maxScore=0;
var currentScore=0;
var started = 0;

function draw() {
	if(started == 0){
		background(50);
		fill(200,0,100);
		ellipse(width/2,height/2,200,100);
		fill(255);
		text("Press ENTER to start",width/2-70,height/2-5);
		text("Play using UP ARROW",width/2-75,height/2+15);
	}
	else if(started == 1){
		background(50);
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
			if(dist(bird.x,bird.y,coins[i].x,coins[i].y)<bird.diam/2-coins[i].diam/2){
				currentScore += 100;
				coins.splice(i, 1);
			}
		}
		bird.update();
		bird.display();

		if (bird.hit()) {
			noLoop();
			ellipse(width/2,height/2,200,100);
			fill(255);
			text("Oops!",width/2-20,height/2-5)
			text("Press ESC to restart",width/2-65,height/2+15);
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
	fill(200,0,100);
	text("Max Score:" + maxScore,width-120,20);
	text("Score:" + currentScore,width-120,40);
}
function mousePressed() {
	bird.fly();
}

function keyPressed() {
	if(keyCode == UP_ARROW)
		bird.fly();
	if(keyCode == ESCAPE){
		reset();
		loop();
	}
	if(keyCode == ENTER){
		started = 1;
	}
}

function mouseWheel(){
	reset();
	loop();
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