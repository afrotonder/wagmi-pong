import Phaser from "phaser";
import WebFontFile from "./WebFontFile";
import * as SceneKeys from "../constants/SceneKeys";
import * as Colors from "../constants/Colors";

export default class GameOver extends Phaser.Scene {
  /**
   *
   * @param {{leftScore: number, rightScore, number}} data
   */
  create(data) {
    this.sound.stopAll();
    let titleText = "Game Over";
    let titleColor = "#ff0000";
    if (data.leftScore > data.rightScore) {
      // player won
      titleText = "You win!";
      titleColor = "#fff00";
    }
    let title = this.add
      .text(400, 150, titleText, {
        fontFamily: SceneKeys.Font,
        fontSize: 38,
        color: titleColor
      })
      .setOrigin(0.5, 0.5);

    // title.setStroke('#f', 4)

    this.add
      .text(400, 230, "Developed by Afrotonder", {
        fontFamily: SceneKeys.Font,
        fontSize: 15,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(400, 280, "Music by Aim to Head Official", {
        fontFamily: SceneKeys.Font,
        fontSize: 15,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(400, 400, "Press Space to Play Again", {
        fontFamily: SceneKeys.Font,
        fontSize: 22,
      })
      .setOrigin(0.5, 0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start(SceneKeys.Game);
    });
  }
}
