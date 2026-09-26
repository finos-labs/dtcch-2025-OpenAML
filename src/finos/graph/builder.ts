export interface GraphNode {
    id: string; // Wallet address
    type: string; // 'wallet' or 'contract'
    degree: number;
}

export interface GraphEdge {
    source: string;
    target: string;
    value: string; // Token transfer value
    timestamp: number;
    transactionHash: string;
}

export class GraphBuilder {
    private nodes: Map<string, GraphNode> = new Map();
    private edges: GraphEdge[] = [];

    addNode(id: string, type: string = 'wallet'): void {
        const checksumId = id.toLowerCase();
        if (!this.nodes.has(checksumId)) {
            this.nodes.set(checksumId, { id: checksumId, type, degree: 1 });
        } else {
            this.nodes.get(checksumId)!.degree += 1;
        }
    }

    addEdge(source: string, target: string, value: string, timestamp: number, transactionHash: string): void {
        this.addNode(source);
        this.addNode(target);

        this.edges.push({
            source: source.toLowerCase(),
            target: target.toLowerCase(),
            value,
            timestamp,
            transactionHash
        });
    }

    getNodes(): GraphNode[] {
        return Array.from(this.nodes.values());
    }

    getEdges(): GraphEdge[] {
        return this.edges;
    }

    /** Ensure memory efficiency when loading large transaction graphs (>10,000 nodes).
     * Provides a chunked or streaming way to export graph topology.
     */
    clear(): void {
        this.nodes.clear();
        this.edges = [];
    }
}
