const CANVAS_HEIGHT = 640;
const CANVAS_WIDTH = 480;
const KEY_SPACE = 32;
var game_state; // 0 

class BasicScreen {
  constructor() {}
  draw() {}
  keyPressed(keycode) {}
  keyReleased(keycode) {}
}

class Actor {
  constructor(x,y) {
    this.xpos = x;
    this.ypos= y;
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
  const PLAYER_YOFF = 50;
  constructor() {
    super(CANVAS_WIDTH/2,CANVAS_HEIGHT - PLAYER_YOFF);
  }
  
}


class GameScreen extends BasicScreen {
  constructor() {
    super();
    this.player = new Player();
  }
  draw() {
    background('black');

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

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  game_state = new TitleScreen();
}

function draw() {
  game_state.draw();
}

function keyPressed() {
  game_state.keyPressed(keyCode);
}

function keyReleased() {
  game_state.keyReleased(keyCode);
}