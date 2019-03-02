const PIPE_SPAWN_TIME = 3000;
const NR_BIRDS = 6;
const TOP_BIRDS = NR_BIRDS / 2;
let birds = [];
let deadBirds = [];
let pipes = [];
let spawnInterval;
let started = 0;
let generations = 1;

function setup() {
    createCanvas(600, 400);
    for (let index = 0; index < NR_BIRDS; index++) {
        birds.push(new Bird());
    }
    reset();
}

function draw() {
    background('#4C3F54');

    for (let index = pipes.length - 1; index >= 0; index--) {
        pipes[index].update();
        pipes[index].display();

        if (pipes[index].offScreen()) {
            pipes.splice(index, 1);
        }
    }

    for (let index = 0; index < birds.length; index++) {
        birds[index].update();
        birds[index].display();
        birds[index].calculateFitness();
        if (birds[index].jumpDecision(pipes)) {
            birds[index].fly();
        }
        if (birds[index].hit(pipes)) {
            deadBirds.push(birds.splice(index, 1)[0]);
            index = index - 1;
        }
    }

    if (birds.length == 0) {
        reset();
    }
}

function addPipe() {
    pipes.push(new Pipe());
}

function reset() {
    clearInterval(spawnInterval);
    pipes = [];
    pipes.push(new Pipe());
    spawnInterval = setInterval(addPipe, PIPE_SPAWN_TIME);
    breed((nrBest = TOP_BIRDS));
}

function breed(nrBest = 3, crossOver = false) {
    if (deadBirds.length > 0) {
        let bestBirds = deadBirds
            .sort((a, b) => b.fitness - a.fitness)
            .slice(0, nrBest);
        deadBirds = [];

        console.log(
            `Best fitness from current epoch ${generations} : ${
                bestBirds[0].fitness
            }`
        );
        console.log(`Best bird is from generation: ${bestBirds[0].generation}`);

        for (let i = 0; i < bestBirds.length; i++) {
            bestBirds[i].resetBirdPosition();
        }

        generations += 1;
        birds = bestBirds.slice();

        for (let bird of bestBirds) {
            let mutatedBird = bird.mutate(0.2);
            //let mutatedBird2 = best[i].mutate(0.5);
            mutatedBird.generation = generations;
            //mutatedBird2.generation = generations;
            birds.push(mutatedBird);
            //birds.push(mutatedBird2);
        }

        if (crossOver) {
            for (let index = 0; index < bestBirds.length - 1; index++) {
                let crossBird1;
                let crossBird2;
                [crossBird1, crossBird2] = bestBirds[index].crossOver(
                    bestBirds[index + 1]
                );
                crossBird1.generation = generations;
                crossBird2.generation = generations;
                birds.push(crossBird1);
                birds.push(crossBird1);
            }
        }
    }
}
