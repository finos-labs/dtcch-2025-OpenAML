![badge-labs](https://user-images.githubusercontent.com/327285/230928932-7c75f8ed-e57b-41db-9fb7-a292a13a1e58.svg)

## OpenAML
Open and Intelligent Compliance for On-Chain Anti-Money Laundering.

### Project Details

**OpenAML** is an open-source initiative under the stewardship of the [Fintech Open Source Foundation (FINOS)](https://www.finos.org/), a nonprofit organization within the Linux Foundation dedicated to accelerating collaboration and innovation in financial services through the adoption of open-source software, standards, and best practices. As the Web3 ecosystem expands, the sophistication of illicit financial activities increases, posing significant risks to its stability and mainstream adoption. Notably, stablecoins have emerged as a preferred medium for illicit transactions due to their price stability and widespread acceptance across DeFi protocols. OpenAML addresses these challenges with a sophisticated Risk Analysis & Detection Engine that leverages advanced artificial intelligence, including supervised and unsupervised machine learning techniques. Our platform processes vast amounts of blockchain data to identify suspicious patterns, score transaction risks, and provide actionable insights through APIs, reports, and real-time alerts. Originating as a winning project at the DTCC AI Hackathon, OpenAML aims to empower financial institutions, crypto businesses, and regulatory bodies with the tools necessary to foster a safer and more trustworthy digital asset environment.



## Project Structure

* [**Model**](./Model) – Contains the final trained machine learning models for community use. The models were trained on data from over **30,000 wallets**, using **16 transaction-based features**. These include aggregated counts and values of incoming and outgoing transactions (e.g., total volume, large/small transfers, and interactions with unique wallets).

* [**Raw\_Data**](./Data) – Includes a dataset of over **250,000 flagged wallets** involved in illicit activity, including addresses sanctioned by the **SEC** and **OFAC**.

* [**DTCC\_AI\_Hackathon\_Project**](./Project_DTCC_AI_Hackathon) – The original project prototype that won the **Academic Prize** at the **DTCC AI Hackathon**. Developed by a team of **Duke University** Master’s students in **AI** and **FinTech**.


## Using DCO to sign your commits

**All commits** must be signed with a DCO signature to avoid being flagged by the DCO Bot. This means that your commit log message must contain a line that looks like the following one, with your actual name and email address:

```
Signed-off-by: John Doe <john.doe@example.com>
```

Adding the `-s` flag to your `git commit` will add that line automatically. You can also add it manually as part of your commit log message or add it afterwards with `git commit --amend -s`.

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for more information

### Helpful DCO Resources
- [Git Tools - Signing Your Work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
- [Signing commits
](https://docs.github.com/en/github/authenticating-to-github/signing-commits)


## License

Copyright 2025 FINOS

Distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

SPDX-License-Identifier: [Apache-2.0](https://spdx.org/licenses/Apache-2.0)








