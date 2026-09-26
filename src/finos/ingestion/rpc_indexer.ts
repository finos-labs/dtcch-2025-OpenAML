export interface RpcLog {
    address: string;
    topics: string[];
    data: string;
    blockNumber: string;
    transactionHash: string;
}

export interface BalanceUpdate {
    wallet: string;
    balance: string;
}

export class RpcIndexer {
    private rpcEndpoint: string;

    constructor(rpcEndpoint: string) {
        this.rpcEndpoint = rpcEndpoint;
    }

    async fetchErc20Transfers(fromBlock: string, toBlock: string, tokenAddress: string): Promise<RpcLog[]> {
        // Mocked implementation for pulling ERC-20 transfer logs
        return [
            {
                address: tokenAddress,
                topics: [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x0000000000000000000000001111111111111111111111111111111111111111", // from
                    "0x0000000000000000000000002222222222222222222222222222222222222222"  // to
                ],
                data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000", // 1e18
                blockNumber: fromBlock,
                transactionHash: "0x1234567890abcdef"
            }
        ];
    }

    async getWalletBalance(wallet: string): Promise<BalanceUpdate> {
        return { wallet, balance: "1000000000000000000" };
    }
}
