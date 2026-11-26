let video;
let handPose;

let hands = [];

let options = {
  flipped: true,
};

async function setup() {
  createCanvas(800, 600);

  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();

  handPose = await ml5.handPose(options);
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(220);
  push();
  translate(width, 0); // Move origin to the right edge
  scale(-1, 1); // Flip the X axis backwards

  imageMode(CORNER);
  image(video, 0, 0, width, height);
  pop();

  // Loop through the "hands" array to fetch each detected hand.

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    // Iterate through all the keypoints of the current hand.
    if (hand.handedness === "Left") {
      fill(0, 255, 0);
    } else {
      fill(255, 0, 0);
    }
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];

      // Finally, draw a green circle at the location of the keypoint.
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

function gotHands(results) {
  hands = results;
}
