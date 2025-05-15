
import React, { useState } from 'react';
import { WalletData, NetworkData, NetworkNode, fetchWalletData, generateNetworkData } from '@/lib/solanaApi';
import WalletSearch from '@/components/WalletSearch';
import NetworkGraph from '@/components/NetworkGraph';
import TransactionDetail from '@/components/TransactionDetail';
import WalletSummary from '@/components/WalletSummary';
import PremiumFeatures from '@/components/PremiumFeatures';
import WalletConnectButton from '@/components/WalletConnectButton';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Index = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Wallet connection state
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  // Use our custom hook
  const { updateWalletData } = useWalletData();

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
      updateWalletData(data);
      
      const network = generateNetworkData(data);
      setNetworkData(network);
    } catch (error: any) {
      console.error("Search error:", error);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
      
      setWalletData(null);
      setNetworkData(null);
      updateWalletData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
  };

  const handleConnectWallet = (address: string) => {
    console.log("Wallet connected:", address);
    setConnectedWallet(address);
    toast.success(`Wallet authenticated for premium features`);
  };

  const handleDisconnectWallet = () => {
    console.log("Wallet disconnected");
    setConnectedWallet(null);
    toast.info("Wallet disconnected");
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Header with glassmorphism effect */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/70 border-b border-white/5 px-6 py-3">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <Logo />
            
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="https://x.com/solwebsolana" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/5"
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="sr-only">X (formerly Twitter)</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Follow on X (Twitter)</p>
                </TooltipContent>
              </Tooltip>
              
              <WalletConnectButton 
                onConnect={handleConnectWallet}
                onDisconnect={handleDisconnectWallet}
                connected={!!connectedWallet}
                walletAddress={connectedWallet || undefined}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="w-full px-6 py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="outline" className="mb-4 py-1 px-4 border-white/10 bg-white/5 backdrop-blur-sm">
              Solana Explorer
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-solana via-solana-accent to-solana-secondary">
                Visualize &amp; Analyze
              </span>
              <span className="text-foreground">Solana Wallet Networks</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore wallet connections and transaction flows with our interactive visualization tool
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto glass-panel p-1 backdrop-blur-md bg-black/20 border border-white/10 rounded-xl">
            <WalletSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <PremiumFeatures 
        isAuthenticated={!!connectedWallet} 
        walletAddress={connectedWallet || undefined}
      />

      {/* Main Content */}
      <main className="flex-1 w-full px-6 pb-24">
        <div className="container mx-auto max-w-7xl">
          {walletData && networkData ? (
            <div className="animate-fade-in space-y-8">
              <WalletSummary data={walletData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 glass-panel border border-white/10 rounded-xl p-4 backdrop-blur-md">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-solana rounded-full"></span>
                    Network Visualization
                  </h2>
                  <NetworkGraph 
                    data={networkData} 
                    onNodeClick={handleNodeClick}
                  />
                </div>
                <div className="glass-panel border border-white/10 rounded-xl p-4 backdrop-blur-md">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-solana-accent rounded-full"></span>
                    Transaction Details
                  </h2>
                  <TransactionDetail 
                    selectedNode={selectedNode} 
                    allTransactions={walletData.transactions}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 glass-panel mt-8 rounded-xl border border-white/10 backdrop-blur-md">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full bg-solana/10 animate-pulse-glow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
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
              </div>
              <h2 className="text-2xl font-medium text-foreground text-center">
                {error ? "Error loading wallet data" : "Enter a Solana wallet address"}
              </h2>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                {error ? error : "Discover wallet connections and transaction patterns"}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-white/5 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Logo />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} SolWeb</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
              <span>Built with React + TailwindCSS</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
              <span>Powered by Solana</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
