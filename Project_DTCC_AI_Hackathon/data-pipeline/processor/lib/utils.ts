import { DBConnector } from "./db";
import { ChainConnector } from "./onchain";
  // Initialize database connection
  const db = new DBConnector();

/**
 * Retrieve or insert wallet information in the database
 * @param walletAddress - The Ethereum wallet address
 * @returns Wallet ID from the database
 */
export async function getWalletId(walletAddress: string): Promise<number> {

  const SQLWalletSelect = `SELECT wallet_id FROM wallets WHERE wallet_address = ?`;
  const SQLWalletInsert = `INSERT INTO wallets (wallet_address, type) VALUES (?, ?)`;
  // Connect to the Ethereum mainnet
  const chain = new ChainConnector("mainnet");
  const provider = chain.provider;
  const [result] = await db.query(SQLWalletSelect, [walletAddress]);


  if (result.length) {

    return result[0]["wallet_id"];
  } else {

    return 0; // skip new wallet creation  SPEED UP

    const code = await provider.getCode(walletAddress);
    const walletType = code !== "0x" ? "Contract" : "Account";

    await db.query(SQLWalletInsert, [walletAddress, walletType]);
    const [insertResult] = await db.query("SELECT LAST_INSERT_ID() AS wallet_id");

    return insertResult[0]["wallet_id"];
  }
}

/**
 * Retrieve or insert token information in the database
 * @param tokenAddress - The contract address of the token
 * @returns Token ID from the database
 */
export async function getTokenId(tokenAddress: string): Promise<number> {


  const SQLTokenSelect = `SELECT token_id FROM tokens WHERE token_address = ? `;
  const SQLTokenInsert = `INSERT INTO tokens (token_address, tcla_id, last_update) VALUES (?, 1, NOW()) `;

  const [result] = await db.query(SQLTokenSelect, [tokenAddress]);

  if (result.length) {

    return result[0]["token_id"];
  } else {
    await db.query(SQLTokenInsert, [tokenAddress]);
    const [insertResult] = await db.query("SELECT LAST_INSERT_ID() AS token_id");

    return insertResult[0]["token_id"];
  }
}


/**
 * Introduce a delay to manage rate limits or avoid API throttling
 * @param ms - Duration of delay in milliseconds (default: 3000ms)
 */
export function delay(ms: number = 100): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }