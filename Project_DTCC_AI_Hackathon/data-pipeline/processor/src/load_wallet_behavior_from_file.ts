import { DBConnector } from "../lib/db";
import * as fs from "fs";
import * as readline from "readline";
import { getWalletId } from "../lib/utils";
import { get } from "http";

const db = new DBConnector();

async function readFile(filename: string, wcla_id: string): Promise<void> {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  console.log("Reading file...", filename);

  let lines: string[] = [];
  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", async () => {
    for (const line of lines) {
      await processLine(line, wcla_id);


    }
  });

  async function processLine(line: string, wcla_id: string): Promise<void> {
    const wallet_id = await getWalletId(line);
    if (wallet_id % 3 !== 0) return;

    const [rows] = await db.query(SQLSelect, [wallet_id, wcla_id]);

    if (rows[0]["c"] == 0) {
      await db.query(SQLInsert, [wallet_id, wcla_id]);
    } else {
      await db.query(SQLUpdate, [wallet_id, wcla_id]);
    }
    console.log("Processed line...", line, wallet_id, wcla_id);
  }
}

// Main function
async function main() {
  const filename = process.argv[2];
  const wcla_id = process.argv[3];

  await readFile(filename, wcla_id);
}

const SQLSelect = "select count(1) c from wallet_behavior where wallet_id = ? and wcla_id = ?";
const SQLInsert = "insert into wallet_behavior (wallet_id, wcla_id, score, last_activity) values (?,?,1,curdate())";
const SQLUpdate = "update wallet_behavior set score = score + 1, last_activity = curdate() where wallet_id = ? and wcla_id = ?";

// Run the main
main();
