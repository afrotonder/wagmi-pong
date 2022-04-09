import Phaser from 'phaser'

import WebFontFile from './WebFontFile'

import Chooser from './Chooser'

import * as SceneKeys from '../constants/SceneKeys'

import * as Audio from '../constants/Audio'

import * as wagmiballz from '../constants/wagmiballz'

export default class TitleScreen extends Phaser.Scene {
    preload() {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
        
    }


    create() {
       

        const title = this.add.text(400, 200, 'Paddlez',
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

            const subTitle = this.add.text(400, 250, 'A Web3 Experience',
            {
                fontSize: 10,
                fontFamily: SceneKeys.Font
            }).setOrigin(0.5, 0.5)


         
            let assets =  wagmiballz.wagmiballz.filter(ball => ball.traits.length > 0)

            assets.forEach(element => {
                console.log(element);

                            
                let tempElement = `<div id="element.name" class="asset"  style="margin: 55px;width: 100px; border-radius: 5px; height: 145px; text-align: center; background-color:white;">
                                    <img style="width: 100px;" src=${element.image} >
                                    <p style="margin-top: 2px;">${element.name}</p>
                                    <p style="margin-top: -10px;">${element.traits[1].value}</p>

                                    </div>`
                                    document.getElementById('chooser').innerHTML += tempElement

                                    // document.getElementById('chooser').appendChild(tempElement)
            });

            if (assets.length >= 2) {

                const chooseNFT = this.add.text(400, 350, 'Press Spacebar To Choose NFT',
                {
                    fontSize: 15,
                    fontFamily: SceneKeys.Font
                }).setOrigin(0.5, 0.5)


                this.input.keyboard.once('keydown-SPACE', () => {
                    console.log('Chooser');
                    // this.scene.start(SceneKeys.Chooser)
                    document.getElementById('chooser').style.display = 'grid'


                    //TODO: make listener that handles clocking specific bvall, hight light it and show start game button that will begin game scene, must then capture ball instance in Game scene and if data present, dont read wagmiballz as its already done 
                

                    // document.getElementsByClassName('asset')[0].addEventListener('click', function(event) {
                    //     console.log('clicked on asset, hicht light and prepare for game');
                    // })


                })
                

            } else {
           

                const startPlayint = this.add.text(400, 350, 'Press Spacebar To Play',
                {
                    fontSize: 15,
                    fontFamily: SceneKeys.Font
                }).setOrigin(0.5, 0.5)


                this.input.keyboard.once('keydown-SPACE', () => {
                    console.log('Starting Game');
                    this.scene.start(SceneKeys.Game)
                })
    
            }

        

       
    }

    preChooseNFT(id) {
        alert('ahora ', id)
    }

}