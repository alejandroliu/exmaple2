
class TitleScreen extends BasicScreen {
  static TEXT_SIZE = 16;
  constructor(msg) {
    super();
    this.text = msg;
  }
  draw() {
    background('navy');
    textSize(TitleScreen.TEXT_SIZE);
    textAlign(CENTER);
    fill('yellow');
    text("Hi-Score: " + hi_score.toLocaleString(), CANVAS_WIDTH/2, TitleScreen.TEXT_SIZE );
    fill('red');
    text(this.text + "\nPress ENTER to play", CANVAS_WIDTH/2, (CANVAS_HEIGHT - TitleScreen.TEXT_SIZE)/2 );
  }
  keyPressed(key) {
    switch(key) {
    case KEY_ENTER:
      game_state = new GameScreen();
    }
  }
}
