let balls = [];
let numberOfBalls = 1000;
let flowerImg = null;
let imgLoaded = false;

function setup() {
  createCanvas(600, 600);

  for (let i = 0; i < numberOfBalls; i++) {
    let ballX = width / 2;
    let ballY = height / 2;
    let ballColor = color(120, 200, 140 + random(1, 115), 180);
    let ballR = 10;

    let newBall = new Ball(ballX, ballY, ballColor, ballR);
    balls.push(newBall);
  }
}

function draw() {
  background(20, 20, 25, 60);

  // Update and show all balls
  for (let ball of balls) {
    ball.change(2);
  }

  // Creating flower cursor
  drawFlowerCursor(mouseX, mouseY);
}

function drawFlowerCursor(x, y) {
  push();
  imageMode(CENTER);

  if (imgLoaded && flowerImg) {
    let flowerSize = 36;
    image(flowerImg, x, y, flowerSize, flowerSize);
  } else {
    // Fallback visible flower so the cursor never vanishes
    translate(x, y);
    noStroke();
    fill(255, 180, 200, 200);
    for (let i = 0; i < 5; i++) {
      ellipse(0, 10, 8, 12);
      rotate(TWO_PI / 5);
    }
    fill(255, 220, 80);
    circle(0, 0, 10);
  }
  pop();
}

class Ball {
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.baseR = r;
    this.r = r;
    this.color = c;
    this.pulseOffset = random(TWO_PI);
  }
  // changing the ball size, position, pulse constantly
  change(byHowMuch) {
    this.changeSize(byHowMuch);
    this.move(byHowMuch);
    this.fleeMouse(6);
    this.pulse(4);
    this.wrapCanvas(20);
    this.show();
  }

  move(amount = 10) {
    this.x += random(-amount, amount);
    this.y += random(-amount, amount);
  }

  changeSize(amount = 1) {
    this.r = constrain(this.r + random(-amount, amount), 3, 30);
  }

  // making the balls move away from the mouse cursor
  fleeMouse(pushForce) {
    let d = dist(this.x, this.y, mouseX, mouseY);
    let fleeRadius = 120;

    if (d < fleeRadius && d > 0) {
      let angle = atan2(this.y - mouseY, this.x - mouseX);
      let strength = map(d, 0, fleeRadius, pushForce, 0);
      this.x += cos(angle) * strength;
      this.y += sin(angle) * strength;
    }
  }

  pulse(amount) {
    this.r = this.baseR + sin(frameCount * 0.05 + this.pulseOffset) * amount;
  }

  wrapCanvas(margin) {
    if (this.x < -margin) this.x = width + margin;
    if (this.x > width + margin) this.x = -margin;
    if (this.y < -margin) this.y = height + margin;
    if (this.y > height + margin) this.y = -margin;
  }

  show() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, max(1, this.r));
  }
}
