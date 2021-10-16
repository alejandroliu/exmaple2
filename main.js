
function preload() {
  sprites = loadImage('imgs/sprites.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  game_state = new TitleScreen("Welcome");
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