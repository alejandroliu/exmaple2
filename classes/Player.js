

class Player extends Actor {
  static Y_OFF = 50;
  static MOVE_SPEED = 4;
  static WIDTH = 64;
  static HEIGHT = 64;
  static MAX_BULLETS = 4;

  constructor() {
    super(CANVAS_WIDTH/2,CANVAS_HEIGHT - Player.Y_OFF, Player.WIDTH, Player.HEIGHT);
    this.bullets = [];
  }
  draw() {
    copy(sprites,SPR_PLAYER[SPR_X], SPR_PLAYER[SPR_Y], SPR_PLAYER[SPR_W], SPR_PLAYER[SPR_H], this.xpos, this.ypos, this.width, this.height);
    Bullet.drawAll(this.bullets)
  }
  stop() {
    this.xspeed = 0;
  }
  left() {
    this.xspeed = -Player.MOVE_SPEED;
  }
  right() {
    this.xspeed = Player.MOVE_SPEED;
  }
  move() {
    if (this.xspeed < 0 && this.xpos <= 0) return;
    if (this.xspeed > 0 && this.xpos > CANVAS_WIDTH - this.width) return;
    super.move();
    Bullet.moveAll(this.bullets)
  }
  fire() {
    if (this.bullets.length < Player.MAX_BULLETS) {
      let b = new Bullet(this.xpos + Player.WIDTH/2, this.ypos, -1);
      this.bullets.push(b);
    }
  }
  takeBullets(bullets) {
    for (let b = 0; b < bullets.length ; b++) {
      if (!this.isCrash(bullets[b])) continue;
      bullets.splice(b,1); b--;
      game_state.dying(BULLET_HIT);
    }
  }
}
