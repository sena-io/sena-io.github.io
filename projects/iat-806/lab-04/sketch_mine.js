let frames = []; //arrays for putting images of the fairies
let frames2 = []; //
let numFrames = 7; //number of animations that will be called

let numCols = 8; // number of columns
let numRows = 6; // number of rows
let colWidth; // width of each box
let rowHeight; // heigth of each box
let colors = []; //arrays to assign random colors in each boxes
let speeds = []; // arrays to assign different animation speed

async function setup() {
  //async: wait until images are uploaded!
  createCanvas(800, 420);

  for (let i = 0; i < numCols; i++) {
    //starting a loop as much as the number of columns
    colors[i] = []; //assigning empty array for color
    speeds[i] = []; //assigning empty array for speed
    for (let j = 0; j < numRows; j++) {
      //starting loop as much as the number of rows
      colors[i][j] = random(1, 255); //assigning random colors between 1-255
      speeds[i][j] = random(1, 10); //assigning random speed
    }

    colWidth = width / numCols; //calculating the width of the small boxes
    rowHeight = height / numRows; //calculating the height of the small boxes

    for (let i = 0; i < numFrames; i++) {
      // loop as much as the number of frames
      let fileName = `dance_frames/fairy_${i}.png`; //defining filename
      frames.push(await loadImage(fileName)); // it "awaits" until the image comes, and "pushes" the frames at the end of arrays
      // frames.push(await loadImage(`dance_frames/fairy_${i}.png`)); => I can do this too instead of above two lines
    }
  }
}

function draw() {
  //drawing start!
  background(120); //**why? covers the remainder of previous's frame
  fill("black"); //defining the color of text/shapes that will be drawn

  numCols = map(mouseX, 0, width, 1, 20); //why> why 20? what does each space mean?
  text("number of columns" + " " + numCols, 500, 100);

  for (let i = 0; i < numCols; i++) {
    //for loop to draw boxes and change colors
    fill(0, 100, 100);
    // fill(0, random(1,250), random(0,250));
    for (let j = 0; j < numRows; j++) {
      //for loop as much as the number of Rows
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight);
      // fill(0, random(1,250), random(0,250)); //randomising each box!
    }
  }

  let speeds = 10;
  let imageWidth = 500;
  let imageHeight = 400;

  animate(frames, 10, 100, 100, 100); //animate(frames, speed, xPosition, yPosition, width, height)
  animate(frames, 20, 200, 100, 200); //these are the inputs for below animate function
  animate(frames, 30, 300, 100, 300);
  animate(frames, 40, 500, 100, 400);
}

function animate(frames, speed, xPosition, yPosition, imageWidth, imageHeight) {
  //lists of inputs
  let index = getFrameIndex(speed); //why > why is this here? index = frame number
  let currentFrame = frames[index]; //takes image out of the array
  let origWidth = currentFrame.width; //calls original width of the frame
  let origHeight = currentFrame.height; //calls original height of the frame
  if (imageWidth && !imageHeight) {
    //if image width is defined AND NOT image height,
    let scale = imageWidth / origWidth; //defining the scale: imageWidth (how it's defined) divided by original width (original)>> finding the scale
    //e.g., image width 200, original width 100 => the scale is 2
    //e.g., image width 100, origianl width 200 => the scale is 0.5
    imageHeight = scale * origHeight; //defining undefined imageHeight to match the scale
  }

  image(currentFrame, xPosition, yPosition, imageWidth, imageHeight);
  //gets all the input and finally draws it in the right size, right position
}

function getFrameIndex(speed) {
  //to find what frames to call based on the speed
  let slowFrame = Math.floor(frameCount / speed); //adjusting the speed
  let index = slowFrame % frames.length; // to give back the index of the loop as much as frame length

  return index; //giving index to be used in animate function
}
