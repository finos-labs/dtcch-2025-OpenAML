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

  const contractAddresses = ["0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3", // Tornado Cash 
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

async function getHistory(): Promise<void> {
  const salt = 100;
  let toBlock = await provider.getBlockNumber();
  let fromBlock = toBlock - salt;
  while (toBlock>1761292) {
    await getWalletTransactions(fromBlock, toBlock);
    toBlock = toBlock - salt;
    fromBlock = fromBlock - salt; 
  }

}


/**
 * Fetch and process transactions from the latest block on the blockchain
 */
async function getWalletTransactions(fromBlock:number, toBlock:number): Promise<void> {
  try {
    
    const logs = await provider.getLogs({
      fromBlock,
      toBlock,
      address: contractAddresses,
    });
    
    for (const log of logs) {
      const tx = await provider.getTransaction(log.transactionHash);
      if (!tx || !tx.from || !tx.to) continue;
      
      const fromAddress = await getWalletId(tx.from);
      const toAddress = await getWalletId(tx.to);
      //console.log(fromAddress, toAddress);
      // Insert transaction into the database
      await db.query(SQLTransaction, [
        Number(tx.chainId),
        tx.blockNumber,
        tx.index,
        fromAddress,
        toAddress,
        tx.nonce,
        tx.hash
      ]);

      //console.log("number:", tx.blockNumber);
      // Decode transaction data if applicable
      try {
        const decodedData = iface.parseTransaction({ data: tx.data });
        if (decodedData?.args.length && decodedData.args[0].length > 1) {
          const tokenId = await getTokenId(decodedData.args[0]);
          await db.query(SQLTxData, [
            Number(tx.chainId),
            tx.blockNumber,
            tx.index,
            tokenId,
            decodedData.args[1]
          ]);
        }
      } catch (decodeError) {
        console.warn(`Failed to decode transaction data for tx: ${tx.hash}`, decodeError);
      }
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
const SQLTransaction = `
  INSERT ignore INTO transactions (chain_id, block_number, tx_index, from_wallet_id, to_wallet_id, nonce, hash)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

const SQLTxData = `
  INSERT ignore INTO transaction_data (tx_chain_id, tx_block_number, tx_index, token_id, amount)
  VALUES (?, ?, ?, ?, ?)
`;


// Execute the main function
main().then(() => process.exit(0));