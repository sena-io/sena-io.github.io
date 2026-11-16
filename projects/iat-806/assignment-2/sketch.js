let mosquitos = [];
let numMosquitos = 10;
let bodySegmentation;
let video;
let segmentation;
let started = false;
let ready = false;
let startImg;
let mosquitoImg;
let mosquitoLiveImg;
let mosqquitoDeadImg;

let options = {
  maskType: "person",
};

async function setup() {
  createCanvas(800, 600);
  startImg = await loadImage("game/start.png");
  mosquitoLiveImg = await loadImage("game/mosquito_live.png");
  mosqquitoDeadImg = await loadImage("game/mosquito_dead.png");
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
  // image(video, 0, 0);

  if (!started) {
    push();
    imageMode(CENTER);
    image(startImg, width / 2, height / 2, width, height);
    pop();
    // fill(255);
    // noStroke();
    // textSize(40);
    // textAlign(CENTER, CENTER);
    // text(ready ? "Click to start" : "Loading...", width / 2, height / 2);
    return; // skip the mosquito logic until the user clicks
  }

  for (let mosquito of mosquitos) {
    let onBody = segmentation && mosquito.isOnBody(segmentation.mask);

    let active = mosquito.contains(mouseX, mouseY) || onBody;

    mosquito.respond(active);

    mosquito.update(1);
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
  }
}
