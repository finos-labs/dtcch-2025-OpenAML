import { GraphBuilder, GraphEdge, GraphNode } from './builder';
import { SanctionLoader } from '../tagging/sanction_loader';

export class GraphTraversal {
    private builder: GraphBuilder;
    private sanctionLoader: SanctionLoader;

    constructor(builder: GraphBuilder, sanctionLoader: SanctionLoader) {
        this.builder = builder;
        this.sanctionLoader = sanctionLoader;
    }

    findHopDistanceToSanctioned(originWallet: string, maxHops: number = 3): number {
        const origin = originWallet.toLowerCase();
        if (this.sanctionLoader.isSanctioned(origin)) {
            return 0; // The origin itself is sanctioned
        }

        const edges = this.builder.getEdges();
        
        // Build adjacency list for traversal (undirected for taint propagation)
        const adjacency: Map<string, string[]> = new Map();
        for (const edge of edges) {
            if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
            if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
            adjacency.get(edge.source)!.push(edge.target);
            adjacency.get(edge.target)!.push(edge.source);
        }

        let currentLevel = new Set<string>([origin]);
        let visited = new Set<string>([origin]);

        for (let hop = 1; hop <= maxHops; hop++) {
            const nextLevel = new Set<string>();
            for (const node of currentLevel) {
                const neighbors = adjacency.get(node) || [];
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        if (this.sanctionLoader.isSanctioned(neighbor)) {
                            return hop;
                        }
                        visited.add(neighbor);
                        nextLevel.add(neighbor);
                    }
                }
            }
            if (nextLevel.size === 0) break;
            currentLevel = nextLevel;
        }

        return -1; // Not found within maxHops
    }
}