import { ChainConnector, ERC20_ABI } from "../lib/onchain";
import { ethers } from "ethers";

const chain = new ChainConnector("mainnet");
const provider = chain.provider;

const walletAddress = "0xc644383f49556BE77122B28dE09c298f3b9B05a5";

// Known Tornado Cash and Mixer contract addresses
const mixerAddresses = [
  "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b", // Tornado Cash ETH
  // "0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D", // Tornado Cash DAI
  // "0x5B5f1C6e0fDf49464dC3bDc9F438B5E6e6e26dC6", // Tornado Cash cDAI
  // "0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3", // Tornado Cash USDC
  // "0xD1bD2Bba67b9359739A5c3e2d0Ef4c7A1eD8fD06", // Tornado Cash USDT
  // "0x910cBD523D972eb0a6f4cae4618ad62622b39DbF", // Tornado Cash WBTC
  // "0xCbD54F0C3BcE1dABcC2981F600fD4fF16Bf58D22", // Railgun
];

const badToken = [
'0x77777feddddffc19ff86db637967013e6c6a116c', // --  tornado
 '0x45750cD6A3BB2206DbeB9CbA5e68Bf909aC945E3', // -- monero 
 '0xe76c6c83af64e4c60245d8c7de953df673a7a33d', // -- railgun
]
const kycToken = [
 '0xa090e606e30bd747d4e6245a1517ebe430f0057e', // -- coinbase
 '0x28c6c06298d514db089934071355e5743bf21d60', // -- binance
 '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be', // -- binance
 '0xf89d7b9c864f589bbf53a82105107622b35eaa40', // -- bybit
 '0x3328f7f4a1d1c57c35df56bbf0c9dcafca309c49', // -- banana gun
 '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', // -- synthetix
]

// Function to detect mixer interaction
async function checkMixerInteraction(wallet: string) {
  try {
    const latestBlock = await provider.getBlockNumber();

    console.log(latestBlock)

    //const fromBlock = latestBlock - 10000; // Last ~2 days
    const fromBlock = latestBlock - 1000; // Last ~2 days
    const toBlock = latestBlock;

    const incomingTxs = await provider.getLogs({
      fromBlock: ethers.toQuantity(fromBlock),
      toBlock: ethers.toQuantity(toBlock),
      topics: [null, null, ethers.zeroPadValue(wallet, 32)],
    });

    const outgoingTxs = await provider.getLogs({
      fromBlock: ethers.toQuantity(fromBlock),
      toBlock: ethers.toQuantity(toBlock),
      topics: [null, ethers.zeroPadValue(wallet, 32)],
    });

    // Combine all transactions
    const allTxs = [...incomingTxs, ...outgoingTxs];

    console.log(allTxs)

    // Check for mixer interaction
    const interactedWithMixer = allTxs.some((tx) => mixerAddresses.includes(tx.address));

    // if (interactedWithMixer) {
    //   console.log(`⚠️ Wallet ${wallet} has interacted with Tornado Cash or a mixer!`);
    // } else {
    //   console.log(`✅ Wallet ${wallet} has NO known interactions with mixers.`);
    // }
  } catch (error) {
    console.error("Error checking mixer interaction:", error);
  }
}

// Run the function
checkMixerInteraction(walletAddress);
