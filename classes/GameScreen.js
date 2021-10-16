
class GameScreen extends BasicScreen {
  static WINNING = 1;
  static DYING = -1;
  static PLAYING = 0;
  static TEXT_SIZE = 16;

  constructor() {
    super();
    this.player = new Player();
    this.invaders = Invader.setupAll();
    this.booms = [];
    this.ending = GameScreen.PLAYING;
    this.score = 0;
    this.lives = 3;
  }
  move() {
    this.player.move();
    Invader.moveAll(this.invaders);
    this.collide();
  }
  collide() {
    Invader.collideAll(this.invaders, this.player);
  }
  draw() {
    background('black');

    fill('red');
    textSize(GameScreen.TEXT_SIZE)
    textAlign(LEFT);
    text("Score: " + this.score, 0, GameScreen.TEXT_SIZE);
    textAlign(RIGHT);
    text("Lives: " + this.lives, CANVAS_WIDTH, GameScreen.TEXT_SIZE);
    
    this.player.draw();
    Invader.drawAll(this.invaders);
    if (this.booms.length > 0) {
      Boom.drawAll(this.booms);
      if (this.booms.length == 0) {
        // We spliced the last explosion...
        switch (this.ending) {
        case GameScreen.WINNING:
          this.restart();
          break;
        case GameScreen.DYING:
          if (this.lives == 0) {
            if (this.score > hi_score) {
              hiscore_msg = "\nNew Record!\n"
            } else {
              hiscore_msg = "";
            }
            game_state = new TitleScreen("GAME OVER\n"+hiscore_msg+"\nYour Score: " + this.score + "\n\nPress SPACE to Play Again!");
          } else {
            this.ending = GameScreen.PLAYING;
          }
          break;
        }
      }
    }
  }
  restart() {
    this.invaders = Invader.setupAll();
    this.ending = GameScreen.PLAYING;
  }
  keyPressed(key) {
    if (this.ending != GameScreen.PLAYING) return;
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
  boom(x,y,w,h) {
    this.booms.push(new Boom(x,y,w,h));
  }
  scoreAdd(cnt) {
    this.score += cnt;
  }
  winning() {
    // Player won!
    this.ending = GameScreen.WINNING;
    this.xspeed = 0;
  }
  dying(why) {
    // Player died
    let player = this.player;
    this.ending = GameScreen.DYING;
    this.boom(player.xpos, player.ypos, player.width, player.height);
    this.xspeed = 0;
    if (why == Invader.CRASH) {
      this.lives = 0; // This is an insta game over
    } else {
      this.lives--;
    }
  }
}
