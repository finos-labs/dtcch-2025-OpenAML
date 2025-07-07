import { ethers } from "ethers"; // Import ethers to work with Ethereum contracts
import { PK , ALCHEMY_KEY} from "./secrets";


/*
  * ChainConnector class
  * 
  * This class is used to connect to a chain and interact with the contract
  * 
  * @param chainName: ChainName - Name of the chain to connect to
  * @param contractAddress: string - Address of the contract to connect to - not required
  * @param contractABI: any - ABI of the contract to connect to - not required
  * 
  * @returns ChainConnector
  * 
  * available objetcs:
  * wallet: ethers.Wallet - Wallet object to interact with the chain
  * contract: ethers.Contract - Contract object to interact with the contract
  */
export class ChainConnector {
  
  // Declare the contract, wallet and provider objects
  public contract: ethers.Contract;
  public wallet: ethers.Wallet;
  public provider: ethers.JsonRpcProvider;
  
  constructor(chainName:ChainName, contractAddress:string = "", contractABI:any = "") {   

    // Set the provider URL based on the chain name
    let API_URL:string|undefined = providerList[chainName];  
    if (!API_URL) throw new Error("Chain not found");
    
    // Create the provider, wallet and contract objects
    this.provider = new ethers.JsonRpcProvider(API_URL);
    this.wallet = new ethers.Wallet(PK, this.provider);

    // If contract address or ABI are not provided, skip contract creation
    if (!contractAddress || !contractABI) {
        // initialize the contract object empty
        this.contract = new ethers.Contract( this.wallet, [], this.wallet);
        return;
    }
    // Convert the ABI to Interface object
    const convertedAbi = new ethers.Interface(contractABI);

    // Create the contract object
    this.contract = new ethers.Contract(contractAddress, convertedAbi, this.wallet);
  }
    
}


// Chain list
export type ChainName = "mainnet" | "sepolia" |  "localhost" ;

export const providerList: { [key: string]: string } = {
    mainnet: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    sepolia: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    localhost: 'http://localhost:8545',
  };

export const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
  ];