let mosquitos = [];
let numMosquitos = 10;
let bodySegmentation;
let video;
let segmentation;
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
let timeLeft = 10;
let timer = 0;

let options = {
  maskType: "person",
};

async function setup() {
  createCanvas(800, 600);
  startImg = await loadImage("game/start.png");
  mosquitoLiveImg = await loadImage("game/mosquito_live.png");
  mosqquitoDeadImg = await loadImage("game/mosquito_dead.png");
  winImg = await loadImage("game/win.png");
  gameOverImg = await loadImage("game/gameover.png");

  // mosquitoSounds = sounds.push(await loadSound("sounds/sound" + i + ".wav"));

  for (let i = 0; i < numMosquitos; i++) {
    mosquitos.push(createRandomMosquito());
  }

  bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);

  // Create the video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);
  ready = true;
}

function gotResults(result) {
  segmentation = result;
}

function draw() {
  background(10);
  // image(video, width / 2, height / 2, 800, 600);

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

  //Playing
  // checking if it's on the body(or hand) and if it is, remove it from the array and icrease the score
  for (let i = mosquitos.length - 1; i >= 0; i--) {
    //definding mosquito's number in the array
    let mosquito = mosquitos[i];
    // checking it the mosquito is on the body using the segmentation mask
    // checking if the segmentation is ready so that it doesn't crash
    // ** I've tried to use "catch" as a variable name but it didn't work because "catch" is a reserved word in JavaScript
    let isCaught = segmentation && mosquito.isOnBody(segmentation.mask);

    if (isCaught) {
      // increase the score
      score++;
      // remove the mosquito from the array
      mosquitos.splice(i, 1); // Remove the mosquito from the array
    } else {
      // update and show the mosquito
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

  let timeLeft = 10 - Math.floor((millis() - timer) / 1000);

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
  if (ready && !started) {
    started = true;
    timer = millis(); // Start the timer
  } else if (gameOver || success) {
    // Reset the game
    score = 0;
    timeLeft = 60;
    timer = millis();
    gameOver = false;
    success = false;
    started = false;

    // Reset the mosquitos array
    mosquitos = [];
    for (let i = 0; i < numMosquitos; i++) {
      mosquitos.push(createRandomMosquito());
    }
  }
}
