import Moralis from 'moralis/dist/moralis.min.js';
import { firebaseConfig } from '../../environment.prod';
import Game from '../scenes/Game'

var wagmiballz = []
let wagmiball = '' 

const serverUrl = firebaseConfig.svr

//  // moralis server appID
const appId = firebaseConfig.romero

//  // start moralis engine
Moralis.start({ serverUrl, appId });

async function getEthAssets(address) {

    try {
        // console.log(polygonNF?Ts);
       const optionsETH = { chain: 'eth', address: address };
       const ethNFTs = await Moralis.Web3API.account.getNFTs(optionsETH);
    //    console.log('eth address ', ethNFTs.result);

       return ethNFTs
    } catch (error) {
        
    }
      
}
async function getUserNFTs(address) {

    try {
        
        const options = { chain: 'matic', address: address };
        const polygonNFTs = await Moralis.Web3API.account.getNFTs(options)
        

            let polyAssets = polygonNFTs.result
            let ethAssets = await getEthAssets(address)

            let allUserNFTs = polyAssets.concat(ethAssets.result)

            for (let asset of allUserNFTs) {
                let nft = JSON.parse(asset.metadata)

                if (!!nft && !!nft.name && !!nft.description) {

                    let nftName = !!nft.name === true ? nft.name  : ""
                    let nftDesc = !!nft.description === true ? nft.description : ""
                 
                    if (nftName.includes('Wagmiballz') || nftDesc.includes('Wagmiballz')) {

                        wagmiballz.push(nft)

                    }
                }
            }


            
        if (wagmiballz.length) {    
            
            console.log('this user has wagmiballlz ', wagmiballz);
            document.getElementsByClassName('tvContainer')[0].style.display = 'none'
            document.getElementsByClassName('connectWallet')[0].style.display = 'none'
            document.querySelectorAll('canvas')[0].style.display = 'flex'
            // return wagmiballz
            document.getElementById('done').click()
            //  this.game.scene.start('titleScreen')
            //         this.game.scene.start(SceneKeys.Preload)
           

        } else {
            // alert('Plz go buy a wagmiball @ OpenSea!')
            Swal.fire(
                'The Internet?',
                'That thing is still around?',
                'question'
              )
            
        }


    } catch (error) {
        console.log(error);
    }
    

}



export {
    wagmiballz
}

document.getElementById('connectMetamask').addEventListener('click', function(event) {
    document.getElementById('connectMetamask').innerText = "Connecting..."

        Moralis.authenticate().then(function (user) {
            console.log(user.get('ethAddress'))
            console.log(user);
            const userAddress = user.get('ethAddress')
            getUserNFTs(userAddress)
        })
        .catch(function (error) {
            console.log(error);
            // alert('Sign wi')
            document.getElementById('connectMetamask').innerText = "Connect Wallet"
          });
   
  

})

