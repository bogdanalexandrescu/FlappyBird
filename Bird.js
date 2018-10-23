const MIN_RANDOM = -Math.sqrt(6 / 2);
const MAX_RANDOM = Math.sqrt(6 / 2);

Array.prototype.clone = function() {
    return this.slice(0);
};

function Bird() {
    this.x = width / 5;
    this.y = height / 2;
    this.diam = 20;
    this.gravity = 0.5;
    this.velocity = 0;
    this.color = color('#D13525');

    this.weights1 = [
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
        [random(MIN_RANDOM, MAX_RANDOM), random(MIN_RANDOM, MAX_RANDOM)],
    ];

    this.weights2 = [
        random(MIN_RANDOM, MAX_RANDOM),
        random(MIN_RANDOM, MAX_RANDOM),
        random(MIN_RANDOM, MAX_RANDOM),
        random(MIN_RANDOM, MAX_RANDOM),
        random(MIN_RANDOM, MAX_RANDOM),
        random(MIN_RANDOM, MAX_RANDOM),
        random(MIN_RANDOM, MAX_RANDOM),
        random(MIN_RANDOM, MAX_RANDOM),
    ];

    this.fitness = 0;
}

Bird.prototype.reset = function() {
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

    if (this.y > height - this.diam / 2) this.y = height - this.diam / 2;

    if (this.y < this.diam / 2) {
        this.y = this.diam / 2;
        this.velocity = 0;
    }
};

Bird.prototype.hit = function(obstacles) {
    for (var i = 0; i < obstacles.length; i++) {
        if (
            collideRectCircle(
                obstacles[i].x,
                0,
                obstacles[i].w,
                obstacles[i].height1,
                this.x,
                this.y,
                this.diam
            ) ||
            collideRectCircle(
                obstacles[i].x,
                height - obstacles[i].height2,
                obstacles[i].w,
                obstacles[i].height2,
                this.x,
                this.y,
                this.diam
            )
        ) {
            return true;
        }
    }
    if (this.y >= height - this.diam / 2) return true;

    if (this.y <= this.diam / 2) return true;

    return false;
};

Bird.prototype.scored = function() {
    if (obstacles.length != 0)
        if (this.x - this.diam / 2 - obstacles[0].w - obstacles[0].x == 5) {
            return true;
        }
};

Bird.prototype.decision = function(obstacles) {
    let distance_to_bottom = height - this.y - this.diam / 2;
    let distance_to_gap;
    let distance;
    [distance, distance_to_gap] = this.distance_to_gap(
        distance_to_bottom,
        obstacles
    );

    let input = [[distance_to_bottom, distance_to_gap]];

    let l1_output = this.dot(this.weights1, input);

    for (var i = 0; i < l1_output.length; i++) {
        l1_output[i] = this.relu(l1_output[i][0]);
    }

    let output = this.dot_array(this.weights2, l1_output);
    output = this.sigmoid(output);

    return output > 0.5;
};

Bird.prototype.distance_to_gate = function(distance_to_bottom, obstacles) {
    for (var i = 0; i < obstacles.length; i++) {
        distance = obstacles[i].x - this.x - this.diam / 2;
        if (distance > -5) {
            distance_to_gate = Math.sqrt(
                distance ** 2 +
                    (obstacles[i].height2 +
                        obstacles[i].gate / 2 -
                        distance_to_bottom) **
                        2
            );
            return distance_to_gate;
        }
    }

    return width - this.x - this.diam / 2;
};

Bird.prototype.distance_to_gap = function(distance_to_bottom, obstacles) {
    for (var i = 0; i < obstacles.length; i++) {
        distance = obstacles[i].x - this.x - this.diam / 2;
        if (distance > -30) {
            let distance_to_gap =
                obstacles[i].height2 +
                obstacles[i].gate / 2 -
                distance_to_bottom;
            return [distance, distance_to_gap];
        }
    }

    return [width - this.x - this.diam / 2, 100];
};

Bird.prototype.sigmoid = function(x) {
    return 1 / (1 + Math.exp(-x));
};

Bird.prototype.relu = function(x) {
    return x > 0 ? x : 0;
};

Bird.prototype.crossOver = function(bird) {
    let slice_point = Math.round(random(1, this.weights1.length - 1));
    let cross_weights1_l1 = this.weights1
        .slice(0, slice_point)
        .concat(bird.weights1.slice(slice_point));
    let cross_weights2_l1 = bird.weights1
        .slice(0, slice_point)
        .concat(this.weights1.slice(-slice_point));

    slice_point = Math.round(random(1, this.weights2.length - 1));
    let cross_weights1_l2 = this.weights2
        .slice(0, slice_point)
        .concat(bird.weights2.slice(slice_point));
    let cross_weights2_l2 = bird.weights2
        .slice(0, slice_point)
        .concat(this.weights2.slice(slice_point));

    cross_bird1 = new Bird();
    cross_bird2 = new Bird();

    cross_bird1.weights1 = cross_weights1_l1;
    cross_bird1.weights2 = cross_weights1_l2;

    cross_bird2.weights1 = cross_weights2_l1;
    cross_bird2.weights2 = cross_weights2_l2;

    return [cross_bird1, cross_bird2];
};

Bird.prototype.mutate = function() {
    let mutate_bird = new Bird();
    let w1 = this.weights1.clone();
    let w2 = this.weights2.clone();
    let no_changes_l1 = Math.round(random(1, this.weights1.length - 1));
    let no_changes_l2 = Math.round(random(1, this.weights2.length - 1));

    let mutated_rows = [];
    for (var i = 0; i < no_changes_l1; i++) {
        let which = Math.round(random(0, this.weights1.length - 1));

        while (mutated_rows.includes(which)) {
            which = Math.round(random(0, this.weights1.length - 1));
        }
        mutated_rows.push(which);

        mutated_row = [
            random(MIN_RANDOM, MAX_RANDOM),
            random(MIN_RANDOM, MAX_RANDOM),
        ];
        w1[which] = mutated_row;
    }

    mutated_rows = [];
    for (var i = 0; i < no_changes_l2; i++) {
        let which = Math.round(random(0, this.weights2.length - 1));

        while (mutated_rows.includes(which)) {
            which = Math.round(random(0, this.weights2.length - 1));
        }
        mutated_rows.push(which);

        mutated_row = random(MIN_RANDOM, MAX_RANDOM);
        w2[which] = mutated_row;
    }

    mutate_bird.weights1 = w1;
    mutate_bird.weights2 = w2;

    return mutate_bird;
};

Bird.prototype.calculate_fitness = function() {
    this.fitness += 2;
};

Bird.prototype.dot = function(matrix1, matrix2) {
    dot_matrix = [];
    for (var i = 0; i < matrix1.length; i++) {
        row = [];
        for (var j = 0; j < matrix2.length; j++) {
            row.push(this.dot_array(matrix1[i], matrix2[j]));
        }

        dot_matrix.push(row);
    }

    return dot_matrix;
};

Bird.prototype.dot_array = function(array1, array2) {
    sum = 0;
    for (var i = 0; i < array1.length; i++) {
        sum += array1[i] * array2[i];
    }

    return sum;
};
