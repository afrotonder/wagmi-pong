import Phaser from 'phaser'

import WebFontFile from './WebFontFile'

import * as SceneKeys from '../constants/SceneKeys'

import * as Audio from '../constants/Audio'


export default class TitleScreen extends Phaser.Scene {
    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
        
    }


    create() {
       

        const title = this.add.text(400, 200, 'Paused',
            {
                fontSize: 50,
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)
            title.setStroke('#000000', 4)
            const gradient = title.context.createLinearGradient(0, 0, 0, title.height);
            gradient.addColorStop(0, '#111111');
            gradient.addColorStop(.5, '#ffffff');
            gradient.addColorStop(.5, '#aaaaaa');
            gradient.addColorStop(1, '#111111');
        
            title.setFill(gradient);




            const subTitle = this.add.text(400, 300, 'Press Spacebar To Resume',
            {
                fontSize: 15,
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)

        

            this.input.keyboard.once('keydown-SPACE', () => {
                console.log('s[hello pausing');
                this.scene.resume(SceneKeys.Game, this.testingFunc)
                this.scene.stop(SceneKeys.Pause)
            } )
    }

}