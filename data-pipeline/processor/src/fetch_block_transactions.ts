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

async function getHistory(): Promise<void> {
  //const latestBlock = await provider.getBlockNumber();
  const blockNumber = 21761292;

  // dowload even number blocks
  for (let i = 0; i < 11761302; i++) {
    console.log(`Fetching block #${blockNumber - i * 2}...`);
    await getBlockTransactions(blockNumber - i * 2);
  }
}

/**
 * Fetch and process transactions from the latest block on the blockchain
 */
async function getBlockTransactions(blockNumber:number): Promise<void> {
  try {

    const block = await provider.getBlock(blockNumber);
    if (!block) return;

    console.log(`Total Transactions: ${block.transactions.length}`);

    // Fetch transaction details concurrently
    const transactions = [];
    for (let i = 0; i < block.transactions.length; i++) {
      
      const txHash = block.transactions[i];
      await delay();
      const tx = await provider.getTransaction(txHash);

      if (!tx || !tx.from || !tx.to) continue;
      //console.log(tx.hash);
      const fromAddress = await getWalletId(tx.from);
      const toAddress = await getWalletId(tx.to);
      //console.log(fromAddress, toAddress);
      // Insert transaction into the database
      await db.query(SQLTransaction, [
        Number(tx.chainId),
        block.number,
        tx.index,
        fromAddress,
        toAddress,
        tx.nonce,
        tx.hash
      ]);

      // Decode transaction data if applicable
      try {
        const decodedData = iface.parseTransaction({ data: tx.data });
        if (decodedData?.args.length && decodedData.args[0].length > 1) {
          const tokenId = await getTokenId(decodedData.args[0]);
          await db.query(SQLTxData, [
            Number(tx.chainId),
            block.number,
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