![badge-labs](https://user-images.githubusercontent.com/327285/230928932-7c75f8ed-e57b-41db-9fb7-a292a13a1e58.svg)

## OpenAML
Open and Intelligent Compliance for On-Chain Anti-Money Laundering.

### Project Details

**OpenAML** is an open-source academic project under the stewardship of the [Fintech Open Source Foundation (FINOS)](https://www.finos.org/)
, a nonprofit organization within the Linux Foundation. The project studies illicit financial activity in Web3 systems, with a focus on stablecoin transactions. It develops and evaluates a risk analysis and detection framework based on supervised and unsupervised machine learning methods. The system analyzes blockchain data to identify patterns associated with suspicious behavior and to assign risk scores to transactions. OpenAML originated as a project at Duke University during the DTCC AI Hackathon and serves as a research platform for exploring approaches to blockchain-based anti–money laundering.



## Project Structure

* [**Model**](./Model) – Contains the final trained machine learning models for community use. The models were trained on data from over **30,000 wallets**, using **16 transaction-based features**. These include aggregated counts and values of incoming and outgoing transactions (e.g., total volume, large/small transfers, and interactions with unique wallets).

* [**Multiclass**](./Model/MultiClass/) – Hosts the new generation of multi-class AML models, designed to classify wallets into Normal, Hack/Phishing, and Sanctioned/Blocked categories. Trained on a dataset of over 55 million unique wallets and 330 million stablecoin transfers, these models integrate over 70 engineered features derived from USDT and USDC blockchain activity. The folder includes benchmark comparisons (Random Forest, CatBoost, LightGBM, XGBoost, DNN, GNN, and Logistic Regression) and reproducible training pipelines aligned with the OpenAML v2 Framework.

* [**Data**](./Data) – Includes a dataset of over **250,000 flagged wallets** involved in illicit activity, including addresses sanctioned by the **SEC** and **OFAC**.

* [**Whitepaper**](./Whitepaper.md) -  Technical and strategic overview of the OpenAML project, including architecture, AI methodology, data pipeline, use cases, and team background.

* [**DTCC\_AI\_Hackathon\_Project**](./Project_DTCC_AI_Hackathon) – The original project prototype that won the **Academic Prize** at the **DTCC AI Hackathon**. Developed by a team of **Duke University** Master’s students in **AI** and **FinTech**.

* [**StableAML\_Paper**](./StableAML_Paper) – StableAML is the first labeled dataset specifically constructed for **stablecoin AML research**.

* [**OpenKYT**](./OpenKYT/) - OpenKYT is an AI-powered blockchain analytics that combines Large Language Models (LLMs) with live  blockchain data to provide deep insights into transaction patterns, risk scoring, and compliance reporting.

* [**Skills**](./Skills/) – The Compliance skill translates frameworks such as FATF Recommendation 16, IVMS 101, and EU TFR/AMLA into code, enabling automated payload validation for VASP-to-VASP data exchange, the generation of jurisdiction-specific SAR/STR reports for the US, EU, and Singapore, and deterministic verification for DeFi, unhosted wallets, and cross-chain transfers.

## License

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)








