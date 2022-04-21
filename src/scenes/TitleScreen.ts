import Phaser from 'phaser'

import WebFontFile from './WebFontFile'

import Chooser from './Chooser'

import * as SceneKeys from '../constants/SceneKeys'

import * as Audio from '../constants/Audio'

import * as wagmiballz from '../constants/wagmiballz'
import rexUI from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export default class TitleScreen extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    init(data) {


        console.log(

            'YEAH GOT SOME DATA FROM OTHER', data.config
        );
        this.cursors = this.input.keyboard.createCursorKeys()


    }

    preload() {


        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)


        // var img = this.add.sprite(200, 300, 'wagmiball').setInteractive()


    }


    async create() {


        const title = this.add.text(400, 150, 'Paddlez',
            {
                fontSize: '70px',
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)
        title.setStroke('#000000', 4)
        const gradient = title.context.createLinearGradient(0, 0, 0, title.height);
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(.5, '#ffffff');
        gradient.addColorStop(.5, '#aaaaaa');
        gradient.addColorStop(1, '#111111');

        title.setFill(gradient);

        const subTitle = this.add.text(400, 220, 'A Pseudo-Random Web3 Experience',
            {
                fontSize: '15px',
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)

        const timer = (ms) => new Promise((res) => setTimeout(res, ms));

        let assets = wagmiballz.wagmiballz.filter(ball => ball.traits.length > 0)

        console.log('assets count ', assets.length);

        const randomSelectText = this.add.text(400, 420, 'Randomly selecting one of your WAGMIBALLZ.',
        {
            fontSize: '12px',
            fontFamily: SceneKeys.Font
        }).setOrigin(0.5, 0.5)
        await timer(2000);


        // if (assets.length === 1) {
        //     let userBallzCount = ``
        //     let youHave = this.add.text(440, 260, userBallzCount,
        //     {
        //         fontSize: '12px',
        //         fontFamily: SceneKeys.Font
        //     }).setOrigin(0.5, 0.5)
        // } else {
        //     let userBallzCount = `Selecting one of your ${assets.length} WAGMIBALLZ.`
        //     let youHave = this.add.text(440, 260, userBallzCount,
        //     {
        //         fontSize: '12px',
        //         fontFamily: SceneKeys.Font
        //     }).setOrigin(0.5, 0.5)
        // }





        const { width, height } = this.scale
        let assetContainerY = 350
        let assetContainerX = 400
        let assetY = 320
        let assetX = 400




        for (let i = 0; i < 6; i++) {
            // for each asset, create selectable rectangle
            for (let element of assets) {

                // get asset color from metadata
                let color = element.traits[1].value.replace('#', '0x')


                // set asset placeholder
                const tempCircle = this.add.circle(assetX, assetY, 10, color, 10)
                    .setDisplaySize(20, 20)

                const tempAssetName = this.add.text(assetContainerX, assetContainerY, element.name, {
                    fontSize: '10px',
                    color: '#ffffff',
                    fontFamily: SceneKeys.Font
                })
                    .setOrigin(0.5)

                await timer(500);

                tempCircle.destroy();
                tempAssetName.destroy();


            };
        }

        // remove Randomly selecting WAGMIBALL messge
        randomSelectText.destroy()

        // select random int between 0 and length of assets - 1 to send to game scene
        const selectedBall = Math.round(Phaser.Math.Between(0, assets.length-1)) // Phaser.Math.Between(0, 360)

        let tempColor = assets[selectedBall].traits[1].value.replace('#', '0x')

        const tempCircle = this.add.circle(assetX, assetY, 10, tempColor, 10)
        .setDisplaySize(20, 20)



    // this.add.text(playButton.x, playButton.y, element.name, {
    const tempAssetName = this.add.text(assetContainerX, assetContainerY, assets[selectedBall].name, {
        fontSize: '10px',
        color: '#ffffff',
        fontFamily: SceneKeys.Font
    })
        .setOrigin(0.5)


        console.log('read to play with ', selectedBall);


        // ready player one
        const startPlayint = this.add.text(400, 420, 'Press Spacebar To Play',
            {
                fontSize: '15px',
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)


        // press space to start playing   
        this.input.keyboard.once('keydown-SPACE', () => {
            console.log('Starting this.game');
            this.scene.start(SceneKeys.Game, {'selectedBall': selectedBall})
        })



    }


    update() {
        // const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        // const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
        // const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)

        // if (upJustPressed) {
        //     console.log('uuuuuuuuuuuuuuuuuuuuppppppppppppppppppppppp');
        // }
        // else if (downJustPressed) {
        //     console.log('dowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwnnnnnnnn');
        // }
        // else if (spaceJustPressed) {
        //     console.log('sppppppppppppppppppaceeeeeeeeeeeeeeeeeeeeeeeeeeeee');
        // }
    }

}


function tesin() {
    alert('KHE')
}
