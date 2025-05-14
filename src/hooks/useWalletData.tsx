
import { useState, useEffect } from 'react';
import { WalletData } from '@/lib/solanaApi';

export function useWalletData() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to update the wallet data when a new wallet is scanned
  const updateWalletData = (data: WalletData | null) => {
    setWalletData(data);
  };

  return {
    walletData,
    updateWalletData,
    error,
    isLoading
  };
}
