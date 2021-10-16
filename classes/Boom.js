
class Boom extends Actor {
  static MILLIS = 500;
  constructor(x,y,w,h) {
    super(x,y,w,h);
    this.time = millis();
  }
  draw() {
    copy(sprites,SPR_BOOM[SPR_X], SPR_BOOM[SPR_Y], SPR_BOOM[SPR_W], SPR_BOOM[SPR_H], this.xpos, this.ypos, this.width, this.height);
  }
  static drawAll(booms) {
    for (let i=0; i < booms.length ; i++) {
      if (booms[i].time + Boom.MILLIS < millis()) {
        booms.splice(i,1); --i;
        continue;
      }
      booms[i].draw();
    }
  }
}
