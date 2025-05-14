
import { useState, useEffect } from 'react';
import { WalletData } from '@/lib/solanaApi';
import { PremiumWalletData, fetchPremiumWalletData } from '@/lib/premiumServices';

export function useWalletData() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [premiumData, setPremiumData] = useState<PremiumWalletData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPremiumLoading, setIsPremiumLoading] = useState<boolean>(false);

  // Function to update the wallet data when a new wallet is scanned
  const updateWalletData = (data: WalletData | null) => {
    setWalletData(data);
  };

  // Function to fetch premium data for a wallet address
  const fetchPremiumData = async (address: string) => {
    if (!address) return;
    
    setIsPremiumLoading(true);
    try {
      const data = await fetchPremiumWalletData(address);
      setPremiumData(data);
    } catch (error) {
      console.error("Error fetching premium data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch premium data");
    } finally {
      setIsPremiumLoading(false);
    }
  };

  return {
    walletData,
    updateWalletData,
    premiumData,
    fetchPremiumData,
    isPremiumLoading,
    error,
    isLoading
  };
}
