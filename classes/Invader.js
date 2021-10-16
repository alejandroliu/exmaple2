
class Invader extends Actor {
  static WIDTH = 32;
  static HEIGHT = 32;
  static MOVE_SPEED = 8;
  static MAX_ROWS = 3;
  static MAX_COLS = 6;
  static MAX_TYPES = 3;
  static X_OFF = 10;
  static Y_OFF = 40;
  static FIRE_RATE = 6000;

  static xspeed = 0;
  static yspeed = 0;
  static sprite_set = 0;
  static last_shot = 0;

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
  shoot() {
    let b = new Bullet(this.xpos + Invader.WIDTH/2, this.ypos + Invader.HEIGHT, 1);
    game_state.shooting(b);
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

    Invader.last_shot = millis();
    return invaders;
  }
  static drawAll(invaders) {
    Invader.sprite_set = 1 - Invader.sprite_set;
    for (let i = 0; i < invaders.length ; i++) {
      invaders[i].draw();
    }
  }
  static moveAll(invaders) {
    if (invaders.length == 0) return;

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

    // Move aliens
    for (let i = 0; i < invaders.length ; i++) {
      invaders[i].move();
    }

    let shoot_chance = (millis() - Invader.last_shot) / Invader.FIRE_RATE;
    if (random() > shoot_chance) return;

    Invader.last_shot = millis();

    // Choose a possible shooter...
    let lanes = [];
    let i;
    for (i = 0; i < invaders.length ; i++) {
      let xpos = invaders[i].xpos;
      let ypos = invaders[i].ypos;
      if (lanes[xpos]) {
        if (lanes[xpos][0] >= ypos) continue;
      }
      lanes[xpos] = [ ypos, i ];
    }
    let shooters = lanes.filter(function (x) { return x !== undefined && x != null; });
    //console.log("Shooter candidates: " + shooters.length)
    //for (i = 0; i < shooters.length ; i++) {
      //console.log(shooters[i]);
    //}
    i = shooters[int(random(shooters.length))][1];
    // console.log("Selected: "+i);
    //i = shooters[random(shooters.length)][1];
    //
    invaders[i].shoot();
  }
  static collideAll(invaders, player) {
    // First we determine the direction we should move...
    for (let i = 0; i < invaders.length ; i++) {
      if (invaders[i].ypos > CANVAS_HEIGHT - Invader.HEIGHT || invaders[i].isCrash(player)) {
        game_state.dying(INVADER_CRASH);
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

