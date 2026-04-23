/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { DashboardSummary } from "./components/DashboardSummary";
import { HoldingsTable } from "./components/HoldingsTable";
import { AddAssetModal } from "./components/AddAssetModal";
import { LoginPage } from "./components/LoginPage";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2, RefreshCw } from "lucide-react";
import { Holding, PortfolioSummary } from "./types";
import { PriceService } from "./PriceService";
import { Toaster, toast } from "sonner";

export default function App() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load Auth State
  useEffect(() => {
    const savedUser = localStorage.getItem("wealthwise_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Persistence to local storage for holdings
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`portfolio_holdings_${user.email}`);
      if (saved) {
        setHoldings(JSON.parse(saved));
      } else {
        setHoldings([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`portfolio_holdings_${user.email}`, JSON.stringify(holdings));
    }
  }, [holdings, user]);

  const summary = useMemo<PortfolioSummary>(() => {
    let totalValue = 0;
    let totalCost = 0;
    let totalDailyChange = 0;

    holdings.forEach(h => {
      const value = h.shares * h.currentPrice;
      const cost = h.shares * h.averageCost;
      const prevPrice = h.currentPrice / (1 + h.dailyChangePercent / 100);
      const prevValue = h.shares * prevPrice;
      
      totalValue += value;
      totalCost += cost;
      totalDailyChange += (value - prevValue);
    });

    const totalReturnAmount = totalValue - totalCost;
    const totalReturnPercent = totalCost > 0 ? (totalReturnAmount / totalCost) * 100 : 0;
    const oneDayChangePercent = (totalValue - totalDailyChange) > 0 
      ? (totalDailyChange / (totalValue - totalDailyChange)) * 100 
      : 0;

    return {
      totalValue,
      oneDayChangeAmount: totalDailyChange,
      oneDayChangePercent,
      totalReturnAmount,
      totalReturnPercent,
    };
  }, [holdings]);

  const handleLogin = () => {
    const fakeUser = { email: "demo@wealthwise.io" };
    localStorage.setItem("wealthwise_user", JSON.stringify(fakeUser));
    setUser(fakeUser);
    toast.success("Welcome to WealthWise!");
  };

  const handleLogout = () => {
    localStorage.removeItem("wealthwise_user");
    setUser(null);
    setHoldings([]);
  };

  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    const updatedHoldings = await Promise.all(holdings.map(async (h) => {
      const priceData = await PriceService.getPrice(h.ticker, h.marketType);
      return {
        ...h,
        currentPrice: priceData.price,
        dailyChangePercent: priceData.changePercent
      };
    }));
    setHoldings(updatedHoldings);
    setIsRefreshing(false);
    toast.success("Prices updated to latest market data");
  };

  const handleAddHolding = async (values: any) => {
    setLoading(true);
    try {
      const priceData = await PriceService.getPrice(values.ticker, values.marketType);
      
      const newHolding: Holding = {
        id: crypto.randomUUID(),
        ticker: values.ticker,
        marketType: values.marketType,
        shares: values.shares,
        averageCost: values.averageCost,
        currentPrice: priceData.price,
        dailyChangePercent: priceData.changePercent,
      };

      setHoldings(prev => [...prev, newHolding]);
    } catch (error) {
      console.error("Failed to add holding:", error);
      toast.error("Failed to fetch asset data");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="h-16 border-b border-border flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              WealthWise<span className="text-indigo-500 italic">.</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <Button size="sm" disabled className="gap-2 bg-indigo-600/50 text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing
              </Button>
            ) : (
              <AddAssetModal onAdd={handleAddHolding} />
            )}
            <div className="h-8 w-px bg-zinc-800 mx-2" />
            <Button size="sm" variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold">
              {user.email.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="p-8 flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full">
          {/* Summary Sections */}
          <section>
            <DashboardSummary summary={summary} />
          </section>

          {/* Holdings Table Section */}
          <section className="flex-1 flex flex-col glass-card">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-400">Your Holdings</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 text-xs border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-foreground"
                    onClick={handleRefreshPrices}
                    disabled={isRefreshing || holdings.length === 0}
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] h-8 text-zinc-500 hover:text-rose-400" 
                    onClick={() => {
                      if (confirm("Reset current portfolio?")) setHoldings([]);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <div className="bg-zinc-800/50 border border-zinc-700 rounded px-3 py-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-none flex items-center">
                  {holdings.length} Assets
                </div>
              </div>
            </div>
            <HoldingsTable holdings={holdings} />
          </section>

          {/* Market Status Bar */}
          <footer className="flex flex-wrap gap-6 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Feed Active
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Cloud Sync Enabled
            </div>
            <div className="ml-auto italic lowercase normal-case">
              Last data update: Just now
            </div>
          </footer>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}



