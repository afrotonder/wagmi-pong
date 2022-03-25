import Phaser, { Scene } from 'phaser'

import TitleScreen from './scenes/TitleScreen'
import Game from './scenes/Game'
import GameBackground from './scenes/GameBackground'
import GameOver from './scenes/GameOver'
import Preload from './scenes/Preload'
import * as SceneKeys from './constants/SceneKeys'
import * as wagmiballz from './constants/wagmiballz'

// import Moralis from 'moralis/dist/moralis.min.js';
// WAGMI
// var wagmiballz = []

const config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO, // WEB GL OR CANVAS
    // backgroundColor: 'none',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        }
    }
}

    // start engine
    const game = new Phaser.Game(config)
    // load scenes
    game.scene.add(SceneKeys.TitleScreen, TitleScreen)
    game.scene.add(SceneKeys.Game, Game)
    game.scene.add(SceneKeys.GameBackground, GameBackground)
    game.scene.add(SceneKeys.GameOver, GameOver)
    game.scene.add(SceneKeys.Preload, Preload)


document.getElementById('walletID').addEventListener('input', function(event) {
    console.log('EJE ', event.target.value.length);
    // console.log(document.getElementById('walletID'))
    if (event.target.value.length === 42) {
        wagmiballz.getUserNFTs(event.target.value).then((result) => {
            console.log(result);
            console.log('hiolssssssssssssssssssssssssss');
            document.getElementsByClassName('tvContainer')[0].style.display = 'none'
            document.getElementsByClassName('connectWallet')[0].style.display = 'none'
            document.querySelectorAll('canvas')[0].style.display = 'flex'
   


        // game.scene.start('titleScreen')

        game.scene.start(SceneKeys.Preload)
        }).catch((err) => {
            
        });





    }
})
