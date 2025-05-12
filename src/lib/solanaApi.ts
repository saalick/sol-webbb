
import { toast } from "sonner";
import { Connection, PublicKey, VersionedTransactionResponse, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

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

// Create a connection to Solana network
const getConnection = () => {
  // Using public RPC endpoints - for production use, consider using a dedicated RPC provider
  return new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
};

// Function to fetch wallet data
export async function fetchWalletData(walletAddress: string): Promise<WalletData> {
  try {
    // Check for valid Solana address
    if (!isValidSolanaAddress(walletAddress)) {
      throw new Error("Invalid Solana wallet address");
    }

    const connection = getConnection();
    const publicKey = new PublicKey(walletAddress);
    
    // Fetch wallet balance
    console.log("Fetching balance for:", walletAddress);
    const balance = await connection.getBalance(publicKey);
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    
    // Fetch recent transactions (signatures)
    console.log("Fetching transaction signatures");
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 15 });
    
    if (!signatures || signatures.length === 0) {
      return {
        address: walletAddress,
        balance: balanceInSol,
        transactions: []
      };
    }
    
    // Fetch transaction details for each signature
    console.log(`Found ${signatures.length} transactions, fetching details...`);
    const transactions: Transaction[] = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const txn = await connection.getTransaction(sig.signature);
          
          if (!txn) {
            throw new Error(`Transaction not found: ${sig.signature}`);
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

          return {
            signature: sig.signature,
            slot: txn.slot,
            timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            fee: txn.meta ? txn.meta.fee / LAMPORTS_PER_SOL : 0,
            status: "confirmed",
            blockhash: txn.transaction.message.recentBlockhash || "",
            fromAddress,
            toAddress: toAddress || "Unknown",
            amount
          };
        } catch (error) {
          console.error("Error fetching transaction:", sig.signature, error);
          
          // Return a partial transaction object when we can't fetch details
          return {
            signature: sig.signature,
            slot: sig.slot || 0,
            timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            fee: 0,
            status: "confirmed",
            blockhash: "",
            fromAddress: walletAddress,
            toAddress: "Unknown",
            amount: undefined
          };
        }
      })
    );
    
    return {
      address: walletAddress,
      balance: balanceInSol,
      transactions,
    };
  } catch (error: any) {
    console.error("Error fetching wallet data:", error);
    
    // If we hit API rate limits or other issues, fall back to mock data
    if (error.message?.includes("429") || error.message?.includes("403")) {
      toast.error("API rate limit exceeded, using mock data instead");
      return generateMockData(walletAddress);
    }
    
    toast.error(`Error: ${error.message}`);
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
  walletData.transactions.forEach((tx, index) => {
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
