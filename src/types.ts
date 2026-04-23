/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MarketType = 'US' | 'GSE' | 'ETF';

export interface Holding {
  id: string;
  ticker: string;
  marketType: MarketType;
  shares: number;
  averageCost: number;
  currentPrice: number;
  dailyChangePercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  oneDayChangeAmount: number;
  oneDayChangePercent: number;
  totalReturnAmount: number;
  totalReturnPercent: number;
}
