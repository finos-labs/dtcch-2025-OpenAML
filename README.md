![badge-labs](https://user-images.githubusercontent.com/327285/230928932-7c75f8ed-e57b-41db-9fb7-a292a13a1e58.svg)

## OpenAML
Open and Intelligent Compliance for On-Chain Anti-Money Laundering.

### Project Details

**OpenAML** is an open-source initiative under the stewardship of the [Fintech Open Source Foundation (FINOS)](https://www.finos.org/), a nonprofit organization within the Linux Foundation dedicated to accelerating collaboration and innovation in financial services through the adoption of open-source software, standards, and best practices. As the Web3 ecosystem expands, the sophistication of illicit financial activities increases, posing significant risks to its stability and mainstream adoption. Notably, stablecoins have emerged as a preferred medium for illicit transactions due to their price stability and widespread acceptance across DeFi protocols. OpenAML addresses these challenges with a sophisticated Risk Analysis & Detection Engine that leverages advanced artificial intelligence, including supervised and unsupervised machine learning techniques. Our platform processes vast amounts of blockchain data to identify suspicious patterns, score transaction risks, and provide actionable insights through APIs, reports, and real-time alerts. Originating as a winning project at the DTCC AI Hackathon, OpenAML aims to empower financial institutions, crypto businesses, and regulatory bodies with the tools necessary to foster a safer and more trustworthy digital asset environment.



## Project Structure

* [**Model**](./Model) – Contains the final trained machine learning models for community use. The models were trained on data from over **30,000 wallets**, using **16 transaction-based features**. These include aggregated counts and values of incoming and outgoing transactions (e.g., total volume, large/small transfers, and interactions with unique wallets).

* [**Multiclass**](./Model/MultiClass/) – Hosts the new generation of multi-class AML models, designed to classify wallets into Normal, Hack/Phishing, and Sanctioned/Blocked categories. Trained on a dataset of over 55 million unique wallets and 330 million stablecoin transfers, these models integrate over 70 engineered features derived from USDT and USDC blockchain activity. The folder includes benchmark comparisons (Random Forest, CatBoost, LightGBM, XGBoost, DNN, GNN, and Logistic Regression) and reproducible training pipelines aligned with the OpenAML v2 Framework.

* [**Data**](./Data) – Includes a dataset of over **250,000 flagged wallets** involved in illicit activity, including addresses sanctioned by the **SEC** and **OFAC**.

* [**Whitepaper**](./Whitepaper.md) -  Technical and strategic overview of the OpenAML project, including architecture, AI methodology, data pipeline, use cases, and team background.

* [**DTCC\_AI\_Hackathon\_Project**](./Project_DTCC_AI_Hackathon) – The original project prototype that won the **Academic Prize** at the **DTCC AI Hackathon**. Developed by a team of **Duke University** Master’s students in **AI** and **FinTech**.

* [**StableAML\_Paper**](./StableAML_Paper) – StableAML is the first labeled dataset specifically constructed for **stablecoin AML research**.

* [**OpenKYT**](./OpenKYT/) - OpenKYT is an AI-powered blockchain analytics that combines Large Language Models (LLMs) with live  blockchain data to provide deep insights into transaction patterns, risk scoring, and compliance reporting.

## License

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)








