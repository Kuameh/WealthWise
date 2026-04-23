/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Holding } from "@/src/types";
import { motion } from "motion/react";

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const getMarketBadge = (market: Holding['marketType']) => {
    switch (market) {
      case 'US':
        return <span className="market-badge bg-blue-500/10 text-blue-400 border border-blue-500/20">US Stock</span>;
      case 'GSE':
        return <span className="market-badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">GSE</span>;
      case 'ETF':
        return <span className="market-badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">US ETF</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden"
    >
      <Table>
        <TableHeader className="bg-zinc-900/50 border-b border-zinc-800">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="px-6 py-4 font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">Symbol</TableHead>
            <TableHead className="px-6 py-4 font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">Market</TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">Shares</TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">Avg Cost</TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">Price</TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">Total Value</TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">1D Chg %</TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-[10px] uppercase tracking-[0.08em] text-zinc-400">Total Return</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-zinc-800">
          {holdings.map((holding) => {
            const totalValue = holding.shares * holding.currentPrice;
            const totalCost = holding.shares * holding.averageCost;
            const totalReturn = totalValue - totalCost;
            const totalReturnPercent = (totalReturn / totalCost) * 100;

            return (
              <TableRow key={holding.id} className="border-none hover:bg-zinc-800/20 transition-colors group">
                <TableCell className="px-6 py-4 font-bold text-sm">{holding.ticker}</TableCell>
                <TableCell className="px-6 py-4">{getMarketBadge(holding.marketType)}</TableCell>
                <TableCell className="px-6 py-4 text-right font-mono text-xs text-zinc-300">{holding.shares.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="px-6 py-4 text-right font-mono text-xs text-zinc-400">${holding.averageCost.toFixed(2)}</TableCell>
                <TableCell className="px-6 py-4 text-right font-bold font-mono text-xs text-white">${holding.currentPrice.toFixed(2)}</TableCell>
                <TableCell className="px-6 py-4 text-right font-semibold text-sm">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className={`px-6 py-4 text-right font-semibold text-xs ${holding.dailyChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {holding.dailyChangePercent >= 0 ? "+" : ""}{holding.dailyChangePercent.toFixed(2)}%
                </TableCell>
                <TableCell className={`px-6 py-4 text-right font-semibold text-sm ${totalReturn >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  <div className="flex flex-col items-end">
                    <span>{totalReturn >= 0 ? "+" : ""}${Math.abs(totalReturn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-[10px] opacity-70 font-medium font-mono">{totalReturnPercent >= 0 ? "+" : ""}{totalReturnPercent.toFixed(2)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {holdings.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-48 text-center text-zinc-500 text-xs font-medium uppercase tracking-widest">
                Portfolio Empty
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
