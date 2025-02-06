import { DBConnector } from "../lib/db";
import * as fs from "fs";
import * as readline from "readline";
import { parse } from "csv-parse";

import { getWalletId, getTokenId } from "../lib/utils";

let SKIP: string = "";
// Initialize database connection
const db = new DBConnector();

interface Transaction {
  block_hash: string;
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
  transaction_index: number;
  event_index: number;
  batch_index: number;
  address: string;
  event_type: string;
  event_hash: string;
  event_signature: string;
  operator_address: string;
  from_address: string;
  to_address: string;
  token_id: string;
  quantity: number;
  removed: boolean;
}

async function readCSV(filename: string): Promise<void> {

  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const parser = parse({
    columns: true,
    delimiter: ",",
  });

  rl.on("line", (line) => {
    parser.write(line + "\n");
  });

  rl.on("close", () => {
    parser.end();
  });

  console.log("Reading CSV file...", filename);
  parser.on('readable', async () => {
    let record;
    while ((record = parser.read()) !== null) {

      await saveTransaction(record as Transaction);
    }
  });

  parser.on("error", (error) => {
    console.error("Failed to parse CSV file:", error);
  });
}

/**
 * Fetch and process transactions from the latest block on the blockchain
 */
async function saveTransaction(tx: Transaction): Promise<void> {

  if (!tx || !tx.from_address || !tx.to_address) return;

  const fromAddress = await getWalletId(tx.from_address);
  const toAddress = await getWalletId(tx.to_address);

  if (!fromAddress || !toAddress) return;
  if (fromAddress % 3 !== 0) return;
  const tokenId = await getTokenId(tx.address);


  await db.query(SQLTransaction, [
    formatTimestamp(tx.block_timestamp),
    fromAddress,
    toAddress,
    tokenId,
    tx.quantity

  ]);


  await db.query(SQLTransaction, [
      tx.block_timestamp,
    1,
    tx.block_number,
    tx.transaction_index,
    fromAddress,
    toAddress,
    tx.transaction_hash,
    tokenId,
    tx.quantity

  ]);



  await db.query(SQLTxData, [
  1,
  tx.block_number,,
  tx.transaction_index,
  tokenId,
  tx.quantity
  ]);

  const [result] = await db.query(SQLSelectToken, [toAddress, tokenId]);

  if (result[0]['c'] == 0) {
    await db.query(SQLToken, [
      toAddress,
      tokenId,
      tx.quantity]);

    // console.log("Token saved:", tokenId, tx.quantity);
  } else {
    await db.query(SQLUpdateToken, [
      tx.quantity,
      toAddress,
      tokenId]);
    //console.log("Token updated:", tokenId, tx.quantity);
  }



  //console.log("Transaction saved:", tx.transaction_hash, tokenId, tx.quantity);
  console.log(tx.transaction_hash, fromAddress);

}

// SQL Queries
const SQLTransaction = `
  INSERT  ignore INTO transactions_light (timestamp, from_wallet_id, to_wallet_id,   token_id, amount)
  VALUES (?,?, ?, ?, ?)
`;


// SQL Queries
const SQLTransactionFull = `
  INSERT ignore INTO transactions (timestamp,chain_id, block_number, tx_index, from_wallet_id, to_wallet_id,  hash, token_id, amount)
  VALUES (?,?, ?, ?, ?, ?, ?, ?,?)
`;

const SQLTxData = `
  INSERT ignore INTO transaction_data (tx_chain_id, tx_block_number, tx_index, token_id, amount)
  VALUES (?, ?, ?, ?, ?)
`;

const SQLToken = `insert ignore into balance (wallet_id, token_id, balance) values (?, ?, ?)`;
const SQLSelectToken = `select count(1) c from balance where wallet_id = ? and token_id = ?`;
const SQLUpdateToken = `update balance set balance = balance + ? where wallet_id = ? and token_id = ?`;

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const files = [ '../data/transactions.csv'];

async function main(): Promise<void> {
  for (const file of files) {
      await readCSV(`/Users/juvinski/Downloads/arquivos/${file}`);
      process.exit(0);
  }
}

// Execute the main function
main();



