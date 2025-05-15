
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Transaction, NetworkNode, formatTimestamp, formatAddress } from '@/lib/solanaApi';
import { ExternalLink } from 'lucide-react';

interface TransactionDetailProps {
  selectedNode: NetworkNode | null;
  allTransactions: Transaction[];
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ selectedNode, allTransactions }) => {
  if (!selectedNode) {
    return (
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Select a node to view details</p>
        </CardContent>
      </Card>
    );
  }

  // Handle wallet node type
  if (selectedNode.type === 'wallet') {
    // Find related transactions
    const relatedTxs = allTransactions.filter(
      tx => tx.fromAddress === selectedNode.id || tx.toAddress === selectedNode.id
    ).slice(0, 5);

    return (
      <Card className="glass-panel">
        <CardHeader className="pb-2 border-b border-white/10">
          <CardTitle className="text-lg flex items-center">
            <div className="w-3 h-3 rounded-full bg-solana mr-2"></div>
            Wallet Address
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="font-mono text-sm break-all mb-3">
            <a 
              href={`https://solscan.io/account/${selectedNode.id}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-solana-accent transition-colors"
            >
              {selectedNode.id}
              <ExternalLink className="h-3 w-3 ml-1 inline" />
            </a>
          </div>
          {selectedNode.balance !== undefined && (
            <div className="bg-secondary p-3 rounded-lg mb-4">
              <div className="text-xs text-muted-foreground">Balance</div>
              <div className="text-lg font-semibold text-solana-accent">{selectedNode.balance.toFixed(4)} SOL</div>
            </div>
          )}
          
          {relatedTxs.length > 0 && (
            <>
              <div className="text-sm font-medium mb-2 mt-4">Recent Transactions</div>
              <div className="space-y-2">
                {relatedTxs.map(tx => (
                  <div key={tx.signature} className="bg-secondary/50 p-2 rounded text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {formatTimestamp(tx.timestamp)}
                      </span>
                      <span className={tx.fromAddress === selectedNode.id ? "text-red-400" : "text-green-400"}>
                        {tx.fromAddress === selectedNode.id ? "-" : "+"}{tx.amount?.toFixed(4)} SOL
                      </span>
                    </div>
                    <div className="font-mono mt-1 text-muted-foreground truncate">
                      <a 
                        href={`https://solscan.io/tx/${tx.signature}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-solana-accent transition-colors flex items-center"
                      >
                        {tx.signature.substring(0, 16)}...
                        <ExternalLink className="h-3 w-3 ml-1 inline" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Handle transaction node type
  const transaction = allTransactions.find(tx => tx.signature === selectedNode.id);
  
  if (!transaction) {
    return (
      <Card className="glass-panel">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Transaction data not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-2 border-b border-white/10">
        <CardTitle className="text-lg flex items-center">
          <div className="w-3 h-3 rounded-full bg-solana-accent mr-2"></div>
          Transaction Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <div className="text-xs text-muted-foreground">Signature</div>
          <div className="font-mono text-sm break-all">
            <a 
              href={`https://solscan.io/tx/${transaction.signature}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-solana-accent transition-colors"
            >
              {transaction.signature}
              <ExternalLink className="h-3 w-3 ml-1 inline" />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Timestamp</div>
            <div className="text-sm">{formatTimestamp(transaction.timestamp)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="text-sm capitalize">{transaction.status}</div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground">Amount</div>
          <div className="text-lg font-medium text-solana-accent">{transaction.amount?.toFixed(4)} SOL</div>
        </div>
        
        <div className="bg-secondary/50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">From</span>
            <span className="text-xs text-red-400">Sender</span>
          </div>
          <div className="font-mono text-sm break-all">
            <a 
              href={`https://solscan.io/account/${transaction.fromAddress}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-solana-accent transition-colors"
            >
              {formatAddress(transaction.fromAddress)}
              <ExternalLink className="h-3 w-3 ml-1 inline" />
            </a>
          </div>
        </div>
        
        <div className="bg-secondary/50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">To</span>
            <span className="text-xs text-green-400">Recipient</span>
          </div>
          <div className="font-mono text-sm break-all">
            <a 
              href={`https://solscan.io/account/${transaction.toAddress}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-solana-accent transition-colors"
            >
              {formatAddress(transaction.toAddress)}
              <ExternalLink className="h-3 w-3 ml-1 inline" />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Fee</div>
            <div className="text-sm">{transaction.fee.toFixed(6)} SOL</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Slot</div>
            <div className="text-sm">{transaction.slot.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetail;
