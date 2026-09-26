# Technical Implementation Walkthrough

## [2026-09-26T07:47:00+02:00] Pull Request #10 & Documentation Synchronization

### Task Description
Update the existing OpenAML Pull Request **[PR #10](https://github.com/finos-labs/dtcch-2025-OpenAML/pull/10)** on `finos-labs/dtcch-2025-OpenAML` with a comprehensive description, gitDiagram architecture visualization, and color-coded component markup (green for newly added, orange for modified, red for removed). Simultaneously synchronize project documentation (`README.md`) to seamlessly reflect the newly added Case 3 architecture plan and local development orchestration scripts.

### Proposed Step-by-Step Technical Walkthrough

1. **Pull Request Details Formatted for PR #10:**
   - **Target PR:** `https://github.com/finos-labs/dtcch-2025-OpenAML/pull/10`
   - **Branch:** `bmifsud:openAMLDemo` -> `finos-labs:main`
   - **Interactive gitDiagram:** Integration link pointing to `https://gitdiagram.com/finos-labs/dtcch-2025-OpenAML`.
   - **Color-Coded Component Markup:**
     - 🟩 **Green Highlighter (`#2ea043`):** Newly added components (`plan-case3-finos-openaml.md`, `run_dev.ps1`, `start_openkyt.ps1`, `OpenKYT/backend/api/test_main.py`).
     - 🟧 **Orange Highlighter (`#d29922`):** Connected runtime components (FastAPI application `main.py`, Vite React frontend).
     - 🟥 **Red Highlighter (`#f85149`):** Replaced manual multi-terminal launch commands.
   - **DCO / Contributor Agreement:** Verified Developer Certificate of Origin checks.

2. **Continuous Universal Documentation Synchronization:**
   - Review [`README.md`](file:///c:/Users/DELL/Stsack/dtcch-2025-OpenAML/README.md) in `dtcch-2025-OpenAML`.
   - Update the **Project Structure** section to seamlessly blend:
     - `plan-case3-finos-openaml.md` as the Web3 & Stablecoin Anomaly Detection roadmap.
     - `start_openkyt.ps1` / `run_dev.ps1` under OpenKYT quickstart orchestration.

3. **Authentication & PR Updating:**
   - Since `github-mcp-server` requires `GITHUB_PERSONAL_ACCESS_TOKEN` in `C:\Users\DELL\.gemini\antigravity-ide\mcp_config.json` for write API calls, provide the complete, formatted PR payload directly to the user for instant one-click updating on GitHub or configuring the token.

---

## [2026-09-26T07:54:00+02:00] Branch Creation: `feature/case3-step1-blockchain-graph-pipeline`

### Task Description
Create and check out a dedicated feature branch from the previous branch push (`openAMLDemo`, commit `dd0233e`) for **Prompt 3.1: Blockchain RPC Graph Feature Ingestion Pipeline**, aligning with the Case 3 technical execution plan in `plan-case3-finos-openaml.md`.

### Implementation Status
1. **Source Commit:** `dd0233e` (`openAMLDemo`)
2. **Branch Name:** `feature/case3-step1-blockchain-graph-pipeline`
3. **Upstream Remote Tracking:** `origin/feature/case3-step1-blockchain-graph-pipeline` established.
4. **Next Planned Milestones:**
   - Implement `/src/finos/ingestion/rpc_indexer.ts` (EVM RPC transfer logs parser).
   - Implement `/src/finos/graph/builder.ts` (Directed graph construction).
   - Implement unit & integration test coverage with Playwright.

---

## [2026-09-26T07:59:00+02:00] Prompt 3.1: Blockchain RPC Graph Feature Ingestion Pipeline

### Task Description
Implement Prompt 3.1 according to `plan-case3-finos-openaml.md`:
1. Build `/src/finos/ingestion/rpc_indexer.ts` to fetch ERC-20 transfer logs, smart contract calls, and wallet balances via Ethereum/EVM JSON-RPC nodes with exponential backoff and provider failover.
2. Build `/src/finos/graph/builder.ts` to construct lightweight directed transactional sub-graphs (nodes = wallets, edges = token transfers with value/timestamp attributes) supporting >10,000 nodes with high memory efficiency.
3. Build unit test suite in `/test/rpc_parser.spec.ts` testing ERC-20 event parsing, EIP-55 checksum normalization, and graph node/edge integrity from sample block receipts.
4. Build integration test suite in `/integration/rpc_graph_ingest.integration.spec.ts` using Playwright (`npx playwright test`) to mock RPC node responses and validate graph topology generation and rate-limit recovery.

### Step-by-Step Implementation Walkthrough

#### Step 1: Tooling & Infrastructure Setup
- Create root [`package.json`](file:///c:/Users/DELL/Stsack/dtcch-2025-OpenAML/package.json) with TypeScript, tsx, Playwright (`@playwright/test`), and ethers/viem or standard native fetch utilities for JSON-RPC.
- Configure [`tsconfig.json`](file:///c:/Users/DELL/Stsack/dtcch-2025-OpenAML/tsconfig.json) for strict TypeScript compilation.
- Configure [`playwright.config.ts`](file:///c:/Users/DELL/Stsack/dtcch-2025-OpenAML/playwright.config.ts) with `fullyParallel: true` and integration test matching.

#### Step 2: Ingestion Engine (`/src/finos/ingestion/rpc_indexer.ts`)
- Define TypeScript types: `RawBlockReceipt`, `ERC20TransferLog`, `RPCProviderConfig`, `WalletBalance`.
- Implement `RPCIndexer` class:
  - Multi-provider connection pool with round-robin / fallback failover.
  - Exponential backoff retry handler with jitter for HTTP 429 (Too Many Requests) and 5xx errors.
  - EIP-55 address normalization function.
  - `fetchTransferLogs(fromBlock, toBlock, contractAddresses?)`: queries `eth_getLogs` for ERC-20 `Transfer(address,address,uint256)`.
  - `fetchWalletBalance(address, blockTag?)`: queries `eth_getBalance`.
  - `executeContractCall(to, data, blockTag?)`: queries `eth_call`.

#### Step 3: Transactional Graph Builder (`/src/finos/graph/builder.ts`)
- Define graph types: `WalletNode`, `TokenTransferEdge`, `TransactionGraph`.
- Implement `TransactionGraphBuilder`:
  - In-memory adjacency list backed by `Map<string, Set<string>>` and flat edge pools to ensure minimal memory overhead for 10k+ nodes.
  - `addTransfer(transfer: ERC20TransferLog)`: adds/updates source and destination wallet nodes, increments degree metrics, and appends edge metadata (token, amount, timestamp, blockNumber, txHash).
  - `getSubGraph(walletAddress: string, maxHops: number)`: extracts localized neighborhood for downstream AML anomaly classification.
  - Graph statistics reporting: node count, edge count, density, top hubs.

#### Step 4: Unit Testing (`/test/rpc_parser.spec.ts`)
- Test receipt log parsing for ERC-20 transfers (USDT, USDC, DAI 6-decimal & 18-decimal tokens).
- Test EIP-55 checksumming edge cases.
- Test graph construction: verifying directed edge direction, attribute retention, and duplicate handling.

#### Step 5: Playwright Parallel Integration Testing (`/integration/rpc_graph_ingest.integration.spec.ts`)
- Playwright runner with stateless mock RPC server intercepting JSON-RPC requests.
- Verify failover behavior when the primary RPC endpoint returns HTTP 429.
- Verify end-to-end block ingestion resulting in structured sub-graphs.

#### Step 6: Verification & Quality Gate
- Run full test suite: `npx playwright test`.
- Verify memory consumption during synthetic 10,000-node graph generation.
- Format all modified files.


