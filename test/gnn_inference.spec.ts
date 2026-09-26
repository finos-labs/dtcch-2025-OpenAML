import { GraphBuilder } from '../src/finos/graph/builder';
import { SanctionLoader } from '../src/finos/tagging/sanction_loader';
import { GraphTraversal } from '../src/finos/graph/traversal';
import { GnnScoringModel } from '../src/finos/ml/scoring';

describe('GNN Anomaly Scoring', () => {
    it('should assign a score based on hop distance and degree within 50ms', () => {
        const builder = new GraphBuilder();
        const loader = new SanctionLoader();
        const traversal = new GraphTraversal(builder, loader);
        const scoring = new GnnScoringModel(builder, traversal);

        const target = '0xTarget';
        loader.addSanctionedAddress('0xSanctioned');
        builder.addEdge(target, '0xSanctioned', '1', Date.now(), 'hash');
        
        const start = performance.now();
        const score = scoring.calculateAnomalyScore(target);
        const end = performance.now();

        expect(score).toBe(0.8);
        expect(end - start).toBeLessThan(50);
    });
});