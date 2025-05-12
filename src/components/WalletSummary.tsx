
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { WalletData, formatAddress } from '@/lib/solanaApi';

interface WalletSummaryProps {
  data: WalletData;
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ data }) => {
  // Calculate transaction stats
  const incomingTxs = data.transactions.filter(tx => tx.toAddress === data.address);
  const outgoingTxs = data.transactions.filter(tx => tx.fromAddress === data.address);
  
  const totalReceived = incomingTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalSent = outgoingTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="w-3 h-3 rounded-full bg-solana mr-2 animate-pulse-glow"></div>
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-solana">{data.balance.toFixed(4)}</div>
          <div className="text-sm text-muted-foreground">SOL</div>
        </CardContent>
      </Card>
      
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="w-3 h-3 rounded-full bg-solana-accent mr-2"></div>
            Total Received
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-solana-accent">{totalReceived.toFixed(4)}</div>
          <div className="text-sm text-muted-foreground">SOL (In {incomingTxs.length} transactions)</div>
        </CardContent>
      </Card>
      
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="w-3 h-3 rounded-full bg-solana-secondary mr-2"></div>
            Total Sent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-solana-secondary">{totalSent.toFixed(4)}</div>
          <div className="text-sm text-muted-foreground">SOL (In {outgoingTxs.length} transactions)</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletSummary;
