import { GraphBuilder } from '../src/finos/graph/builder';
import { RpcIndexer } from '../src/finos/ingestion/rpc_indexer';

describe('RPC Parser and Graph Node/Edge Creation', () => {
    it('should create graph nodes and edges from sample block receipts', async () => {
        const indexer = new RpcIndexer('http://mock-rpc-node');
        const logs = await indexer.fetchErc20Transfers('0x1', '0x2', '0xtoken');
        
        const builder = new GraphBuilder();
        
        for (const log of logs) {
            // Mock extraction logic for the test
            const source = "0x1111111111111111111111111111111111111111";
            const target = "0x2222222222222222222222222222222222222222";
            const value = "1000000000000000000";
            
            builder.addEdge(source, target, value, Date.now(), log.transactionHash);
        }

        const nodes = builder.getNodes();
        const edges = builder.getEdges();

        expect(nodes.length).toBe(2);
        expect(edges.length).toBe(1);
        expect(edges[0].source).toBe("0x1111111111111111111111111111111111111111".toLowerCase());
    });
});
