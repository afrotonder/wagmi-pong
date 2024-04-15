import Phaser from "phaser";
import * as SceneKeys from "../constants/SceneKeys";
import * as Colors from "../constants/Colors";
import * as Audio from "../constants/Audio";
import * as wagmiballz from "../constants/wagmiballz";
// import Pause from '../scenes/Pause'

const GameState = {
  Running: "running",
  Paused: "paused",
  PlayerWon: "player-won",
  AIWon: "ai-won",
};

export default class Game extends Phaser.Scene {
  init(data) {
    this.gameState = GameState.Running;
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
    this.rightScore = 0;
    this.leftScore = 0;
    this.paused = false;

    this.selectedAsset = data.selectedBall;
  }

  preload() {}

  create() {
    // let keyA;
    // let keyS;
    // let keyD;
    // let keyW;
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.sound.loop = true;
    // this.sound.once('loop', function(music, loop){});
    let audioConfig = {
      loop: true,
      volume: 0.3
    }
    
    this.sound.play(Audio.Title, audioConfig);

    let assets = wagmiballz.wagmiballz.filter((ball) => ball.attributes.length > 0);

    this.color = assets[this.selectedAsset].attributes[1].value.replace("#", "0x");

    this.scene.run(SceneKeys.GameBackground);

    this.scene.sendToBack(SceneKeys.GameBackground);

    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, this.color, 10);

    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(10);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setMaxSpeed(1600);
    this.ball.body.setCollideWorldBounds(true, 1, 1);

    this.time.delayedCall(1500, () => {
      this.resetBall();
    });

    this.paddleLeft = this.add.rectangle(50, 250, 20, 100, 0xffffff, 1);
    this.physics.add.existing(this.paddleLeft, true); // true makes it static and not move back when ball collides
    this.physics.add.collider(
      this.paddleLeft,
      this.ball,
      this.handdlePaddleBallCollision,
      undefined,
      this
    );

    this.paddleRight = this.add.rectangle(750, 250, 20, 100, 0xffffff, 1);
    this.physics.add.existing(this.paddleRight, true); // true makes it static and not move back when ball collides
    this.physics.add.collider(
      this.paddleRight,
      this.ball,
      this.handdlePaddleBallCollision,
      undefined,
      this
    );

    this.physics.world.on(
      "worldbounds",
      this.handleBallWorldBoundsCollision,
      this
    );

    const scoreStyle = {
      fontSize: 48,
      fontFamily: SceneKeys.Font,
    };

    this.leftScoreLabel = this.add
      .text(300, 125, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    this.rightScoreLabel = this.add
      .text(500, 375, "0", scoreStyle)
      .setOrigin(0.5, 0.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    // TODO: removing pause since this will be a quick experience for most users.
    // This is working if its ever needed
    // this.input.keyboard.on('keydown-P', () => {
    //     this.pauseGame()
    // } )
    // listens to when game is resumed
    // this.events.on('resume', this.resumeGame, this)

    //FIXME:  this never really worked, but was my attempt at trying to pause music
    // this.input.keyboard.on('keydown-M', () => {
    //     this.sound.pause(Audio.Title)
    // } )
  }

  // Resumes game scene
  resumeGame() {
    this.paused = false;
    this.scene.resume(Game);
  }

  //  Pauses game
  // FIXME: when game is paused, obstacle timeouts arrent and eventually fade away, leaving the user with a clean table
  pauseGame() {
    this.paused = !this.paused;

    if (this.paused) {
      this.scene.pause();
      this.scene.launch(SceneKeys.Pause);
    } else {
      // TODO: try to incorporate the spacebar-resume method into this else so it all happens in one place.
      console.log("RESUME");
    }
  }

  // Makes sound when game sprite touches world bounds
  // FIXME: ESTO NO FFUNCIONA
  handleBallWorldBoundsCollision(body, up, down, left, right) {
    this.sound.play(Audio.Paddle);
  }

  //Plays sound when paddle is hit
  handdlePaddleBallCollision(paddle, ball) {
    this.sound.play(Audio.Paddle);

    /** @type {Phaser.Physics.Arcade.Body} */
    const body = this.ball.body;
    const vel = body.velocity;

    vel.x *= 1.1;
    vel.y *= 1.1;

    body.setVelocity(vel.x, vel.y);
  }

  // update game
  update() {
    // pause or finish game
    if (this.paused || this.gameState !== GameState.Running) {
      return;
    }

    // player 1 input
    this.player1();

    // AI paddle logic
    this.updateAI();

    // Update score if ball passes edges
    this.updateScore();
  }

  // update AI paddle
  updateAI() {
    const diff = this.ball.y - this.paddleRight.y;

    if (Math.abs(diff) < 10) {
      return;
    }

    const aiSpeed = 4; // 8 // 10 12 // 10, 12 feels good but is too OP

    if (diff < 0) {
      //  ball above paddle
      this.paddleRightVelocity.y = -aiSpeed;

      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10;
      }
    } else if (diff > 0) {
      this.load.audio(Audio.Score, "assets/score.wav");

      // ball below paddle
      this.paddleRightVelocity.y = aiSpeed;

      if (this.paddleRightVelocity.y > 10) {
        this.paddleRightVelocity.y = 10;
      }
    }

    this.paddleRight.y += this.paddleRightVelocity.y;
    this.paddleRight.body.updateFromGameObject();
  }

  // Updates score board when ball is out of bounds
  updateScore() {
    const x = this.ball.x;
    const leftBounds = -30;
    const rightBounds = 830;

    if (x >= leftBounds && x <= rightBounds) {
      return;
    }

    if (this.ball.x < leftBounds) {
      this.sound.play(Audio.Score);

      // left side score,
      this.resetBall();
      this.incrementScore("right");
    } else if (this.ball.x > rightBounds) {
      this.sound.play(Audio.Score);

      this.resetBall();
      this.incrementScore("left");
    }

    const maxScore = 20;

    if (this.leftScore >= maxScore) {
      // this.paused = true
      this.gameState = GameState.PlayerWon;
    } else if (this.rightScore >= maxScore) {
      // this.paused = true
      this.gameState = GameState.AIWon;
    }

    if (this.gameState === GameState.Running) {
      this.resetBall();
      this.totalScore = this.leftScore + this.rightScore;
      this.setRandomObstable(this.totalScore);
    } else {
      // game over
      this.ball.active = false;
      this.physics.world.remove(this.ball.body);

      this.scene.stop(SceneKeys.GameBackground);

      // play game over scene
      this.scene.start(SceneKeys.GameOver, {
        leftScore: this.leftScore,
        rightScore: this.rightScore,
      });
    }
  }

  // handles all player paddle logic
  player1() {
    // this tells vscode that body is of type  Phaser.Physics.Arcade.Body
    /** @type { Phaser.Physics.Arcade.Body } */
    const body = this.paddleLeft.body;

    if (this.cursors.up.isDown || this.keyW.isDown) {
      if (this.paddleLeft.y >= 40) {
        this.paddleLeft.y += -10;
        body.updateFromGameObject();
      }
    } else if (this.cursors.down.isDown || this.keyS.isDown) {
      if (this.paddleLeft.y <= 460) {
        this.paddleLeft.y += 10;
        body.updateFromGameObject();
      }
    }

    if (this.cursors.left.isDown ) {
      this.paddleLeft.angle = 10;
      body.updateFromGameObject();
    }

    if (this.keyA.isDown) {
      this.paddleLeft.angle = 10;
      body.updateFromGameObject();
    }

    if (this.cursors.right.isDown ) {
      this.paddleLeft.angle = -10;
      body.updateFromGameObject();
    }

    if (this.keyD.isDown) {
      this.paddleLeft.angle = -10;
      body.updateFromGameObject();
    }

    if ( (this.cursors.right.isUp && this.keyD.isUp)  && (this.cursors.left.isUp && this.keyA.isUp)) {
      this.paddleLeft.angle = 0;
      body.updateFromGameObject();
    }

    // if (this.keyA.isUp && this.keyD.isUp) {
    //   this.paddleLeft.angle = 0;
    //   body.updateFromGameObject();
    // }
  }

  // increments left/right score depending on param
  incrementScore(direction) {
    if (direction === "left") {
      this.leftScore += 1;
      this.leftScoreLabel.text = this.leftScore;
    } else {
      this.rightScore += 1;
      this.rightScoreLabel.text = this.rightScore;
    }
  }

  // sets/resets ball to center of screen
  resetBall() {
    this.ball.setPosition(400, 250);

    const rightAngle = Phaser.Math.Between(135, 225);
    const leftAngle = Phaser.Math.Between(0, 45);

    // elegant way of choosing between items randomly
    const angle = [rightAngle, leftAngle][Math.round(Math.random())]; // Phaser.Math.Between(0, 360)

    const vec = this.physics.velocityFromAngle(angle, 300);

    this.ball.body.setVelocity(vec.x, vec.y);

    const gravityX = Phaser.Math.Between(1, 5);
    const gravityY = Phaser.Math.Between(1, 5);

    this.ball.body.setGravity(gravityX, gravityY);
  }

  // Sets random obstacles depending on total score
  setRandomObstable(total) {
    // set random number flag
    let flag = 0; //  Phaser.Math.Between(1, 2)  //  [1,2, ][Math.round(Math.random())]

    if (total > 1 && total <= 5) {
      flag = Phaser.Math.Between(1, 2); //  [1,2, ][Math.round(Math.random())]
      // this.renderObstacle(flag)

    } else if (total > 5 && total <= 8) {
      flag = Phaser.Math.Between(2, 4); //  [1,2, ][Math.round(Math.random())]
      // this.renderObstacle(flag)
      // this.renderObstacle(2)

    } else if (total > 10) {
      flag = Phaser.Math.Between(3, 5); //  [1,2, ][Math.round(Math.random())]
      // this.renderObstacle(flag)
      // let randomNum = Phaser.Math.Between(1, 5)
      // this.renderObstacle(randomNum)

    }
    //  else if (total >= 12) {
    //   // for (let i = 2; i < 6; i++) {
    //   //   this.renderObstacle(i)
    //   // }
    
    // }

    // set switch statewment with functions
    switch (flag) {
      case 1: // generates a wagmiwall
        this.genRandomWallz();
        break;
      case 2: // generates fake wagmiballz
        this.genRandomBallz();
        this.genRandomWallz();
        break;
      case 3: // generates an invisible wagmiwall & some lower level obstacle
        // this.genInvisibleWallz()
        this.genRandomBallz();
        this.setRandomObstable(6); // feed static param <= 5 so it spawns a lower level obstacle
        break;
      case 4:
        // this.genInvisibleWallz()
        this.shrinkPlayer();
        this.genRandomBallz()
        this.genInvisibleWallz();
        this.setRandomObstable(9); // feed static param <= 5 so it spawns a lower level obstacle

        break;
      case 5:
        this.slowPlayer();
        this.shrinkPlayer();

        this.setRandomObstable(11); // feed static param <= 5 so it spawns a lower level obstacle
      break;
      default:
        // this.setRandomObstable(9); // feed static param <= 5 so it spawns a lower level obstacle
        break;
      // code block
    }

   
  }

  renderObstacle(flag) {
    switch (flag) {
      case 1: // generates a wagmiwall
        this.genRandomWallz();
        break;
      case 2: // generates fake wagmiballz
        this.genRandomBallz();
        break;
      case 3: // generates an invisible wagmiwall & some lower level obstacle
        this.genInvisibleWallz()
        break;
      case 4:
        this.shrinkPlayer();
        break;
      case 5:
        this.slowPlayer();
        break;
      default:
        let randomNum = Phaser.Math.Between(1, 4)
        this.renderObstacle(randomNum)
      // code block
    }
  }

 async slowPlayer() {

  /** @type { Phaser.Physics.Arcade.Body } */
   const body = this.paddleLeft.body;
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));


    for (let i = 0; i < 200; i++) {
       this.paddleLeft.y = Phaser.Math.Between(1, -1);
    body.updateFromGameObject();
    }
   


    // await timer(500);

  }

  // generates random wagmiwall, which is a colored paddle with collision
  genRandomWallz() {
    const x = Phaser.Math.Between(0, 500);
    const y = Phaser.Math.Between(0, 500);
    const height = Phaser.Math.Between(140, 300); //

    let wallzColor = "0x" + Math.floor(Math.random() * 16777215).toString(16);
    let centerPaddle = this.add.rectangle(x, y, 20, height, wallzColor, 1);
    this.physics.add.existing(centerPaddle, true); // true makes it static and not move back when ball collides
    this.physics.add.collider(
      centerPaddle,
      this.ball,
      this.handdlePaddleBallCollision,
      undefined,
      this
    );

    let timeout = Phaser.Math.Between(20000, 3500);
    setTimeout(function () {
      centerPaddle.destroy();
    }, timeout);
  }
  // generates random number of fake wagmiballz with no collision
  genRandomBallz() {
    const ballCount = Phaser.Math.Between(0, 6);

    for (let i = 0; i < ballCount; i++) {
      let ball = this.add.circle(400, 250, 10, this.color, 10);

      this.physics.add.existing(ball);
      ball.body.setCircle(10);
      ball.body.setBounce(1, 1);

      ball.body.setMaxSpeed(1000);

      ball.body.setCollideWorldBounds(true, 1, 1);

      ball.setPosition(400, 250);

      const rightAngle = Phaser.Math.Between(135, 225);
      const leftAngle = Phaser.Math.Between(0, 45);

      // elegant way of choosing between items randomly
      const angle = [rightAngle, leftAngle][Math.round(Math.random())]; // Phaser.Math.Between(0, 360)

      const speedVec2 = Phaser.Math.Between(300, 500);
      const vec = this.physics.velocityFromAngle(angle, speedVec2); // speedVec2 was 300 before making it random

      ball.body.setVelocity(vec.x, vec.y);

      let timeout = Phaser.Math.Between(8000, 25000);
      setTimeout(function () {
        ball.destroy();
      }, timeout);
    }
  }

  // generates an invisible wagmiwall
  genInvisibleWallz() {
    const x = Phaser.Math.Between(0, 500);
    const y = Phaser.Math.Between(0, 500);
    const height = Phaser.Math.Between(200, 500); //

    let centerPaddle = this.add.rectangle(x, y, 20, height, 0x000000, 1);
    this.physics.add.existing(centerPaddle, true); // true makes it static and not move back when ball collides
    this.physics.add.collider(
      centerPaddle,
      this.ball,
      this.handdlePaddleBallCollision,
      undefined,
      this
    );

    let timeout = Phaser.Math.Between(20000, 30000);
    setTimeout(function () {
      centerPaddle.destroy();
    }, timeout);
  }

  async shrinkPlayer() {
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    let ogHeight = this.paddleRight.displayHeight;
    let shrinkTimes = Phaser.Math.Between(3, 6)
    if (this.paddleLeft.displayHeight >= ogHeight) {
      for (let j = 0; j < shrinkTimes; j++) {
        for (let i = 0; i < 20; i++) {

          if (this.paddleLeft.displayHeight > 0) {
                this.paddleLeft.displayHeight -= i;
                 await timer(100);
          } 
      
        }

        await timer(300);

        this.paddleLeft.displayHeight = ogHeight;
      }
    }
  }
}
