import { ethers } from "ethers";
import { ChainConnector } from "../lib/onchain";
import { DBConnector } from "../lib/db";
import { delay } from "../lib/utils";
import { getWalletId, getTokenId } from "../lib/utils";

// Initialize database connection
const db = new DBConnector();

// Connect to the Ethereum mainnet
const chain = new ChainConnector("mainnet");
const provider = chain.provider;

// Define the ERC-20 ABI for decoding transaction data
const ERC20_ABI = ["function transfer(address to, uint amount)"];
const iface = new ethers.Interface(ERC20_ABI);

const contractAddresses = [
  "0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3", // Tornado Cash
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409", // FDUSD
  "0x514910771af9ca656af840dff83e8264ecf986ca", //  LINK
  "0x561Cf9121E89926c27FA1cfC78dFcC4C422937a4", //  SQUID
  "0x7A3D5d49D64E57DBd6FBB21dF7202bD3EE7A2253", //  Tornado
  //  "0x0f51bb10119727a7e5ea3538074fb341f56b09ad", //  DAO
  //  "0x5a98fcbea516cf06857215779fd812ca3bef1b32", // LIDO
  //  "0xD533a949740bb3306d119CC777fa900bA034cd52", //  CRV DAO
  //  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", //  AAVE
  //  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // UNI
  //  "0x45804880de22913dafe09f4980848ece6ecbaf78", //  PAX
  //  "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd", //  GUSD
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
  
async function getHistory(): Promise<void> {
  const salt = 200;
  let toBlock = 21408466//21771980 //await provider.getBlockNumber();
  let fromBlock = toBlock - salt;
  while (toBlock > 77000 ) {  //21408466
    await getWalletTransactions(fromBlock, toBlock);
    toBlock = toBlock - salt;
    fromBlock = fromBlock - salt;
  }
}

/**
 * Fetch and process transactions from the latest block on the blockchain
 */
async function getWalletTransactions(fromBlock: number, toBlock: number): Promise<void> {
  try {
    const logs = await provider.getLogs({
      fromBlock,
      toBlock,
      address: kycToken,
    });

    for (const log of logs) {
      const tx = await provider.getTransaction(log.transactionHash);
      if (!tx || !tx.from || !tx.to) continue;

      let kycAddress = 0;
      if (tx.from in contractAddresses) kycAddress = await getWalletId(tx.from);
      else kycAddress = await getWalletId(tx.to);

      if (kycAddress == 0)  return;
      if (kycAddress % 3 !== 0) return;

      console.log("KYC Address:", kycAddress, tx.from, tx.to);
      await db.query(SQLKYC, [kycAddress]);
    }
  } catch (error) {
    console.error("Error fetching block transactions:", error);
  }
}

/**
 * Main execution function to fetch block transactions
 */
async function main(): Promise<void> {
  await getHistory();
}

// SQL Queries
const SQLKYC = `
  replace into wallet_behavior (wallet_id, wcla_id, score, last_activity) values (?,20, 1, now());
`;

// Execute the main function
main().then(() => process.exit(0));

