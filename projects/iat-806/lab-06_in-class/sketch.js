let balls = [];
let ballNumbers = 100;

function setup() {
  createCanvas(500, 400);
  for (let i = 0; i < ballNumbers; i++) {
    let x = random(250);
    let y = random(200);
    let r = 100;
    circle(x, y, r);
  }
}

function draw() {
  background(0);
  for (let ball of balls) {
    ball.show();
  }
}
