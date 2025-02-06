import { DBConnector } from "../lib/db";

// mysql> describe traininig_table_output;
// +-------------------------+-----------------------------+------+-----+---------+-------+
// | Field                   | Type                        | Null | Key | Default | Extra |
// +-------------------------+-----------------------------+------+-----+---------+-------+
// | wallet_id               | bigint                      | NO   | PRI | NULL    |       |
// | classification          | enum('Negative','Positive') | YES  |     | NULL    |       |
// | total_transaction_count | bigint                      | NO   |     | 0       |       |
// | total_transaction_sum   | decimal(65,0)               | YES  |     | NULL    |       |
// | big_transaction_count   | bigint                      | YES  |     | NULL    |       |
// | big_transaction_sum     | decimal(65,0)               | YES  |     | NULL    |       |
// | small_transaction_count | bigint                      | YES  |     | NULL    |       |
// | small_transaction_sum   | decimal(65,0)               | YES  |     | NULL    |       |

const SMALL_THRESHOLD = 101383674;
async function main() {
    const db = new DBConnector();
    const [results] = await db.query("select wallet_id,total_transaction_count,total_transaction_sum,big_transaction_count,big_transaction_sum,small_transaction_count,small_transaction_sum,from_transaction_count,from_transaction_sum,to_transaction_count,to_transaction_sum,to_unique_wallet,from_unique_wallet,from_unique_big,to_unique_big,from_unique_small,to_unique_small, classification from traininig_table_output");
    // print header
    console.log(Object.keys(results[0]).join(","));
    for (const result of results) {
        // print as csv
        // replace null by 0
        for (const key in result) {
            if (result[key] === null) {
                result[key] = 0;
            }
            // if the key contains sum , reduce using log
            if (key.includes("sum") && result[key] > 0) {
                result[key] =  Math.log(result[key]);
            }
        }
        
        console.log(Object.values(result).join(","));
    }
}

main().then(() => process.exit(0));


