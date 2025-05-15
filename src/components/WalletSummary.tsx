
import React from 'react';
import { Card, CardContent } from './ui/card';
import { WalletData, formatAddress } from '@/lib/solanaApi';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

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
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-solana" />
            Wallet Overview
          </h2>
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="text-sm text-muted-foreground mt-1 cursor-help border-b border-dotted border-muted-foreground inline-flex">
                {formatAddress(data.address)}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Wallet Address</h4>
                  <p className="text-xs text-muted-foreground break-all">{data.address}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                      {data.transactions.length} Transactions
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                      Balance: {data.balance.toFixed(4)} SOL
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-solana">
            <AvatarFallback className="bg-solana/10 text-solana text-xs">
              {data.address.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{formatAddress(data.address)}</div>
            <div className="text-xs text-muted-foreground">
              Last activity: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="overflow-hidden border-0 glass-panel">
          <div className="h-1.5 bg-gradient-to-r from-solana/50 to-solana"></div>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <div className="text-3xl font-bold text-foreground">{data.balance.toFixed(4)}</div>
                <div className="text-sm text-muted-foreground">SOL</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 glass-panel">
          <div className="h-1.5 bg-gradient-to-r from-solana-accent/50 to-solana-accent"></div>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Received</h3>
                <ArrowDownRight className="h-4 w-4 text-green-500" />
              </div>
              <div className="mt-2">
                <div className="text-3xl font-bold text-foreground">{totalReceived.toFixed(4)}</div>
                <div className="text-sm text-muted-foreground">SOL in {incomingTxs.length} txs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 glass-panel">
          <div className="h-1.5 bg-gradient-to-r from-solana-secondary/50 to-solana-secondary"></div>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Sent</h3>
                <ArrowUpRight className="h-4 w-4 text-red-400" />
              </div>
              <div className="mt-2">
                <div className="text-3xl font-bold text-foreground">{totalSent.toFixed(4)}</div>
                <div className="text-sm text-muted-foreground">SOL in {outgoingTxs.length} txs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletSummary;
