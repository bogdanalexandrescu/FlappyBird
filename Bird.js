const MIN_RANDOM = -Math.sqrt(3 / 2);
const MAX_RANDOM = Math.sqrt(3 / 2);

Array.prototype.clone = function() {
    return this.slice(0);
};

function Bird() {
    this.x = width / 5;
    this.y = height / 2;
    this.diam = 20;
    this.gravity = 0.5;
    this.velocity = 0;
    this.color = color("#D13525");
    this.weights = [
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
                this.diam,
            ) ||
            collideRectCircle(
                obstacles[i].x,
                height - obstacles[i].height2,
                obstacles[i].w,
                obstacles[i].height2,
                this.x,
                this.y,
                this.diam,
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
    let w = this.weights;
    let distance_to_bottom = height - this.y - this.diam / 2;
    let distance_to_obstacle = this.distance_to_next_obstacle(
        distance_to_bottom,
        obstacles,
    );

    return (
        this.sigmoid(
            w[0] * distance_to_bottom + w[1] * distance_to_obstacle + w[2],
        ) > 0.5
    );
};

Bird.prototype.distance_to_next_obstacle = function(
    distance_to_bottom,
    obstacles,
) {
    for (var i = 0; i < obstacles.length; i++) {
        distance = obstacles[i].x - this.x - this.diam / 2;
        if (distance > 0 || (distance < 0 && distance > -5)) {
            distance_to_gate = Math.sqrt(
                distance ** 2 +
                    (obstacles[i].height2 +
                        obstacles[i].gate / 2 -
                        distance_to_bottom) **
                        2,
            );
            return distance_to_gate;
        }
    }

    return width - this.x - this.diam / 2;
};

Bird.prototype.sigmoid = function(x) {
    return 1 / (1 + Math.exp(-x));
};

Bird.prototype.crossOver = function(weights) {
    let w1 = this.weights.clone();
    let w2 = weights.clone();

    let no_changes = Math.round(random(1, 2));

    if (no_changes == 1) {
        let which = Math.round(random(0, 2));
        [w1[which], w2[which]] = [w2[which], w1[which]];

        return [w1, w2];
    }
    if (no_changes == 2) {
        let which1 = Math.round(random(0, 2));
        let which2 = Math.round(random(0, 2));

        while (which2 == which1) {
            which2 = Math.round(random(0, 2));
        }

        [w1[which1], w2[which1], w1[which2], w2[which2]] = [
            w2[which1],
            w1[which1],
            w2[which2],
            w1[which2],
        ];
        return [w1, w2];
    }
};

Bird.prototype.mutate = function() {
    let weights = this.weights.clone();
    let no_changes = Math.round(random(1, 3));

    if (no_changes == 1) {
        let which = Math.round(random(0, 2));
        weights[which] = random(MIN_RANDOM, MAX_RANDOM);
        return weights;
    }
    if (no_changes == 2) {
        let which1 = Math.round(random(0, 2));
        let which2 = Math.round(random(0, 2));

        while (which2 == which1) {
            which2 = Math.round(random(0, 2));
        }

        weights[which1] = random(MIN_RANDOM, MAX_RANDOM);
        weights[which2] = random(MIN_RANDOM, MAX_RANDOM);
        return weights;
    } else {
        weights = [
            random(MIN_RANDOM, MAX_RANDOM),
            random(MIN_RANDOM, MAX_RANDOM),
            random(MIN_RANDOM, MAX_RANDOM),
        ];
        return weights;
    }
};

Bird.prototype.calculate_fitness = function() {
    this.fitness += 2;
};
