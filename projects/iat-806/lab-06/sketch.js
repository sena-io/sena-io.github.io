let balls = [];

let numBalls = 500;

function setup() {
  const canvas = createCanvas(600, 600);

  for (let i = 0; i < numBalls; i++) {
    let ball = createRandomBall();
    balls.push(ball);
  }
}

function draw() {
  background(120);

  for (let ball of balls) {
    let byHowMuch = 1;
    let active = ball.contains(mouseX, mouseY); //checkiing if mouse X, mouse Y is inside the ball
    ball.respond(active); //defines the color
    ball.update(byHowMuch); //drawing the ball
    // ball.update(1);
  }
}

//changing the ball colors when mouse pressed on the ball
//highlighting and de-highlighting
function mousePressed() {
  //for each this balls, do this
  balls.forEach((ball) => {
    // equals, greater than: Arrow function
    let active = ball.contains(mouseX, mouseY); //defines active
    ball.respond(active);
    // if (ball.contains(mouseX, mouseY)) {
    //   ball.highlight();
    // } else {
    //   ball.deHighlight();
    // }
  });
}
