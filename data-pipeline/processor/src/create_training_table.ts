// +-------------------------+-----------------------------+------+-----+----------+-------+
// | Field                   | Type                        | Null | Key | Default  | Extra |
// +-------------------------+-----------------------------+------+-----+----------+-------+
// | wallet_id               | bigint                      | NO   | PRI | NULL     |       |
// | balance_value           | decimal(65,0)               | YES  |     | NULL     |       |
// total_transaction_sum | decimal(65,0)               | YES  |     | NULL     |       |
// | total_transaction_count       | int                         | YES  |     | NULL     |       |
// | big_transactions_count  | int                         | YES  |     | NULL     |       |
// | big_transaction_sum     | decimal(65,0)               | YES  |     | NULL     |       |
// | small_transaction_count | int                         | YES  |     | NULL     |       |
// | small_transaction_sum   | decimal(65,0)               | YES  |     | NULL     |       |
// | classification          | enum('Positive','Negative') | YES  |     | Positive |       |


// mysql> desc wallet_behavior;
// +---------------+--------+------+-----+---------+-------+
// | Field         | Type   | Null | Key | Default | Extra |
// +---------------+--------+------+-----+---------+-------+
// | wallet_id     | bigint | NO   | PRI | NULL    |       |
// | wcla_id       | int    | NO   | PRI | NULL    |       |
// | score         | int    | YES  |     | NULL    |       |
// | last_activity | date   | YES  |     | NULL    |       |

import { DBConnector } from "../lib/db";
const db = new DBConnector();

async function main() {

    // empty the table
    await db.query("truncate training_table");
    console.log("Table truncated");

    // select negatives
    const SQLBase = "select wallet_id from wallet_behavior where wcla_id=1";
    
    // select positives
    const SQLNegative = "select wallet_id from wallet_behavior where wcla_id=20";
    // select transaction and sum
    const SQLTransaction = "select b.wallet_id wallet, count(b.wallet_id) as total_transaction, sum(a.amount) as total_sum \
    from transactions_light a, training_table b \
     where a.from_wallet_id=b.wallet_id or a.to_wallet_id=b.wallet_id group by wallet";

     const SQLBigTransaction = "select b.wallet_id wallet, count(b.wallet_id) as total_transaction, sum(a.amount) as total_sum \
     from transactions_light a, training_table b \
      where a.from_wallet_id=b.wallet_id or a.to_wallet_id=b.wallet_id and  a.amount > ? group by wallet";

      const SQLSmallTransaction = "select b.wallet_id wallet, count(b.wallet_id) as total_transaction, sum(a.amount) as total_sum \
      from transactions_light a, training_table b \
       where a.from_wallet_id=b.wallet_id or a.to_wallet_id=b.wallet_id and  a.amount < ? group by wallet";

       const SQLBalance = "select b.wallet_id wallet, sum(a.balance) as total_balance \
       from balance a, training_table b \
        where a.wallet_id=b.wallet_id  group by wallet";
 
     const BIG_THRESHOLD=10000000;
     const SMALL_THRESHOLD=1000000;

    // adding negatives
    let [results] = await db.query(SQLBase);
    for (const result of results) {
        const wallet_id = result.wallet_id;
        const SQL = `insert into training_table (wallet_id,classification)  values (${wallet_id},'Negative')`;
        await db.query(SQL);
    }
    
    // adding positive (ignoring the ones already in the table as negative)
     [results] = await db.query(SQLNegative);
    for (const result of results) {
        const wallet_id = result.wallet_id;
        const SQL = `insert ignore into training_table (wallet_id,classification)  values (${wallet_id},'Positive')`;
        await db.query(SQL);
    }
    
    // adding total transaction and sum
    [results] = await db.query(SQLTransaction);
    let SQL = `update training_table set total_transaction_sum = ? , total_transaction_count = ?  where wallet_id = ?`;
    for (const result of results) {
        await db.query(SQL,[result.wallet, result.total_sum, result.total_transaction]);    
    }

    // adding total transaction and sum for big transactions
    [results] = await db.query(SQLBigTransaction,[BIG_THRESHOLD]);
    SQL = `update training_table set big_transactions_count = ? , big_transaction_sum = ?  where wallet_id = ?`;
    for (const result of results) {
        await db.query(SQL,[result.wallet,  result.total_transaction, result.total_sum]);    
    }

    // adding total transaction and sum for small transactions
    [results] = await db.query(SQLSmallTransaction,[SMALL_THRESHOLD]);
    SQL = `update training_table set small_transactions_count = ? , small_transaction_sum = ?  where wallet_id = ?`;
    for (const result of results) {
        await db.query(SQL,[result.wallet,  result.total_transaction, result.total_sum]);    
    }
    
    // update balance
    [results] = await db.query(SQLBalance);
    SQL = `update training_table set  wallet_balance = ?  where wallet_id = ?`;
    for (const result of results) {
        await db.query(SQL,[result.total_balance, result.wallet]);    
    }
    
}

main().then(() => process.exit(0));