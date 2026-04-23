/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketType } from "./types";

interface PriceData {
  price: number;
  changePercent: number;
}

const GSE_MOCK_PRICES: Record<string, PriceData> = {
  "MTNGH": { price: 1.65, changePercent: 0.00 },
  "GCB": { price: 5.40, changePercent: 0.15 },
  "EGH": { price: 6.20, changePercent: -0.20 },
};

export class PriceService {
  /**
   * Fetches the current price for a given ticker.
   * In a real app, this would call an API like Finnhub or Yahoo Finance.
   */
  static async getPrice(ticker: string, market: MarketType): Promise<PriceData> {
    if (market === "GSE") {
      return GSE_MOCK_PRICES[ticker] || { price: 1.00, changePercent: 0.00 };
    }

    // Attempting to use a free public API (matching symbols to expected return format)
    // For the MVP, we'll simulate a fetch with stable random-ish data if API fails
    try {
      // In AI Studio environment, we'd typically use a server-side route for this
      // to avoid CORS and hide keys, but for a "Finnhub example":
      // const res = await fetch(`/api/price?symbol=${ticker}`);
      
      // Mocking US prices for the demo to ensure UI works immediately
      const mockPrices: Record<string, PriceData> = {
        "AAPL": { price: 185.30, changePercent: 1.25 },
        "VOO": { price: 482.15, changePercent: -0.45 },
        "MSFT": { price: 415.50, changePercent: 0.85 },
        "GOOGL": { price: 145.20, changePercent: -1.10 },
        "TSLA": { price: 175.40, changePercent: 2.30 },
      };

      return mockPrices[ticker] || { 
        price: Math.random() * 200 + 50, 
        changePercent: (Math.random() * 4 - 2) 
      };
    } catch (error) {
      console.error("Price fetch error:", error);
      return { price: 0, changePercent: 0 };
    }
  }
}
