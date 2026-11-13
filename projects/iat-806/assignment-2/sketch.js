let mosquitos = [];
let numMosquitos = 10;
let bodySegmentation;
let video;
let segmentation;

let options = {
  maskType: "person",
};

async function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < numMosquitos; i++) {
    mosquitos.push(createRandomMosquito());
  }

  bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);

  // Create the video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodySegmentation.detectStart(video, gotResults);
}

function gotResults(result) {
  segmentation = result;
}

function draw() {
  background(10);
  // image(video, 0, 0);
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
  let mosquitoC = color(140, 0, 140 + random(-100, 100), 150);
  let mosquitoR = 5;

  return new Mosquito(mosquitoX, mosquitoY, mosquitoC, mosquitoR);
}
