import { GraphBuilder } from '../graph/builder';
import { GraphTraversal } from '../graph/traversal';

export class GnnScoringModel {
    private builder: GraphBuilder;
    private traversal: GraphTraversal;

    constructor(builder: GraphBuilder, traversal: GraphTraversal) {
        this.builder = builder;
        this.traversal = traversal;
    }

    calculateAnomalyScore(walletTarget: string): number {
        const start = performance.now();
        
        let score = 0.0;
        
        const hopDist = this.traversal.findHopDistanceToSanctioned(walletTarget, 3);
        if (hopDist === 0) {
            score = 1.0; 
        } else if (hopDist === 1) {
            score = 0.8;
        } else if (hopDist === 2) {
            score = 0.5;
        } else if (hopDist === 3) {
            score = 0.2;
        }

        const nodes = this.builder.getNodes();
        const targetNode = nodes.find(n => n.id === walletTarget.toLowerCase());
        
        if (targetNode && targetNode.degree > 100) {
            score = Math.min(1.0, score + 0.1); 
        }

        const end = performance.now();
        if (end - start > 50) {
            console.warn("GNN Inference exceeded 50ms performance threshold!");
        }

        return parseFloat(score.toFixed(2));
    }
}