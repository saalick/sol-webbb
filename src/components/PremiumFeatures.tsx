
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, TrendingUp, Star, Diamond, BadgeDollarSign, BadgePercent, ChartBar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWalletData } from '@/hooks/useWalletData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

interface PremiumFeaturesProps {
  isAuthenticated: boolean;
  walletAddress?: string;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ 
  isAuthenticated,
  walletAddress
}) => {
  const { premiumData, fetchPremiumData, isPremiumLoading } = useWalletData();
  
  useEffect(() => {
    if (isAuthenticated && walletAddress) {
      console.log("PremiumFeatures: Authenticated and wallet address available, fetching premium data");
      fetchPremiumData(walletAddress);
    } else {
      console.log("PremiumFeatures: Not authenticated or no wallet address", { isAuthenticated, walletAddress });
    }
  }, [isAuthenticated, walletAddress, fetchPremiumData]);
  
  console.log("PremiumFeatures rendering state:", { 
    isAuthenticated, 
    walletAddress, 
    isPremiumLoading, 
    hasPremiumData: !!premiumData 
  });
  
  if (!isAuthenticated) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto max-w-7xl">
          <Card className="border-dashed border-white/10 bg-black/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <Diamond className="h-5 w-5 text-solana" />
                  Premium Analytics
                </CardTitle>
                <CardDescription>
                  Connect your wallet to unlock exclusive Solana insights
                </CardDescription>
              </div>
              <Lock className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 opacity-70">
                {/* Original features */}
                <FeatureCard
                  title="Top Token Activity"
                  description="Track the most traded tokens in your wallet"
                  icon={<TrendingUp className="h-6 w-6" />}
                  locked
                />
                <FeatureCard
                  title="Wallet Score"
                  description="Get your wallet activity and health score"
                  icon={<Star className="h-6 w-6" />}
                  locked
                />
                <FeatureCard
                  title="Smart Alerts"
                  description="Set up notifications for important wallet events"
                  icon={<Diamond className="h-6 w-6" />}
                  locked
                />
                
                {/* New premium features */}
                <FeatureCard
                  title="Transaction History"
                  description="Advanced visualization of transaction patterns"
                  icon={<ChartBar className="h-6 w-6" />}
                  locked
                />
                <FeatureCard
                  title="Smart Contract Insights"
                  description="Review recent smart contract interactions"
                  icon={<BadgeDollarSign className="h-6 w-6" />}
                  locked
                />
                <FeatureCard
                  title="Portfolio Analysis"
                  description="Get detailed token diversification metrics"
                  icon={<BadgePercent className="h-6 w-6" />}
                  locked
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isPremiumLoading) {
    return (
      <div className="w-full py-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-solana border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading premium data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Premium content for authenticated users with real data
  return (
    <div className="w-full py-8 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Diamond className="h-5 w-5 text-solana" />
              Premium Analytics
            </h2>
            <p className="text-muted-foreground">
              Exclusive insights for your Solana wallet
            </p>
          </div>
        </div>

        {premiumData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-6">
              <TopTokensCard tokenBalances={premiumData.tokenBalances} />
              <WalletScoreCard 
                walletAddress={walletAddress} 
                walletScore={premiumData.walletScore} 
              />
              <SmartAlertsCard />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <TransactionHistoryCard 
                walletAddress={walletAddress} 
                transactionHistory={premiumData.transactionHistory}
              />
              <SmartContractCard 
                walletAddress={walletAddress} 
                contractInteractions={premiumData.smartContractInteractions}
              />
              <PortfolioAnalysisCard 
                walletAddress={walletAddress} 
                tokenBalances={premiumData.tokenBalances}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No premium data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Feature card component for locked state
const FeatureCard = ({ title, description, icon, locked = false }) => (
  <div className={cn(
    "relative rounded-xl border border-white/5 bg-black/20 p-6",
    locked && "overflow-hidden"
  )}>
    <div className="flex items-center gap-4 mb-3">
      <div className="p-2 rounded-full bg-solana/10 text-solana">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground">
      {description}
    </p>
    
    {locked && (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <Lock className="h-8 w-8 text-muted-foreground" />
      </div>
    )}
  </div>
);

// Premium cards with REAL data
const TopTokensCard = ({ tokenBalances }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-solana" />
        Top Token Activity
      </CardTitle>
      <CardDescription>Most active tokens in your wallet</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {tokenBalances.slice(0, 3).map((token, i) => (
          <div key={token.symbol} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-solana/10 flex items-center justify-center">
                {token.symbol.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  {token.amount.toFixed(token.symbol === 'BONK' ? 0 : 2)} {token.symbol}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {token.percentOfPortfolio}%
              </div>
              <div className="text-xs text-muted-foreground">
                ${token.dollarValue?.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const WalletScoreCard = ({ walletAddress, walletScore }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Star className="h-4 w-4 text-solana" />
        Wallet Health Score
      </CardTitle>
      <CardDescription>Based on activity and diversity</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-28 h-28 mb-4">
          <div className="absolute inset-0 rounded-full border-8 border-solana/30"></div>
          <div 
            className="absolute inset-0 rounded-full border-8 border-solana"
            style={{ 
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              clip: `rect(0px, ${112 * (walletScore.score / 100)}px, 112px, 56px)`
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{walletScore.score}</span>
          </div>
        </div>
        <div className="text-center">
          <h4 className="font-medium">{walletScore.label}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'your wallet'}
          </p>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 w-full text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-solana rounded-full mr-2"></div>
            <span className="text-muted-foreground">Activity:</span>
            <span className="ml-1 font-medium">{walletScore.factors.activityLevel}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-solana-accent rounded-full mr-2"></div>
            <span className="text-muted-foreground">Diversity:</span>
            <span className="ml-1 font-medium">{walletScore.factors.diversification}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-solana-secondary rounded-full mr-2"></div>
            <span className="text-muted-foreground">Longevity:</span>
            <span className="ml-1 font-medium">{walletScore.factors.longevity}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-muted-foreground">Security:</span>
            <span className="ml-1 font-medium">{walletScore.factors.security}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SmartAlertsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Diamond className="h-4 w-4 text-solana" />
        Smart Alerts
      </CardTitle>
      <CardDescription>Get notified of important events</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { name: 'Large transfers', enabled: true },
          { name: 'New connections', enabled: false },
          { name: 'Price alerts', enabled: true },
        ].map((alert, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${alert.enabled ? 'bg-solana' : 'bg-muted'}`}></div>
              <span>{alert.name}</span>
            </div>
            <Button 
              variant={alert.enabled ? "default" : "outline"} 
              size="sm"
              className={alert.enabled ? "bg-solana hover:bg-solana/90" : ""}
            >
              {alert.enabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Updated premium feature components with real data
const TransactionHistoryCard = ({ walletAddress, transactionHistory }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <ChartBar className="h-4 w-4 text-solana" />
        Transaction History
      </CardTitle>
      <CardDescription>
        Activity pattern over the last 30 days
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={transactionHistory}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9945FF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9945FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={false}
              axisLine={false}
            />
            <YAxis hide={true} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: 'none',
                borderRadius: '4px',
                color: 'white'
              }}
              formatter={(value, name) => [value, name === 'count' ? 'Transactions' : 'Volume']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#9945FF" 
              fillOpacity={1} 
              fill="url(#colorCount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-center text-muted-foreground">
        {walletAddress ? (
          <p>Total of {transactionHistory.reduce((sum, day) => sum + day.count, 0)} transactions</p>
        ) : (
          <p>Connect wallet to see your detailed transaction history</p>
        )}
      </div>
    </CardContent>
  </Card>
);

const SmartContractCard = ({ walletAddress, contractInteractions }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <BadgeDollarSign className="h-4 w-4 text-solana" />
        Smart Contract Activity
      </CardTitle>
      <CardDescription>
        Recent program interactions
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {contractInteractions.map((program, i) => (
          <div key={i} className="flex flex-col p-2 rounded-md bg-secondary/30">
            <div className="flex items-center justify-between">
              <div className="font-medium">{program.programName}</div>
              <div className="text-sm font-medium">
                {program.interactionCount} interactions
              </div>
            </div>
            <div className="text-xs text-muted-foreground">{program.programAddress.substring(0, 10)}...{program.programAddress.substring(program.programAddress.length - 4)}</div>
            {program.lastInteraction && (
              <div className="text-xs text-muted-foreground mt-1">
                Last used: {formatDistanceToNow(new Date(program.lastInteraction), { addSuffix: true })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-center text-muted-foreground">
        Data from last 30 days of wallet activity
      </div>
    </CardContent>
  </Card>
);

const PortfolioAnalysisCard = ({ walletAddress, tokenBalances }) => {
  // Generate dynamic conic gradient for chart
  const generateConicGradient = () => {
    let gradient = '';
    let startPoint = 0;
    
    tokenBalances.forEach((token, index) => {
      const colors = ['#9945FF', '#03E1FF', '#14F195', '#fa6d1d', '#d83aeb'];
      const endPoint = startPoint + token.percentOfPortfolio;
      gradient += `${colors[index % colors.length]} ${startPoint}% ${endPoint}%, `;
      startPoint = endPoint;
    });
    
    return `conic-gradient(${gradient.slice(0, -2)})`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BadgePercent className="h-4 w-4 text-solana" />
          Portfolio Diversification
        </CardTitle>
        <CardDescription>
          Token allocation breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-36 w-36 mx-auto my-2">
          <div className="absolute inset-0 rounded-full border-8 border-solana/20"></div>
          <div className="absolute inset-0 rounded-full" style={{ 
            background: generateConicGradient()
          }}></div>
          <div className="absolute inset-0 rounded-full m-3 bg-background flex items-center justify-center">
            <span className="text-sm font-medium">Tokens: {tokenBalances.length}</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {tokenBalances.slice(0, 4).map((token, index) => {
            const colors = ['#9945FF', '#03E1FF', '#14F195', '#fa6d1d', '#d83aeb'];
            return (
              <div key={token.symbol} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                  <span className="text-sm">{token.symbol}</span>
                </div>
                <span className="text-sm font-medium">{token.percentOfPortfolio}%</span>
              </div>
            );
          })}
          
          {tokenBalances.length > 4 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-sm">Others</span>
              </div>
              <span className="text-sm font-medium">
                {tokenBalances.slice(4).reduce((sum, token) => sum + token.percentOfPortfolio, 0)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;
