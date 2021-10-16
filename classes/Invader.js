
class Invader extends Actor {
  static WIDTH = 32;
  static HEIGHT = 32;
  static MOVE_SPEED = 8;
  static MAX_ROWS = 3;
  static MAX_COLS = 6;
  static MAX_TYPES = 3;
  static X_OFF = 10;
  static Y_OFF = 40;
  static CRASH = 1;

  static xspeed = 0;
  static yspeed = 0;
  static sprite_set = 0;

  constructor(type, x,y) {
    super(x, y, Invader.WIDTH, Invader.HEIGHT);
    this.type = type;
  }
  move() {
    this.xpos += Invader.xspeed;
    this.ypos += Invader.yspeed;
  }
  draw() {
    let rect;
    if (Invader.sprite_set) {
      rect = SPR_ALIENS_A[this.type];
    } else {
      rect = SPR_ALIENS_B[this.type];
    }
    copy(sprites, rect[SPR_X], rect[SPR_Y], rect[SPR_W], rect[SPR_H], this.xpos, this.ypos, this.width, this.height);
  }
  checkSide() {
    if (this.xpos < Invader.X_OFF) return Invader.MOVE_SPEED;
    if (this.xpos > CANVAS_WIDTH - Invader.WIDTH) return -Invader.MOVE_SPEED;
    return 0;
  }
  score() {
    return CANVAS_HEIGHT - this.ypos;
  }

  static setupAll() {
    let invaders = [];
    for (let row = 0; row < Invader.MAX_ROWS ; row++) {
      for (let col = 0; col < Invader.MAX_COLS ; col++) {
        let inv = new Invader(row % Invader.MAX_TYPES, Invader.X_OFF + col * Invader.WIDTH * 2, Invader.Y_OFF + row * Invader.HEIGHT * 2 );
        invaders.push(inv);
      }
    }
    Invader.xspeed = Invader.MOVE_SPEED;
    Invader.yspeed = 0;
    return invaders;
  }
  static drawAll(invaders) {
    Invader.sprite_set = 1 - Invader.sprite_set;
    for (let i = 0; i < invaders.length ; i++) {
      invaders[i].draw();
    }
  }
  static moveAll(invaders) {
    // First we determine the direction we should move...
    for (let i = 0; i < invaders.length ; i++) {
      let d = invaders[i].checkSide();
      if (d == 0) continue;
      if (Invader.yspeed == 0) {
        Invader.yspeed = Invader.MOVE_SPEED;
        Invader.xspeed = 0;
      } else {
        Invader.yspeed = 0;
        Invader.xspeed = d;
      }
    }

    for (let i = 0; i < invaders.length ; i++) {
      invaders[i].move();
    }
  }
  static collideAll(invaders, player) {
    // First we determine the direction we should move...
    for (let i = 0; i < invaders.length ; i++) {
      if (invaders[i].ypos > CANVAS_HEIGHT - Invader.HEIGHT || invaders[i].isCrash(player)) {
        game_state.dying(Invader.CRASH);
      }
      let bullets = player.bullets;
      for (let b = 0; b < bullets.length ; b++) {
        if (invaders[i].isCrash(bullets[b])) {
          game_state.scoreAdd(invaders[i].score());
          // Explode...
          game_state.boom(invaders[i].xpos, invaders[i].ypos, invaders[i].width, invaders[i].height);
          bullets.splice(b,1); b--;
          invaders.splice(i,1); i--;
          if (i < 0) i = 0;
          if (i >= invaders.length) break;
        }
      }
    }
    if (invaders.length == 0) game_state.winning();
  }
}

