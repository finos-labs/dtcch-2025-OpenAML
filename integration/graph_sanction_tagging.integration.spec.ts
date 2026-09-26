import { test, expect } from '@playwright/test';
import { GraphBuilder } from '../src/finos/graph/builder';
import { SanctionLoader } from '../src/finos/tagging/sanction_loader';
import { GraphTraversal } from '../src/finos/graph/traversal';

test.describe('Graph Sanction Tagging Integration', () => {
    test('should propagate taint over multi-hop distance correctly', async () => {
        const builder = new GraphBuilder();
        const loader = new SanctionLoader(10000, 3);
        const traversal = new GraphTraversal(builder, loader);
        
        // Define addresses
        const sanctioned = '0xSanctioned0000000000000000000000000000';
        const intermediate1 = '0xTrader11111111111111111111111111111111';
        const intermediate2 = '0xTrader22222222222222222222222222222222';
        const user = '0xCleanUser33333333333333333333333333333';

        // Add sanction
        loader.addSanctionedAddress(sanctioned);

        // Build edges: user -> int2 -> int1 -> sanctioned
        builder.addEdge(user, intermediate2, "1", Date.now(), "hash1");
        builder.addEdge(intermediate2, intermediate1, "1", Date.now(), "hash2");
        builder.addEdge(intermediate1, sanctioned, "1", Date.now(), "hash3");

        const hopDist = traversal.findHopDistanceToSanctioned(user, 3);
        
        expect(hopDist).toBe(3);
    });
});