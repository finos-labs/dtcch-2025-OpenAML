# StableAML Dataset

**StableAML** is a research-grade dataset for Anti–Money Laundering (AML) detection in stablecoin ecosystems on Ethereum.

It provides a labeled wallet-level dataset designed to support machine learning research, compliance analytics, and behavioral detection modeling for USDT and USDC transactions from 2017 to 2025.

---

## 📦 Dataset Download

Download the dataset here:

👉 **[StableAML.csv.gz](./StableAML.csv.gz)**

*(Compressed CSV file containing labeled wallet-level features.)*

---

## 🔎 What Is StableAML?

StableAML is the first large-scale labeled dataset specifically constructed for **stablecoin AML research**.

It focuses on:

* **USDT and USDC transfer events**
* Wallet-level behavioral aggregation
* Regulatory and cybercrime labeling
* Feature-driven supervised learning

The dataset supports research in:

* Financial crime detection
* Blockchain analytics
* Risk scoring models
* Explainable AI for compliance
* Stablecoin regulatory monitoring

---

## 📊 Dataset Overview

* **Unit of analysis:** Wallet address
* **Scope:** Ethereum USDT and USDC transfer activity
* **Features:** 68 engineered behavioral attributes
* **Classes:**

  * `Normal`
  * `Cybercrime`
  * `Blocklisted`

Each wallet is enriched using global transaction activity, including:

* Total volume sent and received
* Interaction with centralized exchanges
* Exposure to mixers and bridges
* Second- and third-degree risk propagation signals
* Temporal burst behavior
* Proxy and clustering patterns

---

## 🧠 Why StableAML Matters

Stablecoins have become critical infrastructure in the digital asset economy — and a growing vector for illicit finance.

Traditional graph-based AML approaches struggle with:

* Cross-asset swaps
* Fragmented transaction chains
* Privacy-enhancing mechanisms

StableAML takes a **feature-centric approach**, demonstrating that domain-informed behavioral engineering can outperform deep graph models in stablecoin environments.

The dataset supports the shift from probabilistic tracing toward **deterministic compliance analytics** aligned with emerging global regulation (MiCA, GENIUS Act, FATF guidance).

---

## 📘 Related Paper

This dataset accompanies the research paper:

**StableAML: Machine Learning for Behavioral Wallet Detection in Stablecoin Anti–Money Laundering on Ethereum**

The study demonstrates:

* Macro-F1 scores above 0.97 using tree ensemble models
* Strong separation between Cybercrime and Blocklisted typologies
* Feature importance aligned with classical AML stages:

  * Placement
  * Layering
  * Integration

---

## 🔬 Intended Use

StableAML is designed for:

* Academic research
* AML model benchmarking
* Risk modeling experimentation
* Regulatory technology (RegTech) development
* Explainable compliance analytics

It is **not** intended for direct enforcement or sanctions decision-making without additional investigation.

---

## 📄 Citation

If you use this dataset in academic work, please cite:

```
Juvinski, L., Haochen, L., Brini, A. (2026).
StableAML: Machine Learning for Behavioral Wallet Detection
in Stablecoin Anti–Money Laundering on Ethereum.
```

---

## 🤝 Project Context

For updates and collaboration:

👉 [https://github.com/finos-labs/dtcch-2025-OpenAML](https://github.com/finos-labs/dtcch-2025-OpenAML)

---

## ⚠️ Disclaimer

This dataset reflects labeled information based on publicly available enforcement disclosures and forensic reporting at the time of construction. Labels do not constitute legal determinations.
