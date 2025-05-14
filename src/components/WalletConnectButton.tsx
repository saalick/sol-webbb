
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Badge, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface WalletConnectButtonProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  connected: boolean;
  walletAddress?: string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ 
  onConnect, 
  onDisconnect, 
  connected, 
  walletAddress 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Check if Phantom wallet is installed
      const provider = (window as any).solana;
      
      if (!provider) {
        toast.error("Phantom wallet not found. Please install it first.");
        window.open("https://phantom.app/", "_blank");
        return;
      }
      
      try {
        // Connect to the wallet
        const response = await provider.connect();
        const address = response.publicKey.toString();
        
        toast.success("Wallet connected successfully!");
        onConnect(address);
      } catch (err) {
        console.error("Connection error:", err);
        toast.error("Failed to connect wallet. Please try again.");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Error connecting to wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    try {
      const provider = (window as any).solana;
      if (provider && provider.disconnect) {
        provider.disconnect();
      }
      onDisconnect();
      toast.info("Wallet disconnected");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!connected ? (
        <Button 
          variant="outline" 
          className="border-solana hover:bg-solana/10 text-solana"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-solana/10 text-solana rounded-md">
            <Badge className="h-4 w-4" />
            <span className="text-xs font-medium">
              {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : ''}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDisconnect}
            className="text-muted-foreground hover:text-solana hover:bg-solana/10"
          >
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
