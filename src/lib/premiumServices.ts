
import { toast } from "sonner";

// Interface for wallet token balances
export interface TokenBalance {
  symbol: string;
  amount: number;
  percentOfPortfolio: number;
  dollarValue?: number;
}

// Interface for smart contract interaction
export interface SmartContractInteraction {
  programName: string;
  programAddress: string;
  interactionCount: number;
  lastInteraction?: Date;
}

// Interface for historical transaction data point
export interface TransactionDataPoint {
  date: string;
  count: number;
  volume?: number;
}

// Interface for premium wallet data
export interface PremiumWalletData {
  tokenBalances: TokenBalance[];
  smartContractInteractions: SmartContractInteraction[];
  transactionHistory: TransactionDataPoint[];
  walletScore: {
    score: number;
    label: string;
    factors: {
      activityLevel: number;
      diversification: number;
      longevity: number;
      security: number;
    }
  };
}

/**
 * Fetches premium wallet data for a given address
 * In a real implementation, this would connect to a specialized API
 */
export async function fetchPremiumWalletData(address: string): Promise<PremiumWalletData> {
  // This would be replaced with actual API calls in a production environment
  console.log("Fetching premium data for:", address);
  
  // Simulate API call with timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock premium data
      const premiumData: PremiumWalletData = {
        tokenBalances: [
          { symbol: "SOL", amount: 12.45, percentOfPortfolio: 60, dollarValue: 1245 },
          { symbol: "USDC", amount: 500, percentOfPortfolio: 25, dollarValue: 500 },
          { symbol: "BONK", amount: 1500000, percentOfPortfolio: 7.5, dollarValue: 150 },
          { symbol: "JUP", amount: 250, percentOfPortfolio: 5, dollarValue: 100 },
          { symbol: "mSOL", amount: 0.5, percentOfPortfolio: 2.5, dollarValue: 50 }
        ],
        smartContractInteractions: [
          { programName: "Jupiter Aggregator", programAddress: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", interactionCount: 7, lastInteraction: new Date() },
          { programName: "Marinade.Finance", programAddress: "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD", interactionCount: 3, lastInteraction: new Date(Date.now() - 86400000 * 2) },
          { programName: "SPL Token Program", programAddress: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", interactionCount: 12, lastInteraction: new Date(Date.now() - 86400000) }
        ],
        transactionHistory: generateMockTransactionHistory(),
        walletScore: {
          score: 78,
          label: "Good",
          factors: {
            activityLevel: 82,
            diversification: 65,
            longevity: 71,
            security: 93
          }
        }
      };
      
      resolve(premiumData);
    }, 800);
  });
}

// Helper function to generate mock transaction history
function generateMockTransactionHistory(): TransactionDataPoint[] {
  const history: TransactionDataPoint[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random transaction count between 0 and 15
    const count = Math.floor(Math.random() * 16);
    
    // Random volume between 0 and count * 5 SOL
    const volume = count === 0 ? 0 : count * Math.random() * 5;
    
    history.push({
      date: date.toISOString().split('T')[0],
      count,
      volume
    });
  }
  
  return history;
}
