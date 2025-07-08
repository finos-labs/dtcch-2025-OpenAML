# Data
This folder contains structured datasets of blockchain wallet addresses categorized by risk level and behavioral typology. Each entry is enriched with a high-confidence **Annotation** that indicates the nature of the wallet’s involvement in illicit or suspicious activities.

>  **All annotations are based on verified information** from public blockchain intelligence sources and threat reporting platforms. Wherever possible, this information can be cross-checked using public block explorers such as [Etherscan](https://etherscan.io/) or [BscScan](https://bscscan.com/).

---

### 📦 Dataset Summary

* **Total Wallets**: \~500,000 vetted and annotated addresses
* **Last Update**: July 8, 2025
* **Data Format**: CSV files grouped by primary risk category

These records are grouped into **three distinct risk categories**, aligned with Anti-Money Laundering (AML) and financial crime typologies.

---

## 🔴 Category 1: **Sanctioned & Regulatory Blacklisted**

This dataset includes wallets that are formally sanctioned or blocked through legal and regulatory mechanisms:

* **OFAC-listed** entities under U.S. Treasury sanctions, including individuals, criminal organizations, and state actors.
* Addresses tied to companies or schemes flagged by the **U.S. Securities and Exchange Commission (SEC)**.
* Wallets blocked by custodial stablecoin providers such as **Tether (USDT)** or **Circle (USDC)** — often due to law enforcement actions or regulatory compliance requirements.

These addresses are considered **high-risk** and are typically **blocked outright** by regulated institutions. They represent **non-negotiable exclusion criteria** in any compliant blockchain operation.

---

## 🟠 Category 2: **Exploit-Linked & Security Incidents**

This dataset includes wallets linked to high-profile security breaches, protocol exploits, or asset drainer events, such as:

* **Smart contract exploits** (e.g., bZx, KyberSwap, uniBTC).
* **Private key compromise incidents**, where an attacker gained control of legitimate wallets.
* Drainers of user balances in **CEX breaches** (e.g., FTX).
* Reported exploits on **DeFi platforms or trading interfaces** (e.g., Bybit frontend hacks).

These addresses may not be under legal sanction, but are often actively monitored. Risk is context-dependent, requiring enhanced due diligence, tracing, and transaction screening.

---

## 🟡 Category 3: **Reported Scams & Phishing**

This dataset includes addresses that have been:

* Reported in **phishing attacks**, wallet drainers, or deceptive Web3 dApps (e.g., from HashDit reports).
* Involved in **rugpull scams**, where developers or operators abandoned or drained user funds.
* Flagged in community-based threat intel platforms as suspicious, though not necessarily part of regulatory blocklists.

These addresses pose significant risk to retail users and reputation-sensitive platforms. They are typically used in front-end filters, client-side alerts, and wallet protection systems.



## Each file includes the following fields:

* **`blockchain`** – The network where the wallet operates (e.g., Ethereum, BNB Chain, Polygon).
* **`wallet_address`** – The public wallet address under observation.
* **`annotation`** – A verified risk classification indicating the wallet’s known or suspected behavior (see categories below).

###  Sample Entry Format

```csv
blockchain,wallet_address,flag
Ethereum,0x1265bc855fd628aff6fed3fe4857a1b3b3597cfe,Fraud - Bybit hack
```


##  Intended Use

These datasets can be used to support:

* Risk scoring and transaction screening systems.
* Machine learning models for wallet behavior classification.
* Investigations, visual tracing, and suspicious activity reports (SARs).
* AML compliance tooling and on-chain monitoring.

You are encouraged to integrate this data with your detection engine, enrich it with transaction metadata, or cross-check with open-source intelligence (OSINT) sources.




