# Sentinel AI Data Pipeline

## Overview
This repository contains the data pipeline for **Sentinel**, an AI model designed to score the risk of blockchain wallets. The pipeline extracts, processes, and prepares data for training the Sentinel model.

## Directory Structure

```
├── data/
│   ├── DRE_Sentinel.png                  # Sentinel architecture diagram
│   ├── dune.sql                           # SQL queries for data extraction from Dune Analytics
│   ├── sentinel_model.mwb                 # Database schema model
│   ├── biquery.txt                        # BigQuery-related queries
│   ├── flagged_scam_address.txt           # List of known scam addresses
│   ├── training_data.csv                   # Processed training dataset
│   ├── create_database.sql                 # SQL script to create the database
│   ├── kyc_proxys_contracts.txt            # List of KYC proxy contracts
│
├── processor/
│   ├── lib/                               # Utility scripts for database and on-chain interactions
│   │   ├── db.ts                          # Database connection utilities
│   │   ├── onchain.ts                     # On-chain data extraction utilities
│   │   ├── secrets.ts                     # Secure handling of API keys and credentials
│   │   ├── utils.ts                       # Helper functions
│   ├── setup/                             # Configuration and setup guides
│   │   ├── db_tuning.md                   # Database performance tuning documentation
│   │   ├── linux.md                       # Linux environment setup guide
│   ├── src/                               # Data processing scripts
│   │   ├── create_training_table.ts       # Script to create a table for model training
│   │   ├── export_training_file.ts        # Export processed data for model training
│   │   ├── fetch_block_transactions.ts    # Extracts blockchain transactions
│   │   ├── fetch_block_transaction_KYC.ts # Extracts transactions involving KYC tokens
│   │   ├── fetch_block_transaction_proxy.ts # Extracts transactions involving proxy wallets
│   │   ├── fetch_KYC_tokens_transactions.ts # Extracts KYC token transactions
│   │   ├── fetch_block_wallet_balance.ts  # Fetches wallet balances
│   │   ├── fetch_block_wallet_transaction.ts # Fetches transactions for individual wallets
│   │   ├── fetch_yahoofinance.ts          # Fetches financial data from Yahoo Finance
│   │   ├── load_wallet_behavior_from_file.ts # Loads wallet behavior from stored files
│   │   ├── read_bigquery_transactions.ts  # Reads transaction data from BigQuery
│   │   ├── set_token_classification.ts    # Classifies tokens based on risk assessment
│   │   ├── set_wallet_classification.ts   # Assigns risk scores to wallets
│   │   ├── training_table_extra_features.ts # Adds extra features for model training
│   ├── package.json                       # Node.js package configuration
│   ├── package-lock.json                  # Dependency lock file
│   ├── tsconfig.json                      # TypeScript configuration
```

## Setup Instructions

### Prerequisites
- Node.js & npm
- TypeScript
- PostgreSQL (or another database as per `db.ts` configuration)
- Access to blockchain API services
- Google BigQuery access (if using BigQuery data)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/sentinel-ai-pipeline.git
   cd sentinel-ai-pipeline
   ```
2. Install dependencies:
   ```sh
   cd processor
   npm install
   ```
3. Configure environment variables in `secrets.ts`

### Running the Pipeline
1. Set up the database:
   ```sh
   mysql -U username  database_name -f data/create_database.sql
   ```
2. Run the data extraction scripts:
   ```sh
   ts-node src/fetch_block_transactions.ts
   ```
3. Export training data:
   ```sh
   ts-node src/export_training_file.ts
   ```

## Contribution Guidelines
- Fork the repository
- Create a feature branch
- Submit a pull request with a detailed explanation

## License
This project is licensed under the MIT License.

## Contact
For any questions, contact **ljs65@duke.edu** or open an issue in the repository.

