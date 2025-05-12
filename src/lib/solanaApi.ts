
import { toast } from "sonner";
import { Connection, PublicKey, VersionedTransactionResponse, LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface Transaction {
  signature: string;
  slot: number;
  timestamp: number;
  fee: number;
  status: "confirmed" | "finalized";
  blockhash: string;
  fromAddress: string;
  toAddress: string;
  amount?: number;
}

export interface WalletData {
  address: string;
  balance: number;
  transactions: Transaction[];
}

export interface NetworkNode {
  id: string;
  label: string;
  type: "wallet" | "transaction";
  balance?: number;
  value: number;
  color?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  signature?: string;
  timestamp?: number;
  amount?: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

// Function to validate a Solana address
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

// List of public RPC endpoints to try
const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://solana-mainnet.public.blastapi.io",
  "https://solana.public-rpc.com"
];

// Create a connection to Solana network with fallback
const getConnection = () => {
  // Try to use a random endpoint from the list to distribute load
  const endpoint = RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)];
  console.log(`Using Solana RPC endpoint: ${endpoint}`);
  return new Connection(endpoint, "confirmed");
};

// Function to fetch wallet data
export async function fetchWalletData(walletAddress: string): Promise<WalletData> {
  try {
    // Check for valid Solana address
    if (!isValidSolanaAddress(walletAddress)) {
      throw new Error("Invalid Solana wallet address");
    }
    
    // Try all endpoints until one works
    let balance = 0;
    let signatures: any[] = [];
    let success = false;
    const publicKey = new PublicKey(walletAddress);
    
    for (let i = 0; i < RPC_ENDPOINTS.length && !success; i++) {
      try {
        const endpoint = RPC_ENDPOINTS[i];
        console.log(`Attempt ${i+1}: Using Solana RPC endpoint: ${endpoint}`);
        const connection = new Connection(endpoint, "confirmed");
        
        // Fetch wallet balance
        console.log("Fetching balance for:", walletAddress);
        balance = await connection.getBalance(publicKey);
        
        // Fetch recent transactions (signatures)
        console.log("Fetching transaction signatures");
        signatures = await connection.getSignaturesForAddress(publicKey, { limit: 15 });
        
        success = true;
        console.log(`Successfully fetched data using endpoint: ${endpoint}`);
        break;
      } catch (error: any) {
        console.warn(`Failed to fetch data from endpoint ${i+1}:`, error.message);
        // Continue to next endpoint
      }
    }
    
    if (!success) {
      throw new Error("All RPC endpoints failed. Please try again later.");
    }
    
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    
    if (!signatures || signatures.length === 0) {
      return {
        address: walletAddress,
        balance: balanceInSol,
        transactions: []
      };
    }
    
    // Fetch transaction details for each signature
    console.log(`Found ${signatures.length} transactions, fetching details...`);
    const transactions: Transaction[] = [];
    
    for (const sig of signatures) {
      try {
        // Use the successful connection
        const endpoint = RPC_ENDPOINTS.find((_, index) => index === RPC_ENDPOINTS.length - 1);
        const connection = new Connection(endpoint!, "confirmed");
        
        const txn = await connection.getTransaction(sig.signature);
        
        if (!txn) {
          console.warn(`Transaction not found: ${sig.signature}`);
          continue;
        }
        
        // Extract basic transaction information
        let fromAddress = walletAddress;
        let toAddress = "";
        let amount: number | undefined = undefined;

        // Try to extract transaction participants
        if (txn.transaction && txn.transaction.message.accountKeys.length > 1) {
          const accountKeys = txn.transaction.message.accountKeys;
          
          // First account is typically the fee payer / sender
          fromAddress = accountKeys[0].toBase58();
          
          // Try to find receiver and amount (simplified, actual parsing would be more complex)
          if (txn.meta && txn.meta.postTokenBalances && txn.meta.postTokenBalances.length > 0) {
            // For token transfers
            toAddress = txn.meta.postTokenBalances[0].owner || "";
          } else if (accountKeys.length > 1) {
            // For SOL transfers, second account might be the receiver
            toAddress = accountKeys[1].toBase58();
          }
          
          // Try to extract amount from pre/post balances (simplified)
          if (txn.meta && txn.meta.preBalances && txn.meta.postBalances) {
            const preBalance = txn.meta.preBalances[0];
            const postBalance = txn.meta.postBalances[0];
            if (preBalance > postBalance) {
              amount = (preBalance - postBalance) / LAMPORTS_PER_SOL;
            }
          }
        }

        transactions.push({
          signature: sig.signature,
          slot: txn.slot,
          timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
          fee: txn.meta ? txn.meta.fee / LAMPORTS_PER_SOL : 0,
          status: "confirmed",
          blockhash: txn.transaction.message.recentBlockhash || "",
          fromAddress,
          toAddress: toAddress || "Unknown",
          amount
        });
      } catch (error) {
        console.error("Error fetching transaction:", sig.signature, error);
        // Skip failed transaction and continue with next one
      }
    }
    
    // Sort transactions by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);
    
    return {
      address: walletAddress,
      balance: balanceInSol,
      transactions,
    };
  } catch (error: any) {
    console.error("Error fetching wallet data:", error);
    
    // Fall back to mock data only if all RPC endpoints failed
    toast.error(`Error: ${error.message}`);
    if (error.message.includes("All RPC endpoints failed")) {
      toast.error("API endpoints unavailable, using mock data instead");
      return generateMockData(walletAddress);
    }
    
    throw error;
  }
}

// Helper function to generate mock data as fallback
function generateMockData(walletAddress: string): WalletData {
  console.log("Generating mock data for wallet:", walletAddress);
  
  // Mock balance (random between 1 and 50 SOL)
  const balance = 1 + Math.random() * 49;
  
  // Generate mock transactions (10-20 transactions)
  const transactionCount = 10 + Math.floor(Math.random() * 10);
  const transactions: Transaction[] = [];
  
  const now = Date.now();
  for (let i = 0; i < transactionCount; i++) {
    // Determine if this transaction is incoming or outgoing
    const isIncoming = Math.random() > 0.5;
    const fromAddress = isIncoming ? getRandomAddress(walletAddress) : walletAddress;
    const toAddress = isIncoming ? walletAddress : getRandomAddress(walletAddress);
    
    // Random amount between 0.1 and 10 SOL
    const amount = 0.1 + Math.random() * 9.9;
    
    // Transaction timestamp (within the last 30 days)
    const timestamp = now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    transactions.push({
      signature: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      slot: 100000000 + Math.floor(Math.random() * 10000000),
      timestamp,
      fee: Math.random() * 0.000005, // Random fee in SOL
      status: Math.random() > 0.2 ? "finalized" : "confirmed",
      blockhash: `${Math.random().toString(16).substring(2, 10)}...`,
      fromAddress,
      toAddress,
      amount,
    });
  }
  
  // Sort transactions by timestamp (newest first)
  transactions.sort((a, b) => b.timestamp - a.timestamp);

  return {
    address: walletAddress,
    balance,
    transactions,
  };
}

// Helper function to get random addresses for demo
function getRandomAddress(excludeAddress: string): string {
  const addresses = [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "So11111111111111111111111111111111111111112",
    "6NpdXrQEpmJgGJ7SZjMKBJWEUyVgvHr8EZXmLJGZds9K",
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
    "DW2Y3Zr5VPvrmc6eWNz4zkdjSvGJsMZ1vrKnvT9CqDQk",
    "BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4",
    "97e6KFp8jNbTR8WkufiFghh6CXcVczY8vmtfDAL9V9M6",
  ];
  
  const filteredAddresses = addresses.filter(addr => addr !== excludeAddress);
  const randomIndex = Math.floor(Math.random() * filteredAddresses.length);
  
  return filteredAddresses[randomIndex];
}

// Function to format wallet address for display
export function formatAddress(address: string): string {
  if (!address) return "";
  if (address.length <= 12) return address;
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Function to format timestamp
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

// Generate network data from wallet data
export function generateNetworkData(walletData: WalletData): NetworkData {
  const nodes: NetworkNode[] = [];
  const links: NetworkLink[] = [];
  const addressSet = new Set<string>();
  
  // Add the main wallet node
  addressSet.add(walletData.address);
  nodes.push({
    id: walletData.address,
    label: formatAddress(walletData.address),
    type: "wallet",
    balance: walletData.balance,
    value: 15, // Size for main wallet
    color: "#9945FF" // Solana purple
  });
  
  // Process transactions to create nodes and links
  walletData.transactions.forEach((tx) => {
    // Add transaction node
    const txId = tx.signature;
    nodes.push({
      id: txId,
      label: formatAddress(txId),
      type: "transaction",
      value: 10,
      color: "#14F195" // Solana green
    });
    
    // Add from address if not already added
    if (!addressSet.has(tx.fromAddress)) {
      addressSet.add(tx.fromAddress);
      nodes.push({
        id: tx.fromAddress,
        label: formatAddress(tx.fromAddress),
        type: "wallet",
        value: 8,
        color: "#03E1FF" // Solana blue
      });
    }
    
    // Add to address if not already added
    if (!addressSet.has(tx.toAddress)) {
      addressSet.add(tx.toAddress);
      nodes.push({
        id: tx.toAddress,
        label: formatAddress(tx.toAddress),
        type: "wallet",
        value: 8, 
        color: "#03E1FF" // Solana blue
      });
    }
    
    // Add links for the transaction flow
    links.push({
      source: tx.fromAddress,
      target: txId,
      value: 3,
      signature: tx.signature,
      timestamp: tx.timestamp,
      amount: tx.amount
    });
    
    links.push({
      source: txId,
      target: tx.toAddress,
      value: 3,
      signature: tx.signature,
      timestamp: tx.timestamp,
      amount: tx.amount
    });
  });
  
  return { nodes, links };
}
