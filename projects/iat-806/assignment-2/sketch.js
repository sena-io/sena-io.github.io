let mosquitos = [];
let numMosquitos = 10;
// let bodySegmentation;
let video;
// let segmentation;
let started = false;
let ready = false;
let success = false;
let gameOver = false;

let startImg;
let mosquitoImg;
let mosquitoLiveImg;
let mosqquitoDeadImg;
let winImg;
let gameOverImg;

let score = 0;
let timeLeft;
let timer = 0;

let mosquitoSound;
let clapSound;
let isClapping = false;

let options = {
  flipped: true,
};
// let options = {
//   maskType: "person",
// };

let handPose;
let hands = [];

function loadSoundAsync(path) {
  return new Promise((resolve, reject) => {
    loadSound(path, resolve, reject);
  });
}

async function setup() {
  createCanvas(800, 600);
  startImg = await loadImage("game/start.png");
  mosquitoLiveImg = await loadImage("game/mosquito_live.png");
  mosqquitoDeadImg = await loadImage("game/mosquito_dead.png");
  winImg = await loadImage("game/win.png");
  gameOverImg = await loadImage("game/gameover.png");
  // mosquitoSound = await loadSoundAsync("sounds/mosquito.wav");
  // clapSound = await loadSoundAsync("sounds/clap.wav");

  try {
    mosquitoSound = await loadSound("sounds/mosquito.wav");
    clapSound = await loadSound("sounds/clap.wav");
    console.log("sounds loaded", mosquitoSound, clapSound);
  } catch (err) {
    console.error("Sound failed to load:", err);
  }

  // mosquitoSounds = sounds.push(await loadSound("sounds/sound" + i + ".wav"));

  for (let i = 0; i < numMosquitos; i++) {
    mosquitos.push(createRandomMosquito());
  }

  //previous code
  // bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);

  // Create the video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  //previous code
  // bodySegmentation.detectStart(video, gotResults);

  // Load the handpose model
  handPose = await ml5.handPose(options);

  // Start detecting hands
  handPose.detectStart(video, gotResults);

  ready = true;
}

function gotResults(result) {
  hands = result;
}

function draw() {
  background(10);

  push();
  translate(width, 0); // Move origin to the right edge
  scale(-1, 1); // Flip the X axis backwards

  imageMode(CORNER);
  image(video, 0, 0, width, height);
  pop();

  //visual debug
  for (let i = 0; i < hands.length; i++) {
    let indexFinger = hands[i].index_finger_tip;
    fill(0, 255, 0); // Bright green
    noStroke();
    circle(indexFinger.x, indexFinger.y, 20);
  }

  if (!started) {
    push();
    imageMode(CENTER);
    image(startImg, width / 2, height / 2, width, height);
    pop();
    return; // skip the mosquito logic until the user clicks
  }

  // Success
  if (success == true) {
    push();
    imageMode(CENTER);
    image(winImg, width / 2, height / 2, 400, 200);
    pop();
    return;
  }

  // Game Over
  if (gameOver == true) {
    push();
    imageMode(CENTER);
    image(gameOverImg, width / 2, height / 2, 400, 200);
    pop();
    return;
  }

  // --- 1. DETECT THE CLAP ONCE PER FRAME ---
  let clapX = null;
  let clapY = null;

  if (hands.length === 2) {
    let hand1 = hands[0].index_finger_tip;
    let hand2 = hands[1].index_finger_tip;
    let clapDistance = dist(hand1.x, hand1.y, hand2.x, hand2.y);

    if (clapDistance < 150) {
      // Calculate the center point of the clap
      clapX = (hand1.x + hand2.x) / 2;
      clapY = (hand1.y + hand2.y) / 2;

      // Only play the sound if we weren't ALREADY clapping
      if (!isClapping) {
        clapSound.play();
        isClapping = true;
      }
    } else {
      // Hands moved apart, reset so the player can clap again
      isClapping = false;
    }
  }

  // --- 2. UPDATE MOSQUITOS ---
  for (let i = mosquitos.length - 1; i >= 0; i--) {
    let mosquito = mosquitos[i];
    let isCaught = false;

    // If a clap happened this frame, check if it hit this specific mosquito
    if (clapX !== null && clapY !== null) {
      if (mosquito.contains(clapX, clapY)) {
        isCaught = true;
      }
    }

    if (isCaught) {
      score++;
      mosquitos.splice(i, 1);
    } else {
      mosquito.update(1);
    }
  }

  // Show the score
  fill(255);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  if (score == numMosquitos) {
    success = true;
  }

  // Show the time left

  let timeLeft = 30 - Math.floor((millis() - timer) / 1000);

  if (timeLeft > 0) {
    text(
      // rounding up the time left to the nearest second and subtracting it from the total time
      "Time Left: " + timeLeft,
      10,
      50,
    );
  } else if (timeLeft === 0) {
    text("Time Left: 0", 10, 50);
    gameOver = true;
  }
}

function createRandomMosquito() {
  let mosquitoX = random(0, width);
  let mosquitoY = random(0, height);
  let mosquitoR = 20;

  return new Mosquito(mosquitoX, mosquitoY, mosquitoLiveImg, mosquitoR);
}

function mousePressed() {
  userStartAudio();
  console.log("audio context:", getAudioContext().state);

  if (ready && !started) {
    started = true;
    timer = millis();

    mosquitoSound.setLoop(true);
    mosquitoSound.play();

    setTimeout(() => {
      console.log("after 500ms:", mosquitoSound.playing, mosquitoSound.started);
    }, 500);
  } else if (gameOver || success) {
    mosquitoSound.stop();
    score = 0;
    timer = millis();
    gameOver = false;
    success = false;
    started = false;

    mosquitos = [];
    for (let i = 0; i < numMosquitos; i++) {
      mosquitos.push(createRandomMosquito());
    }
  }
}
