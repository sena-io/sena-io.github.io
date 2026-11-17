// this is how we define a class
// attributes
// methods
// this is a blueprint for creating stuff.
// We can create new balls using this.
class Mosquito {
  constructor(x, y, img, r) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.baseR = r;
    this.r = r;
  }

  update(byHowMuch) {
    this.move(byHowMuch);
    this.show();
  }

  move(byHowMuch) {
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }


  contains(px, py) {
    if (dist(this.x, this.y, px, py) < this.r) {
      return true;
    } else {
      return false;
    }
  }


  show() {
    push(); // Save the default settings
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.r * 2, this.r * 2);
    pop(); // Restore the default settings so it doesn't leak
  }
}
