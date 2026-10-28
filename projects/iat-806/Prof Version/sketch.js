// an array to put all the balls in.
let balls = [];
// numBalls is written in camelCase.
// you could also write in camel_case
// this is the number of balls that you want to create.
let numBalls = 10000;
// no color variables, no position variables, they are all defined within the class.

let bodySegmentation;
let video;
let segmentation;

let options = {
  maskType: "person",
};

async function setup() {
  createCanvas(1280, 960);
  for (let i = 0; i < numBalls; i++) {
    //push = add it to the "balls" array
    balls.push(createRandomBall());
  }

  //getting ready to use ml5 bodySegmentation
  bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);

  // Create the video (copy and paste from ml5 homepage)
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);
}

//1. Draw the ball
function draw() {
  // 1-1. draw background
  background(120);
  // 1-2. image(img, x, y) : img = what to show, x,y = anchored coordination point
  image(video, 0, 0);
  // 1-3. explain what to do for the 'ball' inside the array 'balls'
  /// 1-3-2. define "active"
  for (let ball of balls) {
    /// 1-3-1. defien "onBody" where it tests if segmentation exists (true), do "isOnBody" method in ball.js to the ball by returning 'segmentation.mask'
    //// 1-3-1-a. A && B = if A is true, render B
    //// 1-3-1-b. Result of the onBody: holds "true" if the ball is touching the body / "false" if it isn't111
    let onBody = segmentation && ball.isOnBody(segmentation.mask);

    let active = ball.contains(mouseX, mouseY) || onBody;

    ball.respond(active);

    ball.update(1);
  }
}

function checkMouseOver() {
  balls.forEach((ball, i) => {});
}

function mousePressed() {
  let i = balls.findLastIndex((ball) => ball.contains(mouseX, mouseY));

  if (i !== -1) {
    balls.splice(i, 1);
  } else {
    let ballC = color(20, 130, 140 + random(-100, 100), 180);
    balls.push(new Ball(mouseX, mouseY, ballC, 10));
  }
}

function createRandomBall() {
  let ballX = random(0, width);
  let ballY = random(0, height);
  let ballC = color(140, 0, 140 + random(-100, 100), 50);
  let ballR = 5;
  let ball;
  if (Math.random() < 0.9) {
    ball = new Ball(ballX, ballY, ballC, ballR);
  } else {
    ball = new FlickerBall(ballX, ballY, ballC, ballR);
  }

  return ball;
}

function gotResults(result) {
  segmentation = result;
}
