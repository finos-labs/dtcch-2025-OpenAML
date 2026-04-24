---
name: digital-assets-compliance
description: >
  Teaches agents and models how to collect, process, and export Blockchain AML/CFT
  compliance data for Virtual Asset Service Providers (VASPs) and Crypto-Asset Service
  Providers (CASPs). Use this skill whenever the user asks about: Travel Rule data
  collection or transmission, IVMS 101 message formatting, VASP-to-VASP data exchange,
  blockchain transaction screening, KYC/KYB for crypto entities, suspicious activity
  reporting (SAR/STR) for digital assets, FATF Recommendation 15/16 implementation,
  sanctions screening against crypto addresses, on-chain analytics pipelines, AML
  compliance exports (CSV, JSON, XML), regulatory reporting for FinCEN/MiCA/MAS/FCA,
  or building any compliance tooling for DeFi, exchanges, custodians, or wallet providers.
  Also triggers for: "how do I implement the travel rule", "VASP data pipeline",
  "blockchain KYT", "crypto compliance workflow", "IVMS payload", "CASP AML obligations".
version: 1.0.0
license: MIT
authors:
  - @juvinski
references:
  - FATF Recommendations 15 & 16 (fatf-gafi.org)
  - IVMS 101 Standard (intervasp.org)
  - EU MiCA / TFR (Regulation EU 2023/1113 & 1114)
  - FinCEN BSA Rules (fincen.gov)
---

# Digital Assets AML/CFT Compliance Skill

This skill guides agents through the full lifecycle of **collecting**, **processing**, and
**exporting** AML/CFT compliance data in the blockchain/virtual asset space.

---

## Quick Reference — Read These Sections First

| Task | Go To |
|---|---|
| Understand the regulatory landscape | [§1 Regulatory Framework](#1-regulatory-framework) |
| Build IVMS 101 payloads | [§2 IVMS 101 Data Standard](#2-ivms-101-data-standard) |
| Implement Travel Rule pipeline | [§3 Travel Rule Workflow](#3-travel-rule-workflow) |
| Screen wallets & transactions | [§4 Transaction Screening](#4-transaction-screening--kyt) |
| KYC/KYB for VASPs | [§5 Entity Due Diligence](#5-entity-due-diligence-kyc--kyb) |
| Generate SAR/STR reports | [§6 Suspicious Activity Reporting](#6-suspicious-activity-reporting-sarsttr) |
| Export compliance data | [§7 Data Export Formats](#7-data-export-formats) |
| Jurisdiction-specific rules | [§8 Jurisdiction Modules](#8-jurisdiction-modules) |
| Code patterns & scripts | [§9 Implementation Patterns](#9-implementation-patterns) |

---

## 1. Regulatory Framework

### Core Standards (Global)

**FATF Recommendation 15 (R.15) — Virtual Assets**
- Requires countries to regulate VASPs under AML/CFT regimes equivalent to traditional FIs.
- Applies to: exchanges, custodians, wallet providers, DeFi protocols (where there is a
  controlling entity), NFT platforms (when used for financial transfer).
- Threshold trigger: any VASP activity.

**FATF Recommendation 16 (R.16) — The Travel Rule**
- VASPs must collect and transmit originator + beneficiary data with every transfer.
- FATF baseline threshold: **USD/EUR 1,000** per transaction.
- Jurisdictional variations: US = $3,000; EU = €0 (no threshold under TFR).
- Data must travel with the transaction, not be collected after the fact.

**Key compliance actors:**
- **Originating VASP (oVASP)**: Sends the transfer; must collect and transmit data.
- **Beneficiary VASP (bVASP)**: Receives the transfer; must verify and retain data.
- **Unhosted wallet**: Self-custodied wallet not controlled by a VASP — requires
  enhanced due diligence steps in many jurisdictions.

> For jurisdiction-specific thresholds, licensing, and reporting rules → see §8.

---

## 2. IVMS 101 Data Standard

IVMS 101 (interVASP Messaging Standard) is the universal data model for Travel Rule
message formatting. Always use IVMS 101 when structuring originator/beneficiary payloads.

### 2.1 Core Object Structure

```
IVMS101 Payload
├── originator
│   ├── originatorPersons[]          ← Natural person OR legal person
│   │   ├── naturalPerson
│   │   │   ├── name (nameIdentifier[])
│   │   │   ├── geographicAddress[]
│   │   │   ├── nationalIdentification
│   │   │   └── dateAndPlaceOfBirth
│   │   └── legalPerson
│   │       ├── name (legalPersonNameIdentifier[])
│   │       ├── geographicAddress[]
│   │       ├── nationalIdentification
│   │       └── customerIdentification
│   └── accountNumber[]              ← Blockchain address(es)
├── beneficiary
│   ├── beneficiaryPersons[]         ← Same structure as originatorPersons
│   └── accountNumber[]
└── transferPath (optional)
    └── intermediarySequence[]
```

### 2.2 Required Fields by FATF

| Field | Originator | Beneficiary |
|---|---|---|
| Name (full legal name) | ✅ Required | ✅ Required |
| Account number (wallet address) | ✅ Required | ✅ Required |
| Geographic address OR national ID OR date+place of birth | ✅ One required | ❌ Not required |
| National identification number | Preferred | ❌ Optional |

### 2.3 Canonical JSON Payload (Natural Person)

```json
{
  "originator": {
    "originatorPersons": [
      {
        "naturalPerson": {
          "name": {
            "nameIdentifier": [
              {
                "primaryIdentifier": "SMITH",
                "secondaryIdentifier": "ALICE",
                "nameIdentifierType": "LEGL"
              }
            ]
          },
          "geographicAddress": [
            {
              "streetName": "123 Main Street",
              "townName": "New York",
              "countrySubDivision": "NY",
              "country": "US",
              "addressType": "HOME"
            }
          ],
          "nationalIdentification": {
            "nationalIdentifier": "123-45-6789",
            "nationalIdentifierType": "SOCS",
            "registrationAuthority": "US"
          },
          "dateAndPlaceOfBirth": {
            "dateOfBirth": "1985-06-15",
            "placeOfBirth": "New York, US"
          }
        }
      }
    ],
    "accountNumber": ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"]
  },
  "beneficiary": {
    "beneficiaryPersons": [
      {
        "naturalPerson": {
          "name": {
            "nameIdentifier": [
              {
                "primaryIdentifier": "JONES",
                "secondaryIdentifier": "BOB",
                "nameIdentifierType": "LEGL"
              }
            ]
          }
        }
      }
    ],
    "accountNumber": ["0x742d35Cc6634C0532925a3b844Bc9e7595f89590"]
  }
}
```

### 2.4 Legal Person Payload

```json
{
  "originator": {
    "originatorPersons": [
      {
        "legalPerson": {
          "name": {
            "legalPersonNameIdentifier": [
              {
                "legalPersonName": "Acme Crypto Holdings Ltd",
                "legalPersonNameIdentifierType": "LEGL"
              }
            ]
          },
          "nationalIdentification": {
            "nationalIdentifier": "0123456789",
            "nationalIdentifierType": "LEIX",
            "registrationAuthority": "RA000589"
          },
          "customerIdentification": "CUST-98765"
        }
      }
    ],
    "accountNumber": ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"]
  }
}
```

> **Name identifier types**: `LEGL` = legal name, `MAID` = maiden name, `MISC` = other.
> **National ID types**: `DRLC` = driver's licence, `IDCD` = identity card,
> `PASN` = passport, `SOCS` = social security, `TXID` = tax ID, `LEIX` = LEI.

For full IVMS 101 field reference → read `references/ivms101-field-reference.md`

---

## 3. Travel Rule Workflow

### 3.1 Decision Logic

```
Transaction initiated by customer
         │
         ▼
Is amount ≥ jurisdiction threshold?
    NO  ──────────────────────────────► Still collect data for records; no transmission required
    YES │                               (unless suspicion exists)
        ▼
Is destination address a known VASP?
    NO  ──────────────────────────────► Unhosted wallet flow (see §3.3)
    YES │
        ▼
Send IVMS 101 payload to bVASP via Travel Rule protocol
(TRP / TRISA / TRUST / VerifyVASP / Sygna)
        │
        ▼
bVASP receives, validates, ACKs or rejects
        │
        ├── ACK ────────────────────────► Release transaction
        ├── REJECT (bad data) ──────────► Correct payload, resend
        └── NO RESPONSE (sunrise gap) ──► Apply hold-and-release policy
```

### 3.2 Protocol Selection

| Protocol | Architecture | Best For |
|---|---|---|
| **TRP** (Travel Rule Protocol) | Decentralized, peer-to-peer | Open-source deployments, EU |
| **TRISA** | PKI-based, network directory | US & international interoperability |
| **TRUST** | Permissioned network | US domestic transfers |
| **VerifyVASP** | Centralized registry | Asia-Pacific, MAS-regulated entities |
| **Sygna Bridge** | API-based hub | Custodial exchanges |

All protocols use IVMS 101 as the data payload format.

### 3.3 Unhosted Wallet Due Diligence

When a transfer involves an unhosted (self-hosted) wallet:
1. Collect customer's declaration of ownership of the wallet address.
2. Apply a micro-deposit proof-of-ownership or cryptographic signature verification.
3. Conduct enhanced risk scoring on the address (blockchain analytics — see §4).
4. Some jurisdictions (EU TFR) require full originator data even for unhosted wallets.
5. Log the decision and evidence trail in your compliance record.

### 3.4 Sunrise Problem Handling

When the counterparty VASP is in a jurisdiction that has not yet implemented the Travel Rule:
- **Hold-and-release**: Queue the transaction; attempt data exchange; release after timeout.
- **Best-efforts**: Send data, proceed if no rejection received within SLA window.
- **Document**: Record the jurisdiction status and your policy rationale in the audit log.

---

## 4. Transaction Screening & KYT

Know Your Transaction (KYT) screening must occur on **every** transaction, not just those
above the Travel Rule threshold.

### 4.1 Screening Checklist

- [ ] Wallet address against OFAC SDN list (and equivalent sanctions lists per jurisdiction)
- [ ] Wallet address against commercial blockchain analytics (Chainalysis, Elliptic, TRM Labs)
- [ ] Risk score: exposure to darknet markets, mixers/tumblers, ransomware, scams
- [ ] Cross-chain bridge activity (elevated layering risk)
- [ ] Transaction velocity: unusual frequency or amount patterns
- [ ] Cluster analysis: is the address linked to a known high-risk entity?

### 4.2 Risk Score Data Model

```json
{
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "chain": "bitcoin",
  "riskScore": 72,
  "riskLevel": "HIGH",
  "exposures": [
    { "category": "darknet_market", "directExposure": 0.02, "indirectExposure": 0.15 },
    { "category": "mixer", "directExposure": 0.0, "indirectExposure": 0.08 }
  ],
  "screenedAt": "2026-04-23T10:30:00Z",
  "provider": "chainalysis",
  "action": "BLOCK"
}
```

### 4.3 Action Thresholds (Recommended Defaults)

| Risk Score | Level | Recommended Action |
|---|---|---|
| 0–24 | LOW | Allow, standard monitoring |
| 25–49 | MEDIUM | Allow, enhanced monitoring, flag for review |
| 50–74 | HIGH | Hold, manual compliance review required |
| 75–100 | CRITICAL | Block, file SAR/STR if warranted |

---

## 5. Entity Due Diligence (KYC / KYB)

### 5.1 Individual Customer (KYC) — Required Fields

```
Tier 1 (Basic — low-value activity)
  ├── Full legal name
  ├── Date of birth
  ├── Country of residence
  └── Email / phone

Tier 2 (Standard — mid-value activity)
  ├── All Tier 1 fields
  ├── Government-issued photo ID (passport / national ID / driver's licence)
  ├── Residential address
  └── Source of funds declaration

Tier 3 (Enhanced — high-value / high-risk)
  ├── All Tier 2 fields
  ├── Proof of address (utility bill / bank statement < 3 months)
  ├── Source of wealth documentation
  ├── PEP / sanctions screening
  └── Ongoing enhanced monitoring
```

### 5.2 Business Customer (KYB) — Required Fields

```
Standard Business Verification
  ├── Legal entity name
  ├── Registration number + jurisdiction
  ├── Registered address
  ├── LEI (Legal Entity Identifier) if available
  ├── Beneficial ownership (UBOs ≥ 25% ownership threshold)
  │   └── KYC each UBO as individual (Tier 2 minimum)
  ├── Authorized signatories
  ├── Business purpose / activity description
  └── AML/CFT policy (for VASP-to-VASP relationships)
```

### 5.3 VASP Counterparty Due Diligence

Before establishing a Travel Rule relationship with another VASP:
1. Verify licensing/registration in home jurisdiction.
2. Obtain and review their AML/CFT policy.
3. Confirm they have a Travel Rule solution in place.
4. Check against FATF grey/black list jurisdictions.
5. Use VASPnet or similar registry for reference data.
6. Document and re-verify annually or on material change.

---

## 6. Suspicious Activity Reporting (SAR/STR)

### 6.1 SAR Trigger Indicators (Blockchain-Specific)

- Transaction routed through known mixers or privacy coins (Monero, Zcash with shielded tx)
- Rapid cycling: funds received and immediately forwarded to multiple wallets (structuring)
- Address linked to sanctioned entity, darknet market, or ransomware wallet cluster
- Customer provides inconsistent KYC information or refuses to explain source of funds
- Unusual transaction pattern inconsistent with customer's stated business purpose
- Large cash-to-crypto or crypto-to-cash conversion with no plausible business reason
- Customer inquiry about avoiding reporting thresholds

### 6.2 SAR Data Schema

```json
{
  "reportType": "SAR",
  "jurisdiction": "US",
  "filingInstitution": {
    "name": "Acme Exchange Inc.",
    "ein": "12-3456789",
    "fincenId": "31000012345678"
  },
  "subject": {
    "type": "individual",
    "name": "Alice Smith",
    "dob": "1985-06-15",
    "address": "123 Main St, New York, NY 10001",
    "idType": "passport",
    "idNumber": "AB1234567",
    "idCountry": "US"
  },
  "suspiciousActivity": {
    "category": "STRUCTURING",
    "subCategory": "crypto_layering",
    "description": "Customer conducted 47 transactions totaling $48,500 over 3 days,
                    each below the $1,000 reporting threshold, sending to 12 distinct
                    wallet addresses subsequently consolidated into a single address
                    with darknet market exposure score of 82.",
    "amount": 48500.00,
    "currency": "USD",
    "cryptoAsset": "BTC",
    "walletAddresses": ["bc1q...", "bc1q..."],
    "dateRange": { "from": "2026-04-01", "to": "2026-04-03" }
  },
  "filedAt": "2026-04-23T12:00:00Z"
}
```

> For jurisdiction-specific SAR filing formats (FinCEN SAR, UKFIU, FINTRAC STR, MAS STR)
> → read `references/sar-jurisdiction-formats.md`

---

## 7. Data Export Formats

### 7.1 Travel Rule Export (JSON — IVMS 101 Canonical)

See §2.3 for the full payload. When batch-exporting:

```json
{
  "exportMeta": {
    "exportedAt": "2026-04-23T00:00:00Z",
    "exportedBy": "compliance-system-v2",
    "recordCount": 150,
    "period": { "from": "2026-04-01", "to": "2026-04-22" }
  },
  "transfers": [ /* array of IVMS 101 payloads */ ]
}
```

### 7.2 Regulatory Reporting Export (CSV)

Standard columns for regulatory CSV exports:

```
transaction_id, timestamp_utc, chain, asset, amount_native, amount_usd,
originator_name, originator_address, originator_country, originator_wallet,
beneficiary_name, beneficiary_address, beneficiary_country, beneficiary_wallet,
risk_score, risk_level, screening_provider, travel_rule_status,
travel_rule_protocol, vasp_counterparty_name, vasp_counterparty_lei,
sar_filed, sar_reference, notes
```

### 7.3 Blockchain Analytics Export (JSON)

```json
{
  "screeningBatch": {
    "batchId": "SCR-2026-04-23-001",
    "screenedAt": "2026-04-23T10:00:00Z",
    "totalAddresses": 320,
    "blocked": 4,
    "flaggedForReview": 22,
    "cleared": 294
  },
  "results": [
    {
      "address": "...",
      "chain": "ethereum",
      "riskScore": 91,
      "action": "BLOCK",
      "sanctions": true,
      "sanctionsList": "OFAC_SDN",
      "screenedAt": "2026-04-23T10:00:01Z"
    }
  ]
}
```

### 7.4 Audit Log Format

Every compliance action must produce an immutable audit entry:

```json
{
  "auditId": "AUD-uuid-v4",
  "timestamp": "2026-04-23T10:05:33Z",
  "actor": "compliance-engine",
  "action": "TRAVEL_RULE_PAYLOAD_SENT",
  "entityId": "TXN-abc123",
  "protocol": "TRISA",
  "counterpartyVasp": "vasp.example.com",
  "outcome": "ACK_RECEIVED",
  "latencyMs": 340,
  "ivmsPayloadHash": "sha256:abcdef...",
  "retentionUntil": "2031-04-23"
}
```

> Data retention: FATF recommends minimum **5 years**. EU TFR requires **5 years**.
> US BSA requires **5 years**. Always apply the longest applicable retention period.

---

## 8. Jurisdiction Modules

For detailed rules per jurisdiction, read the relevant reference file:

| Jurisdiction | Framework | File |
|---|---|---|
| Global | FATF 40 Recommendations | `references/jurisdiction-fatf.md` |
| European Union | MiCA + TFR + AMLD6 + AMLA | `references/jurisdiction-eu.md` |
| United States | BSA + FinCEN + OFAC | `references/jurisdiction-us.md` |
| United Kingdom | MLR 2017 + FCA VASP regime | `references/jurisdiction-uk.md` |
| Singapore | MAS PSA + Travel Rule | `references/jurisdiction-sg.md` |
| UAE | CBUAE + VARA + ADGM | `references/jurisdiction-uae.md` |
| Switzerland | FINMA + AMLA | `references/jurisdiction-ch.md` |

---

## 9. Implementation Patterns

### 9.1 Collect → Screen → Transmit Pipeline (Python pseudocode)

```python
async def process_transfer(tx: Transaction) -> ComplianceResult:
    # Step 1: Collect originator/beneficiary data
    originator = await kyc_store.get(tx.sender_customer_id)
    beneficiary = await resolve_beneficiary(tx.destination_address)

    # Step 2: Screen wallets
    origin_risk  = await blockchain_analytics.screen(tx.origin_address)
    dest_risk    = await blockchain_analytics.screen(tx.destination_address)

    if origin_risk.level == "CRITICAL" or dest_risk.level == "CRITICAL":
        await block_transaction(tx, reason="sanctions_or_high_risk")
        await queue_sar_review(tx, origin_risk, dest_risk)
        return ComplianceResult(action="BLOCKED")

    # Step 3: Travel Rule — check threshold
    if tx.amount_usd >= JURISDICTION_THRESHOLD:
        ivms_payload = build_ivms101(originator, beneficiary, tx)
        validate_ivms101(ivms_payload)          # Must pass before sending

        counterparty_vasp = await vasp_registry.lookup(tx.destination_address)
        if counterparty_vasp:
            ack = await travel_rule_protocol.send(counterparty_vasp, ivms_payload)
            if not ack:
                return await hold_and_release_policy(tx, ivms_payload)
        else:
            await unhosted_wallet_diligence(tx, originator)

    # Step 4: Audit log
    await audit_log.record(tx, origin_risk, dest_risk, ivms_payload)
    return ComplianceResult(action="APPROVED")
```

### 9.2 IVMS 101 Validation Checklist

Before transmitting any payload, verify:
- [ ] `primaryIdentifier` is not empty or null
- [ ] `accountNumber` is a valid on-chain address for the stated network
- [ ] `country` codes are ISO 3166-1 alpha-2 (e.g., "US", "GB", "SG")
- [ ] `nameIdentifierType` is one of: `LEGL`, `MAID`, `MISC`
- [ ] `nationalIdentifierType` is a valid IVMS enum value
- [ ] Dates are ISO 8601 format (`YYYY-MM-DD`)
- [ ] No PII transmitted unencrypted over non-TLS channels
- [ ] Payload is logged with SHA-256 hash for audit trail integrity

### 9.3 Scripts

| Script | Purpose |
|---|---|
| `scripts/build_ivms101.py` | Generates and validates IVMS 101 JSON from raw KYC data |
| `scripts/screen_addresses.py` | Batch wallet screening via analytics API |
| `scripts/export_travel_rule.py` | Exports Travel Rule records to JSON/CSV |
| `scripts/generate_sar.py` | Drafts SAR/STR report from flagged transaction set |

---

## 10. Common Pitfalls & Edge Cases

| Situation | Correct Handling |
|---|---|
| Customer has no fixed address | Use `BIZZ` or `MLTO` address type; document |
| Destination VASP not in any directory | Treat as unhosted; apply enhanced diligence |
| Transaction below threshold but suspicious | Screen anyway; file SAR if warranted |
| Cross-chain bridge transfer | Screen both source and destination chains |
| DeFi protocol as counterparty | Assess if controlling entity exists; apply VASP rules if so |
| Batch/aggregated transactions | Disaggregate to individual transfer level for Travel Rule |
| Privacy coins (Monero, shielded Zcash) | Many jurisdictions prohibit; document policy |
| NFT transfer with financial value | Assess if it constitutes a virtual asset transfer |

---

## 11. Open Source Contribution Guide

This skill is MIT-licensed and community-maintained.

**To contribute:**
1. Fork the repository.
2. Update the relevant SKILL.md section or reference file.
3. Include regulatory citations with date of reference (standards evolve frequently).
4. Submit a pull request with a summary of what changed and why.
5. Reference the source regulation or FATF guidance update that triggered the change.

**Versioning**: Increment the `version` field in the YAML frontmatter on each release.
Follow semantic versioning: `MAJOR.MINOR.PATCH`.
- MAJOR: breaking changes to data schemas
- MINOR: new jurisdiction modules or significant workflow additions
- PATCH: corrections, clarifications, minor additions

**Priority contribution areas:**
- Additional jurisdiction modules (APAC, LATAM, Africa)
- DeFi-specific compliance patterns
- NFT AML guidance
- Stablecoin-specific Travel Rule handling
- AMLA (EU) implementation guidance (live 2026)

# Contact
ljs65@duke.edu
