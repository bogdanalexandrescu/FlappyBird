function setup() {
    createCanvas(1000, 500);
    backgroundColor = color('#4C3F54');

    for (var i = 0; i < 20; i++) {
        birds.push(new Bird());
    }
    reset();
}
var birds = [];
var dead = [];
var obstacles = [];
var spawnTime = 2000;
var spawnInterval;
var started = 0;
var backgroundColor;
var epochs = 1;
function draw() {
    background(backgroundColor);
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
            birds[i].fitness -= birds[i].distance_to_gate(
                height - birds[i].y - birds[i].diam / 2,
                obstacles
            );
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
        let best = dead.sort((a, b) => b.fitness - a.fitness).slice(0, 5);
        dead = [];

        console.log(`Best fitness from epoch ${epochs} : ${best[0].fitness}`);

        for (let i = 0; i < best.length; i++) {
            best[i].reset();
        }

        epochs += 1;
        birds = [].concat(best);

        for (let i = 0; i < best.length; i++) {
            let mutated_bird = best[i].mutate();
            birds.push(mutated_bird);
        }

        for (var i = 1; i < best.length; i++) {
            let cross_bird1;
            let cross_bird2;
            [cross_bird1, cross_bird2] = best[0].crossOver(best[i]);
            birds.push(cross_bird1);
            birds.push(cross_bird2);
        }
    }
}
