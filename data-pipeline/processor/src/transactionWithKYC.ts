import { DBConnector } from "../lib/db";

const db = new DBConnector();

async function main() {
    // 

    const SQL = "select from_wallet_id, to_wallet_id from transactions_light \
    where from_wallet_id in (297,1825,174254,761,665) or to_wallet_id in (297,1825,174254,761,665)";
    const [results] = await db.query(SQL);
    for (const result of results) {
        console.log(result);
        let address=0;
        // if from is the contract use the to as the address
        if (result.from_wallet_id in [297,1825,174254,761,665]) {
            address = result.to_wallet_id;
        } else {
            address = result.from_wallet_id;
        }
        await db.query("insert ignore into wallet_behavior (wallet_id, wcla_id) values (?,20)",[address]);
    }

}

main().then(() => { process.exit() });