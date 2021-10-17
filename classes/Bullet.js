
class Bullet extends Actor {
  static WIDTH = 4;
  static HEIGHT = 12;
  static MOVE_SPEED = 4;

  constructor(x,y,d) {
    super(x - Bullet.WIDTH/2,y - Bullet.HEIGHT/2,Bullet.WIDTH, Bullet.HEIGHT);
    if (d > 0) {
      this.yspeed = Bullet.MOVE_SPEED;
    } else {
      this.yspeed = -Bullet.MOVE_SPEED;
    }
  }
  draw() {
    fill('yellow');
    rect(this.xpos, this.ypos, this.width, this.height);
  }

  static moveAll(bullets) {
    for (let i=0; i < bullets.length ; i++) {
      if (bullets[i].isOffScreen()) {
        bullets.splice(i,1);
        --i;
        continue;
      }
      bullets[i].move();
    }
  }
  static drawAll(bullets) {
    for (let i=0; i < bullets.length ; i++) {
      bullets[i].draw();
    }
  }
}
