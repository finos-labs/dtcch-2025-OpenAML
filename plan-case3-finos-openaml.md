# Case 3: FINOS OpenAML — On-Chain Web3 & Stablecoin Anomaly Detection Plan

## Scenario Overview
Institutional Crypto Exchange & Stablecoin Issuer ("VeriCoin") manages decentralized liquidity pools and fiat-backed stablecoin minting. VeriCoin must monitor on-chain wallet transactions to detect mixing services (e.g. Tornado Cash), sanctioned crypto addresses, and multi-hop laundering topologies before issuing or redeeming stablecoins.

---

## Global Governance & Architecture Constraints
- **Test Structure:** Unit tests in `/test/` and integration tests in `/integration/`.
- **Parallel Testing:** Coordinated via Playwright (`npx playwright test`) simulating EVM RPC blocks and wallet graph nodes.
- **Git Strategy:** Branch from `main` -> Complete Step -> Run Tests & ECC Security Review -> Open PR -> Merge to `main` -> Pull updated `main` to start next branch.
- **ECC Security & Performance:** EIP-55 address normalization, exponential backoff for RPC rate limits, <50ms Graph Neural Network (GNN) inference threshold, FINOS Common Domain Model (CDM) schema compliance.

---

## Step-by-Step Prompt Ingestion Sequence

### Prompt 3.1: Blockchain RPC Graph Feature Ingestion Pipeline
- **Target Branch:** `feature/case3-step1-blockchain-graph-pipeline` (branched from `main`)
- **Prompt:**
  ```text
  Build the feature extraction pipeline for FINOS OpenAML that parses raw blockchain RPC logs and constructs transactional sub-graphs.

  Requirements:
  1. Create `/src/finos/ingestion/rpc_indexer.ts` to pull ERC-20 transfer logs, smart contract calls, and wallet balances via Ethereum/EVM RPC nodes.
  2. Create `/src/finos/graph/builder.ts` to transform raw transfers into directed graph structures (nodes = wallets, edges = token transfers with value/timestamp attributes).
  3. Write unit tests in `/test/rpc_parser.spec.ts` testing graph node and edge creation from sample block receipts.
  4. Write integration tests in `/integration/rpc_graph_ingest.integration.spec.ts` using Playwright to mock RPC node responses and evaluate graph topology generation.

  ECC Security & Quality Gate:
  - Handle RPC node rate limits with exponential backoff and automatic provider failover.
  - Ensure memory efficiency when loading large transaction graphs (>10,000 nodes).

  PR Instructions:
  Confirm tests pass -> Open PR -> Merge to main -> Pull main.
  ```

---

### Prompt 3.2: On-Chain Sanctions & Sub-Graph Tagging Engine
- **Target Branch:** `feature/case3-step2-sanctioned-wallet-tagger` (branched from updated `main` after PR 3.1 merge)
- **Prompt:**
  ```text
  Integrate OFAC-sanctioned crypto wallet feeds and privacy-mixer address lists into the OpenAML sub-graph tagger.

  Requirements:
  1. Create `/src/finos/tagging/sanction_loader.ts` to import known sanctioned wallet addresses (OFAC, Tornado Cash, privacy mixers) into an in-memory Bloom filter.
  2. Implement multi-hop graph traversal in `/src/finos/graph/traversal.ts` to calculate hop distance (1-hop, 2-hop, 3-hop) from any transaction origin wallet to a sanctioned node.
  3. Write unit tests in `/test/bloom_filter_sanctions.spec.ts` verifying low false-positive rate and high-speed address lookup.
  4. Write integration tests in `/integration/graph_sanction_tagging.integration.spec.ts` testing multi-hop taint propagation using Playwright parallel runners.

  ECC Security & Quality Gate:
  - Ensure zero dynamic SQL or unsanitized graph database queries during address evaluation.
  - All wallet addresses must be normalized to lowercase EIP-55 checksum format before lookup.

  PR Instructions:
  Confirm tests pass -> Open PR -> Merge to main -> Pull main.
  ```

---

### Prompt 3.3: Graph ML Anomaly Model Scoring & RegTech CDM Reporting
- **Target Branch:** `feature/case3-step3-ml-scoring-cdm-reporting` (branched from updated `main` after PR 3.2 merge)
- **Prompt:**
  ```text
  Build the ML anomaly scoring service and output compliance reports formatted according to the FINOS Common Domain Model (CDM).

  Requirements:
  1. Create `/src/finos/ml/scoring.ts` to execute lightweight Graph Neural Network (GNN) inference rules over transaction sub-graphs, outputting an Anomaly Score (0.00 to 1.00).
  2. Create `/src/finos/reporting/cdm_formatter.ts` to export high-risk transaction alerts into standard FINOS Common Domain Model JSON-LD structures.
  3. Write unit tests in `/test/gnn_inference.spec.ts` testing model evaluation consistency on synthetic graph samples.
  4. Write integration tests in `/integration/finos_e2e_cdm_export.integration.spec.ts` executing end-to-end block ingestion to CDM export using Playwright test orchestration.

  ECC Security & Quality Gate:
  - Ensure ML model inference time is capped at <50ms per address sub-graph.
  - Validate that all CDM JSON-LD output schemas conform strictly to FINOS RegTech specifications.

  PR Instructions:
  Confirm tests pass -> Open PR -> Merge to main -> Pull main.
  ```
