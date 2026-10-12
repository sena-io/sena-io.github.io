let flowerImages = [];
let flowers = []; // Array to remember the data of each flower we click
let autoSpawn = false;
let petals = [];
let petalImg;

async function setup() {
  createCanvas(800, 600);

  // Your working image loader
  for (let i = 0; i < 8; i++) {
    let fileName = `images/flower${i}.png`;
    let img = await loadImage(fileName);
    flowerImages.push(img);
  }

  petalImg = await loadImage(`petals/petal.png`);
}

function draw() {
  background(0, 20, 100);

  //rectangle
  noFill;
  stroke(255, 255, 255);
  strokeWeight(1.5);
  rect(20, 20, 760, 560, 10);

  //line
  line(70, 0, 0, 70);
  line(730, 600, 800, 530);

  // If the switch is ON, roll a 100-sided die.
  // If the result is less than 5, spawn a flower!
  if (autoSpawn === true) {
    if (random(100) < 5) {
      let newFlower = {
        x: random(width), // Appears anywhere on the canvas width
        y: random(height), // Appears anywhere on the canvas height
        size: random(20, 100),
        img: random(flowerImages),
        spawnTime: millis(),
      };

      flowers.push(newFlower);
    }
  }

  // Loop backwards through the array
  for (let i = flowers.length - 1; i >= 0; i--) {
    let f = flowers[i];

    // Check if 10,000 milliseconds (10s) have passed
    if (millis() - f.spawnTime > 1500) {
      flowers.splice(i, 1); // Remove this flower from the array
    } else {
      drawFlower(f); // Draw it if it is still alive
    }
  }

  // Loop backwards through the petals array to update, draw, and remove them
  for (let i = petals.length - 1; i >= 0; i--) {
    let p = petals[i];

    // Move the petal down by its speed
    p.y += p.speed;

    rotate(p.angle);

    // Draw the petal
    imageMode(CENTER);
    image(petalImg, p.x, p.y, p.size, p.size);

    // If the petal falls past the bottom of the canvas, remove it
    if (p.y > height + 50) {
      petals.splice(i, 1);
    }
  }
}

function mousePressed() {
  // Save the flower data instead of just stamping it
  let newFlower = {
    x: mouseX,
    y: mouseY,
    size: random(20, 100),
    img: random(flowerImages),
    spawnTime: millis(),
  };

  flowers.push(newFlower);
}

function drawFlower(f) {
  noStroke(); // Removes the black outline from the shapes

  // Outer ripple (widest, lowest opacity)
  fill(255, 255, 255, 10);
  circle(f.x, f.y, f.size * 2);

  // Middle ripple
  fill(255, 255, 255, 30);
  circle(f.x, f.y, f.size * 1.5);

  // Inner ripple (tightest, highest opacity)
  fill(255, 255, 255, 60);
  circle(f.x, f.y, f.size * 1.2);

  // Draw the flower image on top
  imageMode(CENTER);
  image(f.img, f.x, f.y, f.size, f.size);
}

function keyPressed() {
  if (key === "r") {
    autoSpawn = true;
  } else if (key === "s") {
    autoSpawn = false;
  }
}

function keyPressed() {
  if (key === "r") {
    autoSpawn = true;
  } else if (key === "s") {
    autoSpawn = false;
  } else if (key === " ") {
    // Create a burst of 30 petals when spacebar is pressed
    for (let i = 0; i < 30; i++) {
      let newPetal = {
        x: random(width),
        y: random(-400, -50), // Start above the screen so they fall in naturally
        size: random(15, 35), // Petals are smaller than flowers
        speed: random(2, 6),
        // angle: random(TWO_PI)   // Random falling speed for parallax effect
      };
      petals.push(newPetal);
    }
  }
}
