import { DBConnector } from "../lib/db";
import * as fs from "fs";
import * as readline from "readline";
import { getTokenId } from "../lib/utils";

// Initialize database connection
const db = new DBConnector();

/**
 * Main function to parse command line arguments and initiate the token classification update process.
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: ts-node set_token_classification.ts <filename> <id>");
    process.exit(1);
  }

  const filename = args[0];
  const id = parseInt(args[1], 10);

  if (isNaN(id)) {
    console.error("The ID must be a number.");
    process.exit(1);
  }

  await setTokenClassification(filename, id);
}

/**
 * Reads a file line by line and updates the token classification in the database.
 * 
 * @param filename - The name of the file containing token addresses.
 * @param id - The classification ID to be set for each token.
 */
async function setTokenClassification(filename: string, id: number) {
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
        console.log(`Invalid token address: ${line}`);
        continue;
      }

      const tokenAddress = line.trim();
      const token_id = await getTokenId(tokenAddress);

      const SQLUpdateTokenClassification = `UPDATE tokens SET tcla_id = ? WHERE token_id = ?`;
      await db.query(SQLUpdateTokenClassification, [id, token_id]);
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