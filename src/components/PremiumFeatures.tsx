
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, TrendingUp, Star, Diamond } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumFeaturesProps {
  isAuthenticated: boolean;
  walletAddress?: string;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ 
  isAuthenticated,
  walletAddress
}) => {
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Premium content for authenticated users
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <TopTokensCard />
          <WalletScoreCard walletAddress={walletAddress} />
          <SmartAlertsCard />
        </div>
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

// Premium cards components
const TopTokensCard = () => (
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
        {['SOL', 'USDC', 'BONK'].map((token, i) => (
          <div key={token} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-solana/10 flex items-center justify-center">
                {token.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{token}</div>
                <div className="text-xs text-muted-foreground">
                  {['Native', 'SPL Token', 'Meme Token'][i]}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {['65%', '23%', '12%'][i]}
              </div>
              <div className="text-xs text-muted-foreground">
                of volume
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const WalletScoreCard = ({ walletAddress }) => (
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
              clip: 'rect(0px, 112px, 112px, 56px)' 
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">78</span>
          </div>
        </div>
        <div className="text-center">
          <h4 className="font-medium">Good</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'your wallet'}
          </p>
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

export default PremiumFeatures;
