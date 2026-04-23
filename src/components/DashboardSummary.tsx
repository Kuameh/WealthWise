/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { motion } from "motion/react";

interface DashboardSummaryProps {
  summary: {
    totalValue: number;
    oneDayChangeAmount: number;
    oneDayChangePercent: number;
    totalReturnAmount: number;
    totalReturnPercent: number;
  };
}

export function DashboardSummary({ summary }: DashboardSummaryProps) {
  const isPositiveDay = summary.oneDayChangeAmount >= 0;
  const isPositiveTotal = summary.totalReturnAmount >= 0;

  const stats = [
    {
      title: "Total Portfolio Value",
      value: `$${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "Net worth in assets",
      color: "text-white",
      border: "",
      subColor: "text-zinc-500",
    },
    {
      title: "1-Day Change",
      value: `${isPositiveDay ? "+" : ""}$${Math.abs(summary.oneDayChangeAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: `${isPositiveDay ? "+" : ""}${summary.oneDayChangePercent.toFixed(2)}%`,
      color: isPositiveDay ? "text-emerald-500" : "text-rose-500",
      border: isPositiveDay ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-rose-500",
      subColor: isPositiveDay ? "text-emerald-500/80" : "text-rose-500/80",
    },
    {
      title: "Total All-Time Return",
      value: `${isPositiveTotal ? "+" : ""}$${Math.abs(summary.totalReturnAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: `${isPositiveTotal ? "+" : ""}${summary.totalReturnPercent.toFixed(2)}%`,
      color: isPositiveTotal ? "text-blue-400" : "text-rose-400",
      border: isPositiveTotal ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-rose-500",
      subColor: isPositiveTotal ? "text-blue-400/80" : "text-rose-400/80",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`glass-card p-6 ${stat.border}`}
        >
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.1em] mb-3">{stat.title}</p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-3xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</h2>
            <span className={`text-xs font-semibold ${stat.subColor}`}>{stat.description}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
