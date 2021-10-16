
class Actor {
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
  isHit(x,y) {
    return ((this.xpos < x && x < this.xpos + this.width) && (this.ypos < y && y < this.ypos + this.height));
  }
  isRectHit(x,y,w,h) {
    return (this.isHit(x,y) || this.isHit(x+w,y) || this.isHit(x,y+h) || this.isHit(x+w,y+h));
  }
  isCrash(actor) {
    return this.isRectHit(actor.xpos, actor.ypos, actor,width, actor.height);
  }
}
