import { test, expect } from '@playwright/test';
import { RpcIndexer } from '../src/finos/ingestion/rpc_indexer';
import { GraphBuilder } from '../src/finos/graph/builder';
import { SanctionLoader } from '../src/finos/tagging/sanction_loader';
import { GraphTraversal } from '../src/finos/graph/traversal';
import { GnnScoringModel } from '../src/finos/ml/scoring';
import { CdmFormatter } from '../src/finos/reporting/cdm_formatter';

test.describe('End-to-End FINOS CDM Export Integration', () => {
    test('should ingest RPC logs, score graph anomalies, and output CDM JSON-LD', async () => {
        const indexer = new RpcIndexer('http://mock-rpc');
        const logs = await indexer.fetchErc20Transfers('0x1', '0x2', '0xtoken');

        const builder = new GraphBuilder();
        for (const log of logs) {
            builder.addEdge(log.topics[1], log.topics[2], log.data, Date.now(), log.transactionHash);
        }

        const loader = new SanctionLoader();
        loader.addSanctionedAddress(logs[0].topics[2]); // The target of transfer

        const traversal = new GraphTraversal(builder, loader);
        const model = new GnnScoringModel(builder, traversal);

        const originWallet = logs[0].topics[1];
        const score = model.calculateAnomalyScore(originWallet);

        expect(score).toBeGreaterThan(0.0);

        if (score >= 0.5) {
            const report = CdmFormatter.exportAlert(originWallet, score, "ALERT-1001");
            expect(report['@context']).toBe("https://finos.org/cdm/context.jsonld");
            expect(report.riskScore).toBe(score);
            expect(report.party.walletAddress).toBe(originWallet.toLowerCase());
        }
    });
});