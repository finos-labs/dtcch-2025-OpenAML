import { createHash } from 'crypto';

export class SanctionLoader {
    private bitArray: Uint8Array;
    private filterSize: number;
    private hashFunctions: number;

    constructor(filterSize = 1000000, hashFunctions = 5) {
        this.filterSize = filterSize;
        this.hashFunctions = hashFunctions;
        this.bitArray = new Uint8Array(filterSize);
    }

    private getHashes(data: string): number[] {
        const hashes = [];
        for (let i = 0; i < this.hashFunctions; i++) {
            const hash = createHash('sha256').update(data + i).digest('hex');
            hashes.push(parseInt(hash.substring(0, 8), 16) % this.filterSize);
        }
        return hashes;
    }

    private normalizeAddress(address: string): string {
        return address.toLowerCase(); // simplified EIP-55 normalization logic
    }

    addSanctionedAddress(address: string): void {
        const normalized = this.normalizeAddress(address);
        const hashes = this.getHashes(normalized);
        for (const hash of hashes) {
            this.bitArray[hash] = 1;
        }
    }

    isSanctioned(address: string): boolean {
        const normalized = this.normalizeAddress(address);
        const hashes = this.getHashes(normalized);
        for (const hash of hashes) {
            if (this.bitArray[hash] === 0) {
                return false;
            }
        }
        return true; // Possible false positive, acceptable in Bloom filter
    }
}