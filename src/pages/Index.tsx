
import React, { useState } from 'react';
import { WalletData, NetworkData, NetworkNode, fetchWalletData, generateNetworkData } from '@/lib/solanaApi';
import WalletSearch from '@/components/WalletSearch';
import NetworkGraph from '@/components/NetworkGraph';
import TransactionDetail from '@/components/TransactionDetail';
import WalletSummary from '@/components/WalletSummary';
import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';

const Index = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (address: string) => {
    setIsLoading(true);
    setSelectedNode(null);
    setError(null);
    
    try {
      const data = await fetchWalletData(address);
      
      if (data.transactions.length === 0) {
        toast.warning("No transactions found for this wallet");
      } else {
        toast.success(`Found ${data.transactions.length} transactions for this wallet`);
      }
      
      setWalletData(data);
      
      const network = generateNetworkData(data);
      setNetworkData(network);
    } catch (error: any) {
      console.error("Search error:", error);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
      
      setWalletData(null);
      setNetworkData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-background via-background to-black">
      {/* X Handle Banner */}
      <div className="w-full bg-secondary/80 px-4 py-1.5">
        <div className="container mx-auto max-w-7xl flex justify-center md:justify-end items-center">
          <a 
            href="https://twitter.com/SolVision" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Follow us on</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            <span className="font-semibold">@SolVision</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="w-full px-6 py-8 md:py-12">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-solana via-solana-accent to-solana-secondary bg-clip-text text-transparent">
              SolVision
            </h1>
            <p className="text-muted-foreground mt-2 text-center max-w-lg">
              Visualize and explore Solana wallet transactions in an interactive network graph
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <WalletSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 pb-12">
        <div className="container mx-auto max-w-7xl">
          {walletData && networkData ? (
            <div className="animate-fade-in space-y-6">
              <WalletSummary data={walletData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="col-span-1 lg:col-span-3">
                  <NetworkGraph 
                    data={networkData} 
                    onNodeClick={handleNodeClick}
                  />
                </div>
                <div className="col-span-1">
                  <TransactionDetail 
                    selectedNode={selectedNode} 
                    allTransactions={walletData.transactions}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 glass-panel mt-8 rounded-xl">
              <div className="w-24 h-24 mb-4 p-4 rounded-full bg-solana/20 flex items-center justify-center animate-pulse-glow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397.7 311.7" className="w-12 h-12">
                  <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936">
                    <stop offset="0" stopColor="#00FFA3"/>
                    <stop offset="1" stopColor="#DC1FFF"/>
                  </linearGradient>
                  <path fill="url(#SVGID_1_)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                  <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163" y2="-19.1475">
                    <stop offset="0" stopColor="#00FFA3"/>
                    <stop offset="1" stopColor="#DC1FFF"/>
                  </linearGradient>
                  <path fill="url(#SVGID_2_)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                  <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061">
                    <stop offset="0" stopColor="#00FFA3"/>
                    <stop offset="1" stopColor="#DC1FFF"/>
                  </linearGradient>
                  <path fill="url(#SVGID_3_)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
                    c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-muted-foreground text-center">
                {error ? "Error loading wallet data" : "Enter a Solana wallet address to visualize its transactions"}
              </h2>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                {error ? error : "See wallet connections and transaction flows in an interactive network graph"}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full px-6 py-6 border-t border-white/5">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-solana font-bold mr-2">SolVision</span>
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Built with React + TailwindCSS • Powered by Solana
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
