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

    for (let asset of allUserNFTs) {
      let nft = JSON.parse(asset.metadata);

      if (!!nft && !!nft.name && !!nft.description) {
        let nftName = !!nft.name === true ? nft.name : "";
        let nftDesc = !!nft.description === true ? nft.description : "";

        if (nftName.includes("Wagmiballz") || nftDesc.includes("Wagmiballz")) {
          wagmiballz.push(nft);
        }
      }
    }

    if (wagmiballz.length) {
      document.getElementsByClassName("tvContainer")[0].style.display = "none";
      document.getElementsByClassName("connectWallet")[0].style.display =
        "none";
      document.querySelectorAll("canvas")[0].style.display = "flex";
      // return wagmiballz
      document.getElementById("done").click();
      //  this.game.scene.start('titleScreen')
      //         this.game.scene.start(SceneKeys.Preload)
    } else {
      // alert('Plz go buy a wagmiball @ OpenSea!')
      document.getElementsByClassName('openSea')[0].style.display = 'flex'
      // Swal.fire("The Internet?", "That thing is still around?", "question");
      document.getElementsByClassName("connecting")[0].innerHTML = "You dont have any WAGMIBALLZ! Get your's at OpenSea!";

    }
  } catch (error) {
    console.log(error);
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
        console.log(error);
        // alert('Sign wi')
        document.getElementById("connectMetamask").style.display = "block";
        document.getElementsByClassName("connecting")[0].style.display = "none";
      });
  });
