import Phaser from 'phaser'
import WebFontFile from './WebFontFile'
import * as SceneKeys from '../constants/SceneKeys'
import * as Colors from '../constants/Colors'

export default class GameOver extends Phaser.Scene {

    /**
     * 
     * @param {{leftScore: number, rightScore, number}} data 
     */
    create(data) {
        console.log(data);
        let titleText = 'Game Over'
        if (data.leftScore > data.rightScore) {
            // player won
            titleText = 'You win!'

        }
        this.add.text(400, 200, titleText, {
            fontFamily: SceneKeys.Font,
            fontSize: 38
        }).setOrigin(0.5, 0.5)

        this.add.text(400, 300, 'Play again?', {
            fontFamily: SceneKeys.Font,
            fontSize: 22
        }).setOrigin(0.5, 0.5)


        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SceneKeys.Game)
        })

    }
}