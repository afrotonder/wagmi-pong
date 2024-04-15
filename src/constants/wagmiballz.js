import Moralis from "moralis/dist/moralis.min.js";
import { firebaseConfig } from "../../environment.prod";
import Game from "../scenes/Game";

var wagmiballz = [];
let wagmiball = "";

const serverUrl = firebaseConfig.svr;

//  // moralis server appID
const appId = firebaseConfig.romero;

//  // start moralis engine
Moralis.start({ serverUrl, appId });

async function getEthAssets(address) {
  try {
    const optionsETH = { chain: "eth", address: address };
    const ethNFTs = await Moralis.Web3API.account.getNFTs(optionsETH);

    return ethNFTs;
  } catch (error) {}
}
async function getUserNFTs(address) {
  try {
    const options = { chain: "matic", address: address };
    const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);

    let polyAssets = polygonNFTs.result;
    let ethAssets = await getEthAssets(address);

    let allUserNFTs = polyAssets.concat(ethAssets.result);

    // console.log('user nfts ', allUserNFTs);

    for (let asset of allUserNFTs) {
      let nft = JSON.parse(asset.metadata);

      let nftCollection = !!asset.name === true ? asset.name : "";
      // console.log('collection ', nftCollection);
      // console.log('nft ', nft);

      if (!!nft && !!nft.name && !!nft.description) {
        // let nftName = !!nft.name === true ? nft.name : "";
        // let nftDesc = !!nft.description === true ? nft.description : "";

      // console.log('nft name', nftName.toLowerCase());
      // console.log('nft desc ', nftDesc.toLowerCase());

      // if (nftName.toLowerCase().includes("wagmiballz") || nftDesc.toLowerCase().includes("wagmiballz") || nftCollection.toLowerCase().includes("wagmiballz")) {
        if ( nftCollection.includes("WAGMIBALLZ")) {
          // console.log('wagmiballz ', nft);
          wagmiballz.push(nft);
        }
      }
    }

    // console.log('qhay !!!', wagmiballz);

    if (wagmiballz.length) {
      // console.log('got wagmiballz!');
      document.getElementsByClassName("tvContainer")[0].style.display = "none";
      // console.log('hide connect wallet button');
      document.getElementsByClassName("connectWallet")[0].style.display =
        "none";
      // console.log('canvas display flex');
      document.querySelectorAll("canvas")[0].style.display = "flex";
      // return wagmiballz
      // console.log('done 🦊');
      document.getElementById("done").click();
      //  this.game.scene.start('titleScreen')
      //         this.game.scene.start(SceneKeys.Preload)
    } else {
      // console.log('VAN ELSING 🧛🏾🧛🏾🧛🏾');
      // alert('Plz go buy a wagmiball @ OpenSea!')
      document.getElementsByClassName('openSea')[0].style.visibility = 'visible'
      document.getElementsByClassName('openSea')[0].style.display = 'flex'
      // Swal.fire("The Internet?", "That thing is still around?", "question");
      document.getElementsByClassName('connecting')[0].style.display = 'none'
      document.getElementsByClassName("noWagmiballz")[0].style.display = 'flex'

    }
  } catch (error) {
    console.log('err reading assets: ',error);
  }
}

export { wagmiballz };

document
  .getElementById("connectMetamask")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // document.getElementById('connectMetamask').innerText = "Connecting..."
    document.getElementById("connectMetamask").style.display = "none";
    document.getElementsByClassName("connecting")[0].style.display = "flex";
    document.getElementsByClassName("connecting")[0].style.innerHTML = "Connecting...";


    Moralis.authenticate()
      .then(function (user) {
        const userAddress = user.get("ethAddress");
        getUserNFTs(userAddress);
      })
      .catch(function (error) {
        console.log(error.message.toString());

        if(error.message.toString().includes('Non ethereum enabled browser')) {
          alert('Sign into MetaMask to play!')

        }
        document.getElementById("connectMetamask").style.display = "block";
        document.getElementsByClassName("connecting")[0].style.display = "none";
      });
  });
