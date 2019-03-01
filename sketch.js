const SPAWNTIME = 3000;
const NRBIRDS = 6;
let birds = [];
let deadBirds = [];
let pipes = [];
let spawnInterval;
let started = 0;
let epochs = 1;

function setup() {
    createCanvas(1000, 500);
    for (var i = 0; i < NRBIRDS; i++) {
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
        if (birds[index].decision(pipes)) {
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
    pipes = [];
    pipes.push(new Pipe());
    clearInterval(spawnInterval);
    breed();
    spawnInterval = setInterval(addPipe, SPAWNTIME);
}

function breed(nrBest = 3, crossOver = false) {
    if (deadBirds.length > 0) {
        let bestBirds = deadBirds
            .sort((a, b) => b.fitness - a.fitness)
            .slice(0, nrBest);
        deadBirds = [];

        console.log(
            `Best fitness from epoch ${epochs} : ${bestBirds[0].fitness}`
        );
        console.log(`Max bird from generation: ${bestBirds[0].generation}`);

        for (let i = 0; i < bestBirds.length; i++) {
            bestBirds[i].resetBirdPosition();
        }

        epochs += 1;
        birds = bestBirds.slice();

        for (bird of bestBirds) {
            const mutatedBird1 = bird.mutate(0.5);
            //const mutatedBird2 = best[i].mutate(0.5);
            mutatedBird1.generation = epochs;
            //mutatedBird2.generation = epochs;
            birds.push(mutatedBird1);
            //birds.push(mutatedBird2);
        }
        if (crossOver) {
            for (let index = 0; index < bestBirds.length - 1; index++) {
                let crossBird1;
                let crossBird2;
                [crossBird1, crossBird2] = bestBirds[index].crossOver(
                    bestBirds[index + 1]
                );
                crossBird1.generation = epochs;
                crossBird2.generation = epochs;
                birds.push(crossBird1);
                birds.push(crossBird1);
            }
        }
    }
}
