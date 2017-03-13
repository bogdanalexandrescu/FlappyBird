function setup() {
	createCanvas(400, 600);
	bird = new Bird();
	spawnInterval = setInterval(function() {
		obstacles.push(new Obstacles());
	}, spawnTime);
}
var bird;
var obstacles = [];
var spawnTime = 3000;
var spawnInterval;
var maxScore=0;
var currentScore=0;

function draw() {
	background(50);
	

	for (var i = obstacles.length - 1; i >= 0; i--) {
		obstacles[i].update();
		obstacles[i].display();

		if (obstacles[i].offScreen())
			obstacles.splice(i, 1);
	}
	bird.update();
	bird.display();

	if (bird.hit()) {
		noLoop();
		if(currentScore > maxScore)
			maxScore = currentScore;
	}

	if(bird.scored())
		currentScore += 50;

	textSize(15);
	text("Max Score:" + maxScore,width-120,20);
	text("Score:" + currentScore,width-120,40);
}

function mousePressed() {
	bird.fly();
}

function mouseWheel(){
	reset();
	loop();
}

function reset(){
	currentScore = 0;
	obstacles = [];
	bird = new Bird();
	clearInterval(spawnInterval);
	spawnInterval = spawnInterval = setInterval(function() {
		obstacles.push(new Obstacles());
	}, spawnTime);
	obstacles = [];
}