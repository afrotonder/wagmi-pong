import Phaser from 'phaser'
import WebFontFile from './WebFontFile'
import * as SceneKeys from '../constants/SceneKeys'
import * as Colors from '../constants/Colors'
import * as Audio from '../constants/Audio'
export default class Preload extends Phaser.Scene {
    preload() {

        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)

        this.load.audio(Audio.Score, 'assets/score.wav')
        this.load.audio(Audio.Title, 'assets/title.wav')
        this.load.audio(Audio.Paddle, 'assets/paddle.wav')


    }

    create() {
        this.scene.start(SceneKeys.TitleScreen)
    }
} 