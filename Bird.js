const MIN = -1000;
const MAX = 1000;

function Bird(arhitecture = [2, 6, 1]) {
    this.x = width / 5;
    this.y = height / 2;
    this.diam = 20;
    this.gravity = 0.5;
    this.velocity = 0;
    this.color = color('#D13525');
    this.generation = 1;
    this.arhitecture = arhitecture;
    this.weights = this.initWeights();
    this.fitness = 0;
}

Bird.prototype.initWeights = function() {
    let weights = [];
    for (let index = 0; index < this.arhitecture.length - 1; index++) {
        let input = this.arhitecture[index];
        let output = this.arhitecture[index + 1];
        weights.push(tf.randomUniform([input, output], MIN, MAX));
    }

    return weights;
};

Bird.prototype.resetBirdPosition = function() {
    this.x = width / 5;
    this.y = height / 2;
    this.fitness = 0;
    this.velocity = 0;
};

Bird.prototype.display = function() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.diam, this.diam);
};

Bird.prototype.fly = function() {
    this.velocity = -7.5;
};

Bird.prototype.update = function() {
    this.y += this.velocity;
    this.velocity += this.gravity;

    if (this.y > height - this.diam / 2) {
        this.y = height - this.diam / 2;
    }

    if (this.y < this.diam / 2) {
        this.y = this.diam / 2;
        this.velocity = 0;
    }
};

Bird.prototype.hit = function(pipes) {
    for (let pipe of pipes) {
        if (
            collideRectCircle(
                pipe.x,
                0,
                pipe.width,
                pipe.upperHeight,
                this.x,
                this.y,
                this.diam
            ) ||
            collideRectCircle(
                pipe.x,
                height - pipe.lowerHeight,
                pipe.width,
                pipe.lowerHeight,
                this.x,
                this.y,
                this.diam
            )
        ) {
            return true;
        }
    }
    if (this.y >= height - this.diam / 2) {
        return true;
    }

    if (this.y <= this.diam / 2) {
        return true;
    }

    return false;
};

Bird.prototype.scored = function() {
    if (pipes.length != 0)
        if (this.x - this.diam / 2 - pipes[0].width - pipes[0].x == 5) {
            return true;
        }
};

Bird.prototype.jumpDecision = function(pipes) {
    let distanceToBottom = height - this.y - this.diam / 2;
    let distanceToGap;
    let distanceToPipe;
    [distanceToPipe, distanceToGap] = this.distanceToGapAndPipe(
        distanceToBottom,
        pipes
    );

    let input = tf.tensor([distanceToBottom, distanceToGap]);
    //Feedforward step
    for (let weights of this.weights) {
        input = input.dot(weights);
        input = tf.relu(input);
    }

    let output = tf.sigmoid(input);

    return output.dataSync()[0] > 0.5;
};

Bird.prototype.distanceToGapAndPipe = function(distanceToBottom, pipes) {
    for (let pipe of pipes) {
        let distanceToPipe = pipe.x - this.x - this.diam / 2;
        //Be sure that the bird passed the last pipes
        if (distanceToPipe > -(pipe.width + this.diam)) {
            let distanceToGap =
                pipe.lowerHeight + pipe.gate / 2 - distanceToBottom;
            return [distanceToPipe, distanceToGap];
        }
    }

    return [width - this.x - this.diam / 2, 100];
};

Bird.prototype.crossOver = function(bird) {
    let otherWeights = bird.weights;
    let crossWeights1 = [];
    let crossWeights2 = [];
    for (let index = 0; index < this.weights.length; index++) {
        let weights1 = this.weights[index];
        let weights2 = otherWeights[index];
        let slicePoint = Math.round(random(1, weights1.shape[0] - 1));

        let crossLayer1 = weights1
            .slice(0, slicePoint)
            .concat(weights2.slice(slicePoint));
        let crossLayer2 = weights2
            .slice(0, slicePoint)
            .concat(weights1.slice(slicePoint));

        crossWeights1.push(crossLayer1);
        crossWeights2.push(crossLayer2);
    }

    let crossBird1 = new Bird();
    let crossBird2 = new Bird();

    crossBird1.weights = crossWeights1;
    crossBird2.weights = crossWeights2;

    return [crossBird1, crossBird2];
};

Bird.prototype.mutate = function(probability = 0.2) {
    let mutatedBird = new Bird();
    let mutatedWeights = [];

    for (let weights of this.weights) {
        let shape = weights.shape;
        let buffer = tf.buffer(
            shape,
            weights.dtype,
            weights.dataSync().slice()
        );
        for (let i = 0; i < shape[0]; i++) {
            for (let j = 0; j < shape[1]; j++) {
                let change = Math.random();
                if (change <= probability) {
                    buffer.set(random(MIN, MAX), i, j);
                }
            }
        }
        mutatedWeights.push(buffer.toTensor());
    }

    mutatedBird.weights = mutatedWeights;

    return mutatedBird;
};

Bird.prototype.calculateFitness = function() {
    this.fitness += 2;
};
