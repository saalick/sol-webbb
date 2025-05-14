
import { useState, useEffect, useCallback } from 'react';
import { WalletData } from '@/lib/solanaApi';
import { PremiumWalletData, fetchPremiumWalletData } from '@/lib/premiumServices';
import { toast } from 'sonner';

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
  // Using useCallback to avoid recreation of this function on every render
  const fetchPremiumData = useCallback(async (address: string) => {
    if (!address) {
      console.log("No wallet address provided for premium data");
      return;
    }
    
    console.log("Fetching premium data for address:", address);
    setIsPremiumLoading(true);
    setError(null);
    
    try {
      const data = await fetchPremiumWalletData(address);
      console.log("Premium data received:", data);
      setPremiumData(data);
      toast.success("Premium data loaded successfully");
    } catch (error) {
      console.error("Error fetching premium data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch premium data");
      toast.error("Failed to load premium data");
      setPremiumData(null);
    } finally {
      setIsPremiumLoading(false);
    }
  }, []);

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
