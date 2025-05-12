
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { isValidSolanaAddress } from '@/lib/solanaApi';
import { Search } from "lucide-react";

interface WalletSearchProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
}

const WalletSearch: React.FC<WalletSearchProps> = ({ onSearch, isLoading }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWalletAddress(value);
    setIsValid(value === '' || isValidSolanaAddress(value));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress && isValidSolanaAddress(walletAddress)) {
      onSearch(walletAddress);
    } else {
      setIsValid(false);
    }
  };

  // Demo wallet addresses for easy testing
  const demoAddresses = [
    'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg',
    '6NpdXrQEpmJgGJ7SZjMKBJWEUyVgvHr8EZXmLJGZds9K',
  ];

  const useDemoAddress = (address: string) => {
    setWalletAddress(address);
    setIsValid(true);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input
          value={walletAddress}
          onChange={handleInputChange}
          placeholder="Enter Solana wallet address"
          className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !walletAddress} 
          className="bg-solana hover:bg-solana/80"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading
            </div>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> Search
            </>
          )}
        </Button>
      </form>
      
      {!isValid && (
        <div className="text-red-500 text-sm">Please enter a valid Solana wallet address</div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-2">
        <span className="text-muted-foreground">Or try demo address:</span>
        <div className="flex flex-wrap gap-2">
          {demoAddresses.map((address, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => useDemoAddress(address)}
              disabled={isLoading}
            >
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletSearch;
