function Pipe() {
    this.x = width;
    this.gate = 120;
    //Height of the upper pipe
    this.upperHeight = random(50, height / 2);
    //Height of the lower pipe
    this.lowerHeight = height - this.gate - this.upperHeight;
    this.width = 50;
    this.speed = 2;
    this.color = color('#486824');
}
Pipe.prototype.display = function() {
    fill(this.color);
    noStroke();
    rect(this.x, 0, this.width, this.upperHeight);
    rect(this.x, height - this.lowerHeight, this.width, this.lowerHeight);
};

Pipe.prototype.update = function() {
    this.x -= this.speed;
};

Pipe.prototype.offScreen = function() {
    if (this.x < -this.width) {
        return true;
    } else return false;
};
