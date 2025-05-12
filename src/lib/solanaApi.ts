
import { toast } from "sonner";

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
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

// Function to fetch wallet data
export async function fetchWalletData(walletAddress: string): Promise<WalletData> {
  try {
    // Check for valid Solana address
    if (!isValidSolanaAddress(walletAddress)) {
      throw new Error("Invalid Solana wallet address");
    }

    // First, get the balance of the wallet
    const balanceResponse = await fetch(
      `https://api.mainnet-beta.solana.com`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [walletAddress]
        })
      }
    );

    const balanceData = await balanceResponse.json();
    
    if (balanceData.error) {
      throw new Error(`Error fetching balance: ${balanceData.error.message}`);
    }
    
    const balance = balanceData.result?.value / 10 ** 9 || 0;
    
    // Next, get transaction history
    const signaturesResponse = await fetch(
      `https://api.mainnet-beta.solana.com`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSignaturesForAddress",
          params: [walletAddress, { limit: 20 }]
        })
      }
    );

    const signaturesData = await signaturesResponse.json();
    
    if (signaturesData.error) {
      throw new Error(`Error fetching signatures: ${signaturesData.error.message}`);
    }

    const signatures = signaturesData.result || [];
    
    // Process each signature to get transaction details
    const transactions: Transaction[] = await Promise.all(
      signatures.map(async (sig: any) => {
        // For demo purposes, we're generating some data as fetching transaction details
        // would require more complex RPC calls for each transaction
        const toAddress = getRandomAddress(walletAddress);
        const amount = Math.random() * 5; // Random SOL amount
        
        return {
          signature: sig.signature,
          slot: sig.slot,
          timestamp: sig.blockTime * 1000,
          fee: Math.random() * 0.000005, // Random fee in SOL
          status: "confirmed" as const,
          blockhash: `${Math.random().toString(16).substring(2, 10)}...`,
          fromAddress: Math.random() > 0.5 ? walletAddress : getRandomAddress(walletAddress),
          toAddress: Math.random() > 0.5 ? walletAddress : toAddress,
          amount,
        };
      })
    );

    return {
      address: walletAddress,
      balance,
      transactions,
    };
  } catch (error: any) {
    toast.error(`Error: ${error.message}`);
    console.error("Error fetching wallet data:", error);
    throw error;
  }
}

// Helper function to get random addresses for demo
function getRandomAddress(excludeAddress: string): string {
  const addresses = [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "So11111111111111111111111111111111111111112",
    "6NpdXrQEpmJgGJ7SZjMKBJWEUyVgvHr8EZXmLJGZds9K",
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
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
