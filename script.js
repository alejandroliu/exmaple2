const CANVAS_HEIGHT = 640;
const CANVAS_WIDTH = 480;
const KEY_SPACE = 32;
var game_state;

var sprites;

const SPR_PLAYER_X = 4;
const SPR_PLAYER_Y = 4;
const SPR_PLAYER_W = 60;
const SPR_PLAYER_H = 60;

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

class Player extends Actor {
  static Y_OFF = 50;
  constructor() {
    super(CANVAS_WIDTH/2,CANVAS_HEIGHT - Player.Y_OFF, SPR_PLAYER_W, SPR_PLAYER_H);
  }
  draw() {
    copy(sprites,SPR_PLAYER_X, SPR_PLAYER_Y, SPR_PLAYER_W, SPR_PLAYER_H, this.xpos, this.ypos, this.width, this.height);
  }
}

class GameScreen extends BasicScreen {
  constructor() {
    super();
    this.player = new Player();
  }
  move() {
    this.player.move();
  }
  draw() {
    background('black');
    this.player.draw();
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
  game_state.keyPressed(keyCode);
}

function keyReleased() {
  game_state.keyReleased(keyCode);
}