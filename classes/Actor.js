
class Actor {
  // Base class of objects that move accross the playing field
  constructor(x,y,w,h) {
    this.xpos = x;
    this.ypos= y;
    this.width = w;
    this.height = h;
    this.xspeed = 0;
    this.yspeed = 0;
  }
  move() {
    this.xpos += this.xspeed;
    this.ypos += this.yspeed;
  }
  draw() {}
  // Check if this coordinate is within the bounding rectangle
  isHit(x,y) {
    return ((this.xpos < x && x < this.xpos + this.width) && (this.ypos < y && y < this.ypos + this.height));
  }
  // Check if this rectangle is colliding with a rectangle
  isRectHit(x,y,w,h) {
    return (this.isHit(x,y) || this.isHit(x+w,y) || this.isHit(x,y+h) || this.isHit(x+w,y+h));
  }
  // Check a collision between actors
  isCrash(actor) {
    return this.isRectHit(actor.xpos, actor.ypos, actor,width, actor.height);
  }
  isOffScreen() {
    if (this.ypos < 0 || this.ypos > CANVAS_HEIGHT) {
      return true;
    }
    if (this.xpos < 0 || this.xpos > CANVAS_WIDTH) {
      return true;
    }
    return false;
  }

}
