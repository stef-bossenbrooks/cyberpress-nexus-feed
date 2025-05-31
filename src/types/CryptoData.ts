
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changeValue24h: number;
  marketCap: number;
  volume24h: number;
  buyGrade: string;
  targetPrice: number;
  gradeReasoning: string;
  lastUpdated: Date;
  priceHistory: PricePoint[];
  indicators: {
    rsi: number;
    macd: string;
    ma50: number;
    volume: string;
  };
  riskAssessment: {
    volatility: 'Low' | 'Medium' | 'High';
    liquidity: 'Low' | 'Medium' | 'High';
    correlation: 'Low' | 'Medium' | 'High';
  };
}

export interface PricePoint {
  timestamp: Date;
  price: number;
  volume?: number;
}

export interface CryptoNews {
  title: string;
  summary: string;
  source: string;
  time: string;
  url: string;
}
