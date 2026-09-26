import { SanctionLoader } from '../src/finos/tagging/sanction_loader';

describe('Bloom Filter Sanction Loader', () => {
    it('should quickly load and query addresses with low false-positive rate', () => {
        const loader = new SanctionLoader(10000, 3);
        const sanctionedAddress = '0xBad1111111111111111111111111111111111111';
        const cleanAddress = '0xGood222222222222222222222222222222222222';

        loader.addSanctionedAddress(sanctionedAddress);
        
        expect(loader.isSanctioned(sanctionedAddress)).toBe(true);
        expect(loader.isSanctioned(cleanAddress)).toBe(false);

        // Normalize case test
        expect(loader.isSanctioned(sanctionedAddress.toUpperCase())).toBe(true);
    });
});