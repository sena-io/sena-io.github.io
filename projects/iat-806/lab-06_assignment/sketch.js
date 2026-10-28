let balls = [];
let bodySegmentation;
let numBalls = 2000;
let video;
let segmentation; //the video result that we are going to use
let options = {
  maskType: "person",
};

// Make sure to add "async" before "function setup()".

async function setup() {
  // Wait until the BodySegmentation model is fully loaded.
  const canvas = createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  bodySegmentation = await ml5.bodySegmentation("BodyPix", options);
  bodySegmentation.detectStart(video, gotResults); //get the video and pass the result

  for (let i = 0; i < numBalls; i++) {
    let ball = createRandomBall();
    balls.push(ball);
  }
}

function draw() {
  background(120);

  // image(video, 0, 0);
  // giving the full image of

  //// # makes the segmentation visible
  // if (segmentation) {
  //   image(segmentation.mask, 0, 0, width, height);
  // }

  // for (let ball of balls) {
  //   let byHowMuch = 1;
  //   // let active = ball.contains(mouseX, mouseY); //checkiing if mouse X, mouse Y is inside the ball
  //   let active = ball.isOnBody(segmentation.mask); //checkiing if mouse X, mouse Y is inside the ball
  //   ball.respond(active); //defines the color
  //   ball.update(byHowMuch); //drawing the ball
  //   // ball.update(1);
  // }
  for (let ball of balls) {
    let byHowMuch = 1;
    let active = false; // default: not on the body

    if (segmentation) {
      active = ball.isOnBody(segmentation.mask);
      ball.respond(active);
    }

    //defines the color
    ball.update(byHowMuch); //drawing the ball
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
  });
}

//whenever the model has results, take the result and use it
function gotResults(result) {
  segmentation = result;
}
