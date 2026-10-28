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
  //continously does this until the ball number;
  for (let i = 0; i < numBalls; i++) {
    //push = runs "createRandomBall" function and add it to the "balls" array
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

    /// 1-3-2. define "active" where it detects if the mouse is on the ball OR on the body >> return "active"
    let active = ball.contains(mouseX, mouseY) || onBody;
    /// sends the state of "active" to "respond" methods
    ball.respond(active);
    /// gives value to the "update" methdos; how much you want the ball to jitter
    ball.update(1);
  }
}

//2. When mouse pressed on the ball > delete it / when on empty space, create a new ball
function mousePressed() {
  /// 2-1. Search "balls" array from end to the beginning whethe the mouse position is inside the ball and returns the exact index number of that ball (e.g., 42).
  /// 2-1-a. If the mouse is not on the ball but empty space, "findLastIndex" returns "-1"
  let i = balls.findLastIndex((ball) => ball.contains(mouseX, mouseY));

  /// 2-2. If statement whether to delete the ball or create a ball
  if (i !== -1) {
    /// 2-2-a. If "i" is NOT "-1", remove index "i" ball from the balls array
    balls.splice(i, 1);
  } else {
    /// 2-2-b. If "i" IS "-1", meaning mouse clicked on empty space,
    /// define ballN(new ball) for color (because color can differentiate it)
    let ballN = color(random(255), random(255), random(255), 180);
    /// creates new "Ball" object by giving "Ball" class with the value: the position of mouseX, mouseY, ballC color, radius
    balls.push(new Ball(mouseX, mouseY, ballN, random(10, 50)));
  }
}

//3.creatRandomBall and put it in the "balls" arrays by returning it to setup function
//** Difference between draw function and createRandomBall function: createRandomBall function only creates the ball conceptually and is not a loop while draw function is a loop that actually visualizes it
function createRandomBall() {
  // 3-1. Define the position and color randomly with the default radius 5
  // let the x position of the ball random from 0 to canvas width
  let ballX = random(0, width);
  // let the y position of the ball random from 0 to canvas height
  let ballY = random(0, height);
  // let the color and opacity of the ball
  let ballC = color(140, 0, 140 + random(-100, 100), 50);
  // let the ball radius
  let ballR = 5;

  // 3-2.Define ball
  let ball;
  // 3-2-1. give condition of the ball with 90% chance new "Ball" class, 10% chance "FlickerBall" class
  // FlickerBall means that the radius of the ball changes randomly - this is defined in ball.js as a child class
  // Give the x position, y position, color, radius defined above
  if (Math.random() < 0.9) {
    ball = new Ball(ballX, ballY, ballC, ballR);
  } else {
    ball = new FlickerBall(ballX, ballY, ballC, ballR);
  }

  // 3-3. Return the created ball to createRandomBall
  return ball;
}

//4. Assigning segmentation with the result returned by ml5 detecting the sillhoutte from video frame (later in draw function, it uses the defined segmentation)
function gotResults(result) {
  segmentation = result;
}
