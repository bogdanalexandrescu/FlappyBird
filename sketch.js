function setup() {
    createCanvas(1000, 500);
    backgroundColor = color("#4C3F54");

    for (var i = 0; i < 40; i++) {
        birds.push(new Bird());
	}
	reset();
}
var birds = [];
var dead = [];
var obstacles = [];
var spawnTime = 1500;
var spawnInterval;
var started = 0;
var backgroundColor;
var epochs = 1;
function draw() {
    background(backgroundColor);
    // if (started == 0) {
    //     noStroke();
    //     ellipse(width / 2, height / 2, 200, 100);
    // //     fill(255);
    // } else if (started == 1) {
        for (var i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].display();

            if (obstacles[i].offScreen()) obstacles.splice(i, 1);
        }
        for (var i = 0; i < birds.length; i++) {
            birds[i].update();
            birds[i].display();
            birds[i].calculate_fitness();
            if (birds[i].decision(obstacles)) {
                birds[i].fly();
            }
            if (birds[i].hit(obstacles)) {
				birds[i].fitness -= birds[i].distance_to_next_obstacle(height - birds[i].y - birds[i].diam / 2, obstacles);
                dead.push(birds.splice(i, 1)[0]);
                i = i - 1;
            }
		}

        if (birds.length == 0) {
            reset();
        }

}
function addObs() {
    obstacles.push(new Obstacles());
}

function keyPressed() {
    if (keyCode == ENTER) {
        reset();
        loop();
        started = 1;
    }
}

function reset() {
	obstacles = [];
	clearInterval(spawnInterval);
    breed();
    spawnInterval = setInterval(addObs, spawnTime);
}

function breed() {
    if (dead.length > 0) {
		let best = dead.sort((a, b) => b.fitness - a.fitness).slice(0, 10);
		dead = [];

		console.log(`Best fitness from epoch ${epochs} : ${best[0].fitness}`);

		for (let i = 0; i < best.length; i++) {
            best[i].reset();
		}

		epochs += 1;
        birds = [].concat(best);

        for (let i = 0; i < best.length; i++) {
            let mutated_bird = new Bird();
            mutated_bird.weights = best[i].mutate();
            birds.push(mutated_bird);
        }

        for (var i = 1; i < best.length; i++) {
            let cross_weights = best[0].crossOver(best[i].weights);
			let cross_bird1 = new Bird();
			let cross_bird2 = new Bird();
			cross_bird1.weights = cross_weights[0];
			cross_bird2.weights = cross_weights[1];
			birds.push(cross_bird1);
            birds.push(cross_bird2);
        }
    }
}
