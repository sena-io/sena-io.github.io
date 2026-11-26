let video;
let handPose;

let hands = [];
let hand;
let tipDist;
let jointDist;

let options = {
  flipped: true,
};

let wrist;
let indexJoint;
let indexTip;
let fingers = [
  { name: "Thumb", tip: 4, joint: 3 },
  { name: "Index", tip: 8, joint: 6 },
  { name: "Middle", tip: 12, joint: 10 },
  { name: "Ring", tip: 16, joint: 14 },
  { name: "Pinky", tip: 20, joint: 18 },
];

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

    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      if (hand.handedness === "Left") {
        fill(0, 255, 0);
      } else {
        fill(255, 0, 0);
      }
      // Finally, draw a green circle at the location of the keypoint.
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
    let wrist = hand.keypoints[0];
    let indexJoint = hand.keypoints[6];
    let indexTip = hand.keypoints[8];

    let tipDist = dist(indexTip.x, indexTip.y, wrist.x, wrist.y);
    let jointDist = dist(indexJoint.x, indexJoint.y, wrist.x, wrist.y);

    if (tipDist < jointDist) {
      circle(indexTip.x, indexTip.y, 30);
    }
  }
}

function gotHands(results) {
  hands = results;
}
