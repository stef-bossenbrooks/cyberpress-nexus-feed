
import { CryptoData, PricePoint, CryptoNews } from '../types/CryptoData';
import { supabase } from '../integrations/supabase/client';

class CryptoService {
  async fetchTopCryptos(limit = 10): Promise<CryptoData[]> {
    try {
      console.log(`Fetching top ${limit} cryptocurrencies from CoinGecko API`);
      
      const { data, error } = await supabase.functions.invoke('fetch-crypto-data', {
        body: { limit }
      });

      if (error) {
        console.error('Crypto Edge function error:', error);
        return this.getFallbackCryptos();
      }

      console.log(`Fetched ${data.length} cryptocurrencies from CoinGecko`);
      return data || this.getFallbackCryptos();
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      return this.getFallbackCryptos();
    }
  }

  async fetchCryptoDetails(id: string): Promise<CryptoData | null> {
    const cryptos = await this.fetchTopCryptos();
    return cryptos.find(crypto => crypto.id === id) || null;
  }

  async fetchCryptoHistory(id: string, days: number): Promise<PricePoint[]> {
    try {
      // This would require additional API calls to get historical data
      return this.generateMockPriceHistory(67420.50, days);
    } catch (error) {
      console.error(`Failed to fetch history for ${id}:`, error);
      return [];
    }
  }

  async fetchCryptoNews(symbol: string): Promise<CryptoNews[]> {
    // Mock crypto news for now
    const mockNews: CryptoNews[] = [
      {
        title: `${symbol} ETF Sees Record Inflow`,
        summary: 'Institutional demand continues to drive adoption with largest single-day inflow recorded.',
        source: 'CoinDesk',
        time: '2 hours ago',
        url: 'https://example.com',
      },
      {
        title: `${symbol} Technical Analysis Update`,
        summary: 'Chart patterns suggest continued upward momentum with strong support levels.',
        source: 'The Block',
        time: '4 hours ago',
        url: 'https://example.com',
      },
      {
        title: `${symbol} DeFi Integration Milestone`,
        summary: 'Major DeFi protocol announces integration, expanding utility and use cases.',
        source: 'Decrypt',
        time: '6 hours ago',
        url: 'https://example.com',
      },
    ];

    return mockNews;
  }

  private getFallbackCryptos(): CryptoData[] {
    // Fallback data if API fails
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 67420.50,
        change24h: 2.4,
        changeValue24h: 1580.30,
        marketCap: 1320000000000,
        volume24h: 28000000000,
        buyGrade: 'B+',
        targetPrice: 72000,
        gradeReasoning: 'Strong institutional adoption with mild overbought signals',
        lastUpdated: new Date(),
        priceHistory: this.generateMockPriceHistory(67420.50),
        indicators: {
          rsi: 58.2,
          macd: 'Bullish',
          ma50: 63840,
          volume: 'High',
        },
        riskAssessment: {
          volatility: 'Medium',
          liquidity: 'High',
          correlation: 'Low',
        },
      }
    ];
  }

  private generateMockPriceHistory(currentPrice: number, days = 7): PricePoint[] {
    const points: PricePoint[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.1;
      const price = currentPrice * (1 + variation * (i / days));
      
      points.push({
        timestamp,
        price,
        volume: Math.random() * 1000000000,
      });
    }
    
    return points;
  }

  calculateBuyGrade(crypto: CryptoData): string {
    let score = 0;
    
    // RSI analysis
    if (crypto.indicators.rsi < 30) score += 20;
    else if (crypto.indicators.rsi < 50) score += 15;
    else if (crypto.indicators.rsi < 70) score += 10;
    else score += 5;
    
    // Price vs MA50
    if (crypto.price > crypto.indicators.ma50 * 1.1) score += 15;
    else if (crypto.price > crypto.indicators.ma50) score += 10;
    else score += 5;
    
    // Volume analysis
    if (crypto.indicators.volume === 'Very High') score += 15;
    else if (crypto.indicators.volume === 'High') score += 10;
    else score += 5;
    
    // 24h change
    if (crypto.change24h > 5) score += 10;
    else if (crypto.change24h > 0) score += 8;
    else if (crypto.change24h > -5) score += 5;
    else score += 2;
    
    // Convert score to grade
    if (score >= 55) return 'A+';
    if (score >= 50) return 'A';
    if (score >= 45) return 'A-';
    if (score >= 40) return 'B+';
    if (score >= 35) return 'B';
    if (score >= 30) return 'B-';
    if (score >= 25) return 'C+';
    if (score >= 20) return 'C';
    return 'D';
  }
}

export const cryptoService = new CryptoService();
