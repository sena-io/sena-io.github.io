let balls = [];
let numberOfBalls = 1000;

function setup() {
  createCanvas(600, 600);
  for (let i = 0; i < numberOfBalls; i++) {
    let ballX = 300;
    let ballY = 300;
    let ballColor = color(120, 200, 140 + random(1, 250));
    let ballR = 10;

    let newBall = new Ball(ballX, ballY, ballColor, ballR);
    balls.push(newBall); // push something in an array
  }

  // myBall = new Ball(ballX, ballY, ballColor, ballR); //object
  // myBall2 = new Ball();
}

function draw() {
  background(20);
  for (let ball of balls) {
    ball.move();
    //ball.move(random(0,5))
    ball.show();
  }
}

// balls.forEach(function(ball){
//   ball.move();
//   ball.show();
// })

// for let( i=0; i<nubmerOfBalls; i++) {
// balls[i].move()
// balls[i].show()

class Ball {
  // classes are like blueprints
  // x = x position, y = y positon, c = color, r = radius
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.r = r;
  }

  // methods (what ball can do). Functions that are defined for a class.
  move() {
    this.x += random(-5, 5); // this.x = this.x + random(-5, 5);
    this.y += random(-5, 5);
  }

  show() {
    fill(this.color); // fill = give me a colour >> action >> method
    circle(this.x, this.y, this.r);
  }
}

//This can be a starter for visual movements - e.g., make it move, make it grow, make it die...
