CREATE USER 'abc'@'localhost' IDENTIFIED BY 'abc';
GRANT ALL PRIVILEGES ON *.* TO 'sentinel'@'localhost' WITH GRANT OPTION;
flush privileges;


-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Sentinel
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Sentinel
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Sentinel` DEFAULT CHARACTER SET utf8 ;
USE `Sentinel` ;

-- -----------------------------------------------------
-- Table `Sentinel`.`wallets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`wallets` (
  `wallet_id` BIGINT NOT NULL AUTO_INCREMENT,
  `wallet_address` VARCHAR(42) NOT NULL,
  `first_transaction` BIGINT NULL,
  `type` ENUM('Account', 'Contract') NULL DEFAULT 'Account',
  PRIMARY KEY (`wallet_id`),
  INDEX `walletindex` (`wallet_address` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Sentinel`.`transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`transactions` (
  `chain_id` INT NOT NULL,
  `block_number` INT NOT NULL,
  `tx_index` INT NOT NULL,
  `from_wallet_id` BIGINT NOT NULL,
  `to_wallet_id` BIGINT NOT NULL,
  `nonce` INT NOT NULL,
  `hash` VARCHAR(66) NOT NULL,
  PRIMARY KEY (`chain_id`, `block_number`, `tx_index`),
  INDEX `fk_transactions_wallets_idx` (`from_wallet_id` ASC) VISIBLE,
  INDEX `fk_transactions_wallets1_idx` (`to_wallet_id` ASC) VISIBLE,
  CONSTRAINT `fk_transactions_wallets`
    FOREIGN KEY (`from_wallet_id`)
    REFERENCES `Sentinel`.`wallets` (`wallet_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_transactions_wallets1`
    FOREIGN KEY (`to_wallet_id`)
    REFERENCES `Sentinel`.`wallets` (`wallet_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Sentinel`.`token_classification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`token_classification` (
  `tcla_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL,
  `risk_level` ENUM('Positive', 'Neutral', 'Negative', 'Fraud') NULL DEFAULT 'Neutral',
  `description` VARCHAR(250) NULL,
  PRIMARY KEY (`tcla_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Sentinel`.`tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`tokens` (
  `token_id` BIGINT NOT NULL AUTO_INCREMENT,
  `tcla_id` INT NOT NULL,
  `token_address` VARCHAR(42) NULL,
  `symbol` VARCHAR(15) NULL,
  `slug` VARCHAR(45) NULL,
  `category` VARCHAR(50) NULL,
  `decimal` INT NULL,
  `website` VARCHAR(255) NULL,
  `logo` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `data_added` DATETIME NULL,
  `date_launched` DATETIME NULL,
  `cmc_id` INT NULL,
  `cmc_rank` INT NULL,
  `num_pairs` INT NULL,
  `circulation_supply` DECIMAL(65,0) NULL,
  `total_supply` DECIMAL(65,0) NULL,
  `price_usd` DECIMAL(20,2) NULL,
  `volume_24h` DECIMAL(30,2) NULL,
  `maket_cap` DECIMAL(30,2) NULL,
  `last_update` DATETIME NULL,
  PRIMARY KEY (`token_id`),
  INDEX `addressindext` (`token_address` ASC) VISIBLE,
  INDEX `fk_tokens_token_classification1_idx` (`tcla_id` ASC) VISIBLE,
  CONSTRAINT `fk_tokens_token_classification1`
    FOREIGN KEY (`tcla_id`)
    REFERENCES `Sentinel`.`token_classification` (`tcla_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Sentinel`.`transaction_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`transaction_data` (
  `tx_chain_id` INT NOT NULL,
  `tx_block_number` INT NOT NULL,
  `tx_index` INT NOT NULL,
  `token_id` BIGINT NOT NULL,
  `amount` DECIMAL(65,0) NULL,
  INDEX `fk_transaction_data_transactions1_idx` (`tx_chain_id` ASC, `tx_block_number` ASC, `tx_index` ASC) VISIBLE,
  INDEX `fk_transaction_data_tokens1_idx` (`token_id` ASC) VISIBLE,
  PRIMARY KEY (`tx_chain_id`, `tx_block_number`, `tx_index`),
  CONSTRAINT `fk_transaction_data_transactions1`
    FOREIGN KEY (`tx_chain_id` , `tx_block_number` , `tx_index`)
    REFERENCES `Sentinel`.`transactions` (`chain_id` , `block_number` , `tx_index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_transaction_data_tokens1`
    FOREIGN KEY (`token_id`)
    REFERENCES `Sentinel`.`tokens` (`token_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Sentinel`.`balance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`balance` (
  `wallet_id` BIGINT NOT NULL,
  `token_id` BIGINT NOT NULL,
  `balance` DECIMAL(65,0) NULL,
  INDEX `fk_balance_wallets1_idx` (`wallet_id` ASC) VISIBLE,
  INDEX `fk_balance_tokens1_idx` (`token_id` ASC) VISIBLE,
  PRIMARY KEY (`wallet_id`, `token_id`),
  CONSTRAINT `fk_balance_wallets1`
    FOREIGN KEY (`wallet_id`)
    REFERENCES `Sentinel`.`wallets` (`wallet_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_balance_tokens1`
    FOREIGN KEY (`token_id`)
    REFERENCES `Sentinel`.`tokens` (`token_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Sentinel`.`wallet_classification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`wallet_classification` (
  `wcla_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL,
  `risk_level` ENUM('Positive', 'Neutral', 'Negative', 'Fraud') NULL DEFAULT 'Neutral',
  `description` VARCHAR(250) NULL,
  PRIMARY KEY (`wcla_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Sentinel`.`wallet_behavior`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sentinel`.`wallet_behavior` (
  `wallet_id` BIGINT NOT NULL,
  `wcla_id` INT NOT NULL,
  `score` INT NULL,
  `last_activity` DATE NULL,
  INDEX `fk_wallet_behavior_wallets1_idx` (`wallet_id` ASC) VISIBLE,
  INDEX `fk_wallet_behavior_wallet_classification1_idx` (`wcla_id` ASC) VISIBLE,
  PRIMARY KEY (`wallet_id`, `wcla_id`),
  CONSTRAINT `fk_wallet_behavior_wallets1`
    FOREIGN KEY (`wallet_id`)
    REFERENCES `Sentinel`.`wallets` (`wallet_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_wallet_behavior_wallet_classification1`
    FOREIGN KEY (`wcla_id`)
    REFERENCES `Sentinel`.`wallet_classification` (`wcla_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- negative token classification
insert into token_classification values (1,'Proxy transaction','Negative', 'Tornado Cash or Mixers – Any interaction with privacy mixers or proxy');
insert into token_classification values (2,'Proxy transaction','Negative', 'Tornado Cash or Mixers – Any interaction with privacy mixers or proxy');
insert into token_classification values (3,'Malicious Proxy Tokens','Negative','Tokens created by proxy contracts for scams (e.g., honeypots, rug pulls).	Wallets interacting with suspicious proxy contracts.');
insert into token_classification values (4,'Newly Launched Tokens (Pump & Dump)','Negative','Illiquid tokens or those with high volume in a short period, common in pump & dump schemes.	Holding large amounts may suggest involvement in such schemes.');
insert into token_classification values (5,'Known Scam Tokens','Fraud','Tokens identified as fraudulent (e.g., Squid Game Token, Fake USDT).	Wallets holding these tokens may have participated in scams.');
insert into token_classification values (6,'Suspicious Game/NFT Tokens','Negative','Tokens from blockchain games with a history of fraud or low-reputation NFTs.	Using NFTs or game tokens to obscure value transfers.');

-- positive token classification

insert into token_classification values (11,'KYC Protocol Tokens', 'Positive', 'Tokens from platforms requiring identity verification (e.g., USDC, Binance-Peg Tokens).	Wallets interacting with these tokens tend to be more regulated.');
insert into token_classification values (12,'Reputable DAO Tokens', 'Positive', 'Governance tokens from well-known DAOs (e.g., AAVE, UNI, MKR).	Participation in governance suggests involvement in legitimate projects.');
insert into token_classification values (13,'Regulated Stablecoins', 'Positive', 'Stablecoins with regulatory compliance (e.g., USDC, PAX, GUSD).	Indicates higher likelihood of regulatory compliance.');


-- wallet classification --  negative

replace into wallet_classification values (1,'Scam & Phishing Addresses','Fraud','Addresses flagged by services like Chainalysis, Scam Sniffer, or Etherscan warnings.');
replace into wallet_classification values (2,'Tornado Cash or Mixers','Fraud','Any interaction with privacy mixers (e.g., Tornado Cash, Railgun) raises red flags.');
insert into wallet_classification values (3,'High-Frequency Low-Value Transactions ','Negative',' Patterns resembling bot activity or wash trading.');
insert into wallet_classification values (4,'Fresh Wallet with Large Movements','Negative','Recently created wallets moving large sums without prior history can be suspicious.');
insert into wallet_classification values (5,'Connections to Blacklisted Wallets','Negative','Direct transactions with addresses sanctioned by the U.S. Treasury (OFAC list) or Interpol alerts.');
insert into wallet_classification values (6,'Ponzi & Rug Pull Contracts ','Negative',' Interaction with known fraudulent DeFi projects or NFT rug pulls.');
insert into wallet_classification values (7,'Flash Loan Exploits','Negative',' If the address frequently engages in flash loans with no clear arbitrage use case.');
insert into wallet_classification values (8,'Bridging from High-Risk Chains','Negative',' Funds coming from high-risk chains or obscure bridges often indicate potential illicit activity.');
insert into wallet_classification values (9,'Holding Mostly Illiquid or Dead Tokens','Negative','High balance but mostly consisting of worthless tokens could be fake airdrop tokens.');


-- wallet classification --  Positive

insert into wallet_classification values (20,'KYC Interaction','Positive','Interacted with KYC service');
insert into wallet_classification values (21,'Centralized Exchange (CEX) Wallets' ,'Positive', 'Addresses linked to exchanges like Binance, Coinbase, Kraken, and OKX indicate some level of KYC compliance.');
insert into wallet_classification values (22,'Regulated Custodians' ,'Positive', 'Entities like Fireblocks, Anchorage, or BitGo offer custody services and often enforce compliance.');
insert into wallet_classification values (23,'Audited Smart Contracts' ,'Neutral', 'Interaction with smart contracts that have undergone security audits by firms like CertiK, OpenZeppelin, or Trail of Bits.');
insert into wallet_classification values (24,'DAO & Governance Participation' ,'Positive', 'Addresses involved in reputable DAOs (e.g., MakerDAO, Aave governance) usually indicate legitimacy.');
insert into wallet_classification values (25,'Whitelisted Stablecoin Issuers' ,'Positive', 'Direct interactions with Circle (USDC), Tether (USDT Treasury), and Paxos (BUSD, USDP) can signal legitimacy.');
insert into wallet_classification values (26,'Institutional DeFi' ,'Positive', 'Interactions with Aave Arc or Compound Treasury, which enforce KYC for institutional users.');
insert into wallet_classification values (27,'ENS Name Ownership' ,'Positive', 'Users with Ethereum Name Service (ENS) names linked to their wallets (e.g., vitalik.eth) often belong to known identities.');
insert into wallet_classification values (28,'Long-Term Holding' ,'Neutral', 'Addresses with high balances and low transaction frequency often indicate legitimate, long-term holders.');
insert into wallet_classification values (29,'Participation in DeFi & Staking','Neutral','A large balance staked in protocols like Lido, Aave, Compound signals a committed DeFi participant.');
insert into wallet_classification values (30,'NFT Collectors & Creators','Neutral','Addresses interacting with NFT marketplaces like OpenSea, Rarible, or Foundation.');
insert into wallet_classification values (31,'DeFi Yield Farmers','Neutral','Addresses interacting with DeFi protocols like SushiSwap, Uniswap, or Curve.');
insert into wallet_classification values (32,'Liquidity Providers','Positive','Addresses providing liquidity to AMM pools like Uniswap, SushiSwap, or Curve.');

-- dune



ALTER TABLE `Sentinel`.`transactions` 
ADD COLUMN `timestamp` DATETIME NULL AFTER `hash`;