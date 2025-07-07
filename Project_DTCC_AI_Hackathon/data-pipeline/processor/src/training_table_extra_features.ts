

import { DBConnector } from "../lib/db";
const db = new DBConnector();

async function main() {

    // ALTER TABLE `Sentinel`.`traininig_table_output` 
    // ADD COLUMN `from_transaction_count` BIGINT NULL AFTER `small_transaction_sum`,
    // ADD COLUMN `from_transaction_sum` DECIMAL(65,0) NULL AFTER `from_transaction_count`,
    // ADD COLUMN `to_transaction_count` BIGINT NULL AFTER `from_transaction_sum`,
    // ADD COLUMN `to_transaction_sum` DECIMAL(65,0) NULL AFTER `to_transaction_count`,
    // ADD COLUMN `to_unique_wallet` SMALLINT NULL AFTER `to_transaction_sum`,
    // ADD COLUMN `from_unique_wallet` SMALLINT NULL AFTER `to_unique_wallet`;


    const SQLTransactionFrom = "select b.wallet_id wallet, count(b.wallet_id) as total_transaction, sum(a.amount) as total_sum \
    from base4 a, training_table b \
     where a.from_wallet_id=b.wallet_id  group by wallet";


    const SQLTransactionTo = "select b.wallet_id wallet, count(b.wallet_id) as total_transaction, sum(a.amount) as total_sum \
    from base4 a, training_table b \
     where  a.to_wallet_id=b.wallet_id group by wallet";

     const SQLBigTransaction = "select b.wallet_id wallet, count(b.wallet_id) as total_transaction, sum(a.amount) as total_sum \
     from base4 a, traininig_table_output b \
      where  mod(a.from_wallet_id,2)=0 \
      and a.from_wallet_id=b.wallet_id or a.to_wallet_id=b.wallet_id and  a.amount > ?\
       group by wallet";

      const SQLSmallTransaction = "select b.wallet_id wallet, count(b.wallet_id) as total_transaction, sum(a.amount) as total_sum \
      from base4 a, traininig_table_output b \
       where  mod(a.from_wallet_id,2)=0 \
       and a.from_wallet_id=b.wallet_id or a.to_wallet_id=b.wallet_id and  a.amount < ? \
       group by wallet";

       const SQLUniqueWalletFrom="select from_wallet_id, count(1) c from unique_tx group by from_wallet_id having c=1";

       const SQLUniqueWalletTo = "select to_wallet_id, count(1) c from unique_tx group by to_wallet_id having c=1";

       //create table unique_tx_big select from_wallet_id,to_wallet_id, concat(from_wallet_id,'-',to_wallet_id) gr, count(to_wallet_id) c, if (amount>2138360000000000000,1,0) isbig  from base4   group by gr  having c=1;

       const SQLUniqueBigFrom="select from_wallet_id, count(1) c, isbig  from unique_tx_big group by from_wallet_id having c=1 and isbig=1";
//create table unique_tx_small select from_wallet_id,to_wallet_id, concat(from_wallet_id,'-',to_wallet_id) gr, count(to_wallet_id) c, if (amount<101383674,1,0) issmall  from base4   group by gr  having c=1;
       const SQLUniqueSmallFrom="select from_wallet_id, count(1) c, issmall  from unique_tx_small group by from_wallet_id having c=1 and issmall=1";

       const SQLUniqueBigTo="select to_wallet_id, count(1) c, isbig  from unique_tx_big group by to_wallet_id having c=1 and isbig=1";
       const SQLUniqueSmallTo="select to_wallet_id, count(1) c, issmall  from unique_tx_small group by to_wallet_id having c=1 and issmall=1";

     const BIG_THRESHOLD='2138360000000000000';
     const SMALL_THRESHOLD='101383674';

//create table unique_from select from_wallet_id, concat(from_wallet_id,'-',to_wallet_id) gr, count(from_wallet_id) c from base4 group by gr  having c=1;
//create table unique_to select to_wallet_id, concat(from_wallet_id,'-',to_wallet_id) gr, count(to_wallet_id) c from base4 group by gr  having c=1;

// | from_transaction_count  | bigint                      | YES  |     | NULL    |       |
// | from_transaction_sum    | decimal(65,0)               | YES  |     | NULL    |       |
// | to_transaction_count    | bigint                      | YES  |     | NULL    |       |
// | to_transaction_sum      | decimal(65,0)               | YES  |     | NULL    |       |

    // adding total transaction and sum
    let  [results] = await db.query(SQLTransactionFrom);
    let SQL = `update traininig_table_output set from_transaction_sum = ? , from_transaction_count = ?  where wallet_id = ?`;
    for (const result of results) {
        await db.query(SQL,[ result.total_sum, result.total_transaction, result.wallet]);    
    }

    // adding total transaction and sum
      [results] = await db.query(SQLTransactionTo);
     SQL = `update traininig_table_output set to_transaction_sum = ? , to_transaction_count = ?  where wallet_id = ?`;
    for (const result of results) {
        await db.query(SQL,[ result.total_sum, result.total_transaction, result.wallet]);    
    }


// from_unique_big  from_unique_small from_unique_to
    // console.log("Unique big from ...");
    // let [results] = await db.query(SQLUniqueBigFrom);
    // let SQL = `update traininig_table_output set from_unique_big = 1  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[result.from_wallet_id]);    
    // }
     
    // console.log("Unique small from ...");
    // // adding total transaction and sum for big transactions
    //  [results] = await db.query(SQLUniqueSmallFrom);
    //  SQL = `update traininig_table_output set from_unique_small = 1  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[result.from_wallet_id]);    
    // }
     
    // console.log("Unique big to ...");
    //  [results] = await db.query(SQLUniqueBigTo);
    //  SQL = `update traininig_table_output set to_unique_big = 1  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[result.from_wallet_id]);    
    // }
     
    // console.log("Unique small to ...");
    // // adding total transaction and sum for big transactions
    // let [results] = await db.query(SQLUniqueSmallTo);
    // let  SQL = `update traininig_table_output set to_unique_small = 1  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[result.to_wallet_id]);    
    // }

    // console.log("Unique from ...");
    // // adding total transaction and sum for big transactions
    // let [results] = await db.query(SQLUniqueWalletFrom);
    // let SQL = `update traininig_table_output set from_unique_wallet = 1  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[result.from_wallet_id]);    
    // }
     
    // console.log("Unique to ...");
    // // adding total transaction and sum for big transactions
    //  [results] = await db.query(SQLUniqueWalletTo);
    //  SQL = `update traininig_table_output set to_unique_wallet = 1  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[result.to_wallet_id]);    
    // }
     
  //  to_unique_wallet


    // console.log("Adding big transactions...");
    // // adding total transaction and sum for big transactions
    // let [results] = await db.query(SQLBigTransaction,[BIG_THRESHOLD]);
    // let SQL = `update traininig_table_output set big_transaction_count = ? , big_transaction_sum = ?  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[result.total_transaction, result.total_sum, result.wallet]);    
    // }

    // console.log("Adding small transactions...");
    // // adding total transaction and sum for small transactions
    // [results] = await db.query(SQLSmallTransaction,[SMALL_THRESHOLD]);
    // SQL = `update traininig_table_output set small_transaction_count = ? , small_transaction_sum = ?  where wallet_id = ?`;
    // for (const result of results) {
    //     await db.query(SQL,[ result.total_transaction, result.total_sum, result.wallet]);    
    // }
    



    
}

main().then(() => process.exit(0));