
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
    this.bullets = [];
    this.ending = GameScreen.PLAYING;
    this.score = 0;
    this.lives = 3;
  }
  restart() {
    this.player = new Player();
    this.invaders = Invader.setupAll();
    this.booms = [];
    this.bullets = [];
    this.ending = GameScreen.PLAYING;
  }
  move() {
    this.player.move();
    Invader.moveAll(this.invaders);
    Bullet.moveAll(this.bullets);
    this.collide();
  }
  collide() {
    Invader.collideAll(this.invaders, this.player);
    this.player.takeBullets(this.bullets);
  }
  shooting(b) {
    this.bullets.push(b);
  }
  checkEnding() {
    switch (this.ending) {
    case GameScreen.WINNING:
      this.restart();
      break;
    case GameScreen.DYING:
      if (this.lives == 0) {
        let hiscore_msg = "";
        if (this.score > hi_score) {
          hiscore_msg = "\nNew Record!\n"
          hi_score = this.score;
        }
        game_state = new TitleScreen("GAME OVER\n"+hiscore_msg+"\nYour Score: " + this.score.toLocaleString() + "\n");
      } else {
        this.ending = GameScreen.PLAYING;
      }
      break;
    }
  }
  draw() {
    background('black');

    fill('red');
    textSize(GameScreen.TEXT_SIZE)
    textAlign(LEFT);
    text("Score: " + this.score.toLocaleString() , 0, GameScreen.TEXT_SIZE);
    textAlign(CENTER);
    text("Hi-Score: " + hi_score.toLocaleString(), CANVAS_WIDTH/2, GameScreen.TEXT_SIZE);
    textAlign(RIGHT);
    text("Lives: " + this.lives, CANVAS_WIDTH, GameScreen.TEXT_SIZE);
    
    this.player.draw();
    Invader.drawAll(this.invaders);
    Bullet.drawAll(this.bullets);
    if (this.booms.length > 0) {
      Boom.drawAll(this.booms);
      if (this.booms.length == 0) {
        // We spliced the last explosion...
        this.checkEnding();
      }
    }
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
    if (why == INVADER_CRASH) {
      this.lives = 0; // This is an insta game over
    } else {
      this.lives--;
      if (this.lives < 0) this.lives = 0;
    }
  }
}
