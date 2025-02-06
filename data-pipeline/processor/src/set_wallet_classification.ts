import { DBConnector } from "../lib/db";
import * as fs from "fs";
import * as readline from "readline";
import { getWalletId } from "../lib/utils";

// Initialize database connection
const db = new DBConnector();

/**
 * Main function to parse command line arguments and initiate the token classification update process.
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: ts-node set_wallet_classification.ts <filename> <id>");
    process.exit(1);
  }

  const filename = args[0];
  const id = parseInt(args[1], 10);

  if (isNaN(id)) {
    console.error("The ID must be a number.");
    process.exit(1);
  }

  await setWalletClassification(filename, id);
}

/**
 * Reads a file line by line and updates the token classification in the database.
 * 
 * @param filename - The name of the file containing token addresses.
 * @param id - The classification ID to be set for each token.
 */
async function setWalletClassification(filename: string, id: number) {
  try {
    // Open the file and read it line by line
    const fileStream = fs.createReadStream(filename);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let count = 0;
    for await (const line of rl) {
      if (line.length !== 42) {
        console.log(`Invalid wallet address: ${line}`);
        continue;
      }

      const walletAddress = line.trim();
      const wallet_id = await getWalletId(walletAddress);

      const SQLSelectBehavior = `select count(1) c from wallet_behavior where wallet_id = ? and wcla_id = ?`;
      const SQLInsertBehavior = `insert into wallet_behavior (wallet_id, wcla_id, score, last_activity) values (?, ?, 1, curdate())`;
      const SQLUpdateBehavior = `update wallet_behavior set score = score + 1, last_activity = curdate() where wallet_id = ? and wcla_id = ?`;

      const [result] = await db.query(SQLSelectBehavior, [wallet_id, id]);

      if (result[0]["c"] === 0) {
        await db.query(SQLInsertBehavior, [wallet_id, id]);
      } else {
        await db.query(SQLUpdateBehavior, [wallet_id, id]);
      }
      count++;
    }

    console.log(`Updated ${count} token classifications.`);
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

// Execute the main function and handle any uncaught errors
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });