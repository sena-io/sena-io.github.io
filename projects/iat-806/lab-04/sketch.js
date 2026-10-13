// IAT 806 · Lab 04 starter: the dancer grid from Week 4, ready for your website.
// Run with Live Server. Uses p5 2.x (async setup, await loadImage).

let frames = []; // the 8 dance poses
let frames2 = []; // TODO: load the jump poses into this array
let numFrames = 8;

let numCols = 20;
let numRows = 10;
let colWidth;
let rowHeight;

// 2D arrays: one color and one speed for every cell in the grid
let colors = [];
let speeds = [];

async function setup() {
  const canvas = createCanvas(800, 420);

  // puts the canvas inside <div id="sketch-holder"> in index.html
  canvas.parent("sketch-holder");

  for (let i = 0; i < numCols; i++) {
    colors[i] = [];
    speeds[i] = [];
    for (let j = 0; j < numRows; j++) {
      colors[i][j] = [random(1, 255), random(1, 255), random(1, 255)];
      speeds[i][j] = random(1, 10);
    }
  }
  colWidth = width / numCols;
  rowHeight = height / numRows;

  for (let i = 0; i < numFrames; i++) {
    let fileName = "dance_frames/fairy_" + i + ".png";
    frames.push(await loadImage(fileName));
  }

  for (let i = 0; i < 4; i++) {
    let fileName = "jump_frames/jump" + i + ".png";
    frames2.push(await loadImage(fileName));
  }
}

function draw() {
  background(120);
  //   if (mouseX < width) {
  //     numCols = Math.floor(map(mouseX, 0, width, 2, 20));
  //     // dist the mouse position and the position of the dancing profs
  //     // in the grid, and then use that number to map to the speed.
  //     colWidth = width / numCols;
  //   }

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      fill(colors[i][j][0], colors[i][j][1], colors[i][j][2], 120);
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight);

      // Find the center of each dancer's grid cell
      let x = i * colWidth + colWidth / 2;
      let y = j * rowHeight + rowHeight / 2;

      // Calculate distance from this dancer to the mouse
      let d = dist(x, y, mouseX, mouseY);

      // Find the maximum possible distance across the screen
      let maxDist = dist(0, 0, width, height);

      // Speed adjustment based on distance from mouse
      let distFactor = map(d, 0, maxDist, 0.2, 10);
      let speed = speeds[i][j] * distFactor;

      let danceFrames;
      if ((i + j) % 2 === 0) {
        danceFrames = frames; // 8개의 춤 포즈
      } else {
        danceFrames = frames2; // 4개의 점프 포즈
      }

      animate(danceFrames, speed, i * colWidth, j * rowHeight, colWidth);
    }
  }
}

// draws one dancer: which poses, how fast, where, and how big
function animate(
  danceFrames,
  speed,
  xPosition,
  yPosition,
  imageWidth,
  imageHeight,
) {
  // ⬇️ getFrameIndex에 현재 프레임 배열을 함께 전달합니다
  let index = getFrameIndex(danceFrames, speed);
  let currentFrame = danceFrames[index];
  let origWidth = currentFrame.width;
  let origHeight = currentFrame.height;
  if (imageWidth && !imageHeight) {
    let scale = imageWidth / origWidth;
    imageHeight = scale * origHeight;
  }
  image(currentFrame, xPosition, yPosition, imageWidth, imageHeight);
}

// ⬇️ getFrameIndex가 전달받은 배열의 길이를 사용하도록 수정합니다
function getFrameIndex(currentFrames, speed) {
  let slowFrame = Math.floor(frameCount / speed);
  let index = slowFrame % currentFrames.length;

  return index;
}
