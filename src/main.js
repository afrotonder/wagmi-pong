import Phaser, { Scene } from 'phaser'

import TitleScreen from './scenes/TitleScreen'
import Game from './scenes/Game'
import GameBackground from './scenes/GameBackground'
import GameOver from './scenes/GameOver'
import Chooser from './scenes/Chooser'
import Preload from './scenes/Preload'
import Pause from './scenes/Pause'
import * as SceneKeys from './constants/SceneKeys'
import * as wagmiballz from './constants/wagmiballz'
import { firebaseConfig } from '../environment.prod';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { initializeApp } from 'firebase/app';
import { textSpanContainsPosition } from 'typescript'
const app = initializeApp(firebaseConfig);

// import Moralis from 'moralis/dist/moralis.min.js';
// WAGMI
// var wagmiballz = []
// @ts-ignore

const config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO, // WEB GL OR CANVAS
    // backgroundColor: 'none',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0}
        },
        
    },
    dom: {
        createContainer: true
      },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
}

    // start engine
    const game = new Phaser.Game(config)
    // load scenes
    game.scene.add(SceneKeys.TitleScreen, TitleScreen)
    game.scene.add(SceneKeys.Game, Game)
    game.scene.add(SceneKeys.Chooser, Chooser)
    game.scene.add(SceneKeys.GameBackground, GameBackground)
    game.scene.add(SceneKeys.GameOver, GameOver)
    game.scene.add(SceneKeys.Preload, Preload)
    game.scene.add(SceneKeys.Pause, Pause)

    // game.scene.start('titleScreen')
    // game.scene.start(SceneKeys.Preload)

document.getElementById('done').addEventListener('click', function(event) {
    // alert('vammoajugal')
     game.scene.start('titleScreen', {config: config})
    game.scene.start(SceneKeys.Preload)
})


// document.getElementById('walletID').addEventListener('input', function(event) {
//     console.log('EJE ', event.target.value.length);
//     // console.log(document.getElementById('walletID'))
//     if (event.target.value.length === 42) {
//         wagmiballz.getUserNFTs(event.target.value).then((result) => {
//             console.log(result);
//             console.log('hiolssssssssssssssssssssssssss');
//             document.getElementsByClassName('tvContainer')[0].style.display = 'none'
//             document.getElementsByClassName('connectWallet')[0].style.display = 'none'
//             document.querySelectorAll('canvas')[0].style.display = 'flex'
   


//         // game.scene.start('titleScreen')

//         game.scene.start(SceneKeys.Preload)
//         }).catch((err) => {
            
//         });





//     }
// })



function test() {
    alert('cho ch')
}