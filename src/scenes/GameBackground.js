import Phaser from 'phaser'

import * as Colors from '../constants/Colors'

export default class GameBackground extends Phaser.Scene {
    preload() {}

    create() {
        this.add.line(400, 250, 0, 0, 0, 500, Colors.white, 1).setLineWidth(2.5, 2.5)

        // this.add.circle(400, 250, 50).setStrokeStyle(5, Colors.green, 1)
    }
}