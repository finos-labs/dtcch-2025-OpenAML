export interface CdmAlert {
    "@context": string;
    "@type": string;
    alertId: string;
    party: {
        walletAddress: string;
    };
    riskScore: number;
    timestamp: string;
}

export class CdmFormatter {
    static exportAlert(wallet: string, riskScore: number, alertId: string): CdmAlert {
        return {
            "@context": "https://finos.org/cdm/context.jsonld",
            "@type": "AnomalyAlert",
            alertId: alertId,
            party: {
                walletAddress: wallet.toLowerCase()
            },
            riskScore: riskScore,
            timestamp: new Date().toISOString()
        };
    }
}