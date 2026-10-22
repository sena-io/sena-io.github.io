class Ball {
  constructor(x, y, c, r, maxR = 20) {
    // it's like the instance saying, MY X is 400. In Python the keyword is self.x.
    this.x = x;
    this.y = y;
    this.originalColor = c;
    //this.color is the one that changes.
    this.color = c;
    this.highlightColor = color(255, 10, 10);
    // ALSO this is a diameter, not radius.
    // This is our mistake... we should have looked at the documentation.
    this.r = r;
    this.maxR = maxR;
    // TODO: if one of your methods needs a new attribute, create it here.
  }

  update(byHowMuch) {
    this.changeSize(byHowMuch);
    this.move(byHowMuch);
    this.show();
  }

  respond(active) {
    //gets the condition from sketch.js if mouse X, mouseY is inside the ball.
    if (active) {
      this.highlight(); //if the condition is "ture" > change the condition to "this.highlight" which is defined in the class
    } else {
      this.deHighlight();
    }
  }

  //method
  highlight() {
    // this.clicked = true;
    this.color = this.highlightColor;
  }

  deHighlight() {
    // this.clicked = false;
    this.color = this.originalColor;
  }

  //this is going to tell if point X and point Y is inside the colum
  contains(pointX, pointY) {
    let distance = dist(this.x, this.y, pointX, pointY);
    return distance < this.r;
  }

  move(byHowMuch) {
    // this.x = this.x + random(-5,5)
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  changeSize(byHowMuch) {
    // we fix the size like this:
    // the constrain is saying that it shouldn't grow larger than a certain amount.
    this.r = constrain(this.r + random(-byHowMuch, byHowMuch), 2, this.maxR);
  }

  show() {
    fill(this.color);
    circle(this.x, this.y, this.r * 2);
  }
}

function createRandomBall() {
  let ballX = random(0, width);
  let ballY = random(0, height);
  let ballC = color(20, 130, 140 + random(-100, 100), 120);
  let ballR = 10;
  let ball = new Ball(ballX, ballY, ballC, ballR);
  return ball;
}
