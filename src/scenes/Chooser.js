import Phaser from 'phaser'

import WebFontFile from './WebFontFile'

import * as SceneKeys from '../constants/SceneKeys'

import * as Audio from '../constants/Audio'

import * as wagmiballz from '../constants/wagmiballz'


export default class TitleScreen extends Phaser.Scene {
    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
        
    }


    create() {
       

        const title = this.add.text(400, 200, 'Choose your ball:',
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


            let assets =  wagmiballz.wagmiballz.filter(ball => ball.traits.length > 0)




            // const subTitle = this.add.text(400, 300, 'Press Spacebar To Play',
            // {
            //     fontSize: 15,
            //     fontFamily: SceneKeys.Font
            // }).setOrigin(0.5, 0.5)

        

            // this.input.keyboard.once('keydown-SPACE', () => {
            //     console.log('s[ace');
                // this.scene.start(SceneKeys.Game, BALL)
            // } )
    }

}