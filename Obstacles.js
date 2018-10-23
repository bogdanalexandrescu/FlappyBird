function Obstacles() {
    this.x = width;
    this.gate = 150;
    this.height1 = random(50, height / 2);
    this.height2 = height - this.gate - this.height1;
    this.w = 20;
    this.speed = 2;
    this.color = color('#486824');
}
Obstacles.prototype.display = function() {
    fill(this.color);
    noStroke();
    rect(this.x, 0, this.w, this.height1);
    rect(this.x, height - this.height2, this.w, this.height2);
};

Obstacles.prototype.update = function() {
    this.x -= this.speed;
};

Obstacles.prototype.offScreen = function() {
    if (this.x < -(this.w + 5)) return true;
    else return false;
};
