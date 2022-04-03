import Moralis from 'moralis/dist/moralis.min.js';
import { firebaseConfig } from '../../environment.prod';
var wagmiballz = []
let wagmiball = '' 

const serverUrl = firebaseConfig.svr

//  // moralis server appID
const appId = firebaseConfig.romero

//  // start moralis engine
Moralis.start({ serverUrl, appId });

async function getUserNFTs(address) {

    try {
        console.log('address ', address);
        
        // moralis server URL
        

        const options = { chain: 'matic', address: address };
        const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);

        // console.log(polygonNF?Ts);


        for (let asset of polygonNFTs.result) {
            let nft = JSON.parse(asset.metadata)
            if (!!nft) {
                // console.log(nft.name.toString() );
                if (nft.name.includes('PixelMiibs')) {
                    // console.log('WOWOWOWOWOWOWOWOWOWO');
                    wagmiballz.push(nft)

                }
            }
        }

        if (wagmiballz.length) {    
            
            console.log('this user has wagmiballlz ', wagmiballz);

            return wagmiballz

            // document.getElementsByClassName('tvContainer')[0].style.display = 'none'
            // document.getElementsByClassName('connectWallet')[0].style.display = 'none'
            // document.querySelectorAll('canvas')[0].style.display = 'flex'

        } else {
            alert('Plz go buy a wagmiball @ OpenSea!')

            // TODO
            // hide connect button
            document.getElementById('connectButton').style.display = 'none'
            // add new buttons in screen for collections and mint site
        }


        // game.load.image('wagmiball', wagmiballz[0].image);


        // polygonNFTs.result.forEach(asset => {
        //     let nft = JSON.parse(asset.metadata)
        //     console.log(nft.name);

      

        // });

        // const opts = { address: "0x2953399124f0cbb46d2cbacd8a89cf0599974963", token_id: "92986716105997878495280914514219232026124040552936354403148946709141996437505", chain: "matic" };
        // const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(opts);

        // console.log(tokenIdMetadata);

    } catch (error) {
        console.log(error);
    }
    

}

// getUserNFTs()

function connectMetamask() {
    console.log('hpla');
    Moralis.authenticate().then(function (user) {
        console.log(user.get('ethAddress'))



        try {
            // console.log('EJE ', event.target.value.length);
            // console.log(document.getElementById('walletID'))
            // if (event.target.value.length === 42) {
                wagmiballz.getUserNFTs(user.get('ethAddress')).then((result) => {
                    console.log(result);
                    // console.log('');
                    document.getElementsByClassName('tvContainer')[0].style.display = 'none'
                    document.getElementsByClassName('connectWallet')[0].style.display = 'none'
                    document.querySelectorAll('canvas')[0].style.display = 'flex'
        


                // game.scene.start('titleScreen')

                game.scene.start(SceneKeys.Preload)
                }).catch((err) => {
                    
                });

            // }
        } catch (error) {
            
        }
    })
}

export {
    // wagmiball,
    getUserNFTs
}
console.log('esto tiene prob de scoping :W',wagmiballz);

document.getElementById('connectMetamask').addEventListener('click', function(event) {
    alert('zumba simba!')
    Moralis.authenticate().then(function (user) {
        console.log(user.get('ethAddress'))
        console.log(user);
        const userAddress = user.get('ethAddress')
        getUserNFTs(userAddress)
    })

})

