var game_state;
var sprites;

const CANVAS_HEIGHT = 640;
const CANVAS_WIDTH = 480;

const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

const SPR_X = 0;
const SPR_Y = 1;
const SPR_W = 2;
const SPR_H = 3;
const SPR_PLAYER = [ 4, 4, 60, 60 ];
const SPR_UFO = [ 15, 80, 121, 57 ];
const SPR_ALIENS_A = [
  [ 138, 77,  97, 60 ],
  [ 14, 148, 79, 59 ],
  [ 190, 148, 70, 62 ]
];
const SPR_ALIENS_B = [
  [ 242, 77,  89, 60 ],
  [ 104, 147, 83, 64 ],
  [ 274, 151, 67, 61 ]
];

class BasicScreen {
  constructor() {}
  move() {}
  draw() {}
  keyPressed(keycode) {}
  keyReleased(keycode) {}
}

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
}

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
  isOffScreen() {
    if (this.ypos < 0 || this.ypos > CANVAS_HEIGHT) {
      return true;
    }
    return false;
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
      let b = new Bullet(this.xpos - Player.WIDTH/2, this.ypos, -1);
      this.bullets.push(b);
    }
  }
}

class Invader extends Actor {
  static WIDTH = 32;
  static HEIGHT = 32;
  static MOVE_SPEED = 8;
  static MAX_ROWS = 3;
  static MAX_COLS = 6;
  static MAX_TYPES = 3;
  static X_OFF = 10;
  static Y_OFF = 40;

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
    Invader.sprite_set = 1 - Invader.sprite_set;
    for (let i = 0; i < invaders.length ; i++) {
      invaders[i].move();
    }
  }
}


class GameScreen extends BasicScreen {
  constructor() {
    super();
    this.player = new Player();
    this.invaders = Invader.setupAll();
  }
  move() {
    this.player.move();
    Invader.moveAll(this.invaders);
  }
  draw() {
    background('black');
    this.player.draw();
    Invader.drawAll(this.invaders);
  }
  keyPressed(key) {
    switch(key) {
    case KEY_LEFT:
      this.player.left();
      break;
    case KEY_RIGHT:
      this.player.right();
      break;
    case KEY_SPACE:
      this.player.fire();
      break;
    }
  }
  keyReleased(key) {
    switch(key) {
    case KEY_LEFT:
    case KEY_RIGHT:
      this.player.stop();
      break;
    }
  }
}

class TitleScreen extends BasicScreen {
  constructor() {
    super();
  }
  draw() {
    background('navy');
    fill('red');
    textAlign(CENTER);
    text("Welcome\nPress SPACE to play", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
  }
  keyPressed(key) {
    switch(key) {
    case KEY_SPACE:
      game_state = new GameScreen();
    }
  }
}

function preload() {
  sprites = loadImage('imgs/sprites.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  game_state = new TitleScreen();
}

function draw() {
  game_state.move();
  game_state.draw();
}

function keyPressed() {
  console.log("PRESSED: "+keyCode)
  game_state.keyPressed(keyCode);
}

function keyReleased() {
  game_state.keyReleased(keyCode);
}