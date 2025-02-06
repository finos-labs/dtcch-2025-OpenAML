import { ChainConnector, ERC20_ABI } from "../lib/onchain";
import { ethers } from "ethers";
import { DBConnector } from "../lib/db";
import { getTokenId } from "../lib/utils";

const chain = new ChainConnector("mainnet");
const provider = chain.provider;

const walletAddress = "0x8C92d7E9E46f020E0e50Ab98a67C1A253dCfC648";

const ethAddress = "0x2eaa73bd0db20c64f53febea7b5f5e5bccc7fb8b";

const tokenAddressesList = [
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409", // FDUSD
  "0x514910771af9ca656af840dff83e8264ecf986ca", //  LINK
  "0x561Cf9121E89926c27FA1cfC78dFcC4C422937a4", //  SQUID
  "0x7A3D5d49D64E57DBd6FBB21dF7202bD3EE7A2253", //  Tornado
  "0x0f51bb10119727a7e5ea3538074fb341f56b09ad", //  DAO
  "0x5a98fcbea516cf06857215779fd812ca3bef1b32", // LIDO  
  "0xD533a949740bb3306d119CC777fa900bA034cd52", //  CRV DAO
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", //  AAVE
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // UNI  
  "0x45804880de22913dafe09f4980848ece6ecbaf78", //  PAX
  "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd", //  GUSD
  "0x695d38EB4e57E0f137e36df7c1f0f2635981246b", // MEMAI
];



// Initialize database connection
const db = new DBConnector();


async function getWalletBalance(address: string): Promise<number> {
  let balanceEth = 0;
  try {
    // Get balance in wei (smallest unit of ETH)
    const balanceWei = await provider.getBalance(address);

    // Convert balance from wei to ether
    //balanceEth = Number(ethers.formatEther(balanceWei));
    balanceEth = Number(balanceWei);


    //console.log(`Wallet Balance for ${address}: ${balanceEth} ETH`);
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
  }

  return balanceEth;
}


// Function to get token balances
async function getTokenBalances(wallet: string, tokens: string[]): Promise<any[]> {
  let balances = [];
  for (const tokenAddress of tokens) {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    try {
      const [balance, decimals, symbol, name] = await Promise.all([tokenContract.balanceOf(wallet), tokenContract.decimals(), tokenContract.symbol(), tokenContract.name()]);
      if (balance != 0) {
        //const formattedBalance = Number(ethers.formatUnits(balance, decimals));
        balances.push({ token:tokenAddress, balance: Number(balance) });
      }

    } catch (error) {
      console.error(`Error fetching data for token at ${tokenAddress}:`, error);
    }
  }
  return balances;
}

async function main() {

  const SQLSelect = "select wallet_address, wallet_id from wallets limit 100";
  const SQLInsert = "replace into balance (wallet_id, token_id, balance) values (?,?,?)";
  const [wallets] = await db.query(SQLSelect);
  for (const wallet of wallets) {
    const ethBalance = await getWalletBalance(wallet.wallet_address);
    const tokenBalances = await getTokenBalances(wallet.wallet_address, tokenAddressesList);
    if (ethBalance) tokenBalances.push({ token: ethAddress, balance: ethBalance });

    for (const tokenBalance of tokenBalances) {
      const balance = tokenBalance.balance;
      const tokenID = await getTokenId(tokenBalance.token);
      await db.query(SQLInsert, [wallet.wallet_id, tokenID, balance]);
    }
  }
}
// Fetch token balances
//getTokenBalances(walletAddress, tokenAddressesStableCoins);
//getTokenBalances(walletAddress, tokenAddressesList);

main().then(() => process.exit(0));