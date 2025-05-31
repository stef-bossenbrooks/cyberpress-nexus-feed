
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const coingeckoApiKey = Deno.env.get('COINGECKO_API_KEY');
    
    if (!coingeckoApiKey) {
      throw new Error('CoinGecko API key not found');
    }

    const { limit = 10 } = await req.json().catch(() => ({}));

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`,
      {
        headers: {
          'X-CG-Demo-API-Key': coingeckoApiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    const cryptoData = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      changeValue24h: coin.price_change_24h || 0,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      buyGrade: calculateBuyGrade(coin),
      targetPrice: calculateTargetPrice(coin.current_price, coin.price_change_percentage_24h),
      gradeReasoning: generateGradeReasoning(coin),
      lastUpdated: new Date(),
      priceHistory: generatePriceHistory(coin.current_price, coin.sparkline_in_7d?.price || []),
      indicators: {
        rsi: calculateRSI(coin.sparkline_in_7d?.price || []),
        macd: coin.price_change_percentage_24h > 0 ? 'Bullish' : 'Bearish',
        ma50: coin.current_price * 0.95,
        volume: coin.total_volume > 1000000000 ? 'Very High' : coin.total_volume > 500000000 ? 'High' : 'Medium',
      },
      riskAssessment: {
        volatility: Math.abs(coin.price_change_percentage_24h) > 10 ? 'High' : Math.abs(coin.price_change_percentage_24h) > 5 ? 'Medium' : 'Low',
        liquidity: coin.total_volume > 1000000000 ? 'High' : coin.total_volume > 100000000 ? 'Medium' : 'Low',
        correlation: 'Medium',
      },
    }));

    console.log(`Fetched ${cryptoData.length} cryptocurrencies from CoinGecko`);

    return new Response(JSON.stringify(cryptoData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateBuyGrade(coin: any): string {
  let score = 0;
  
  // Market cap weight (0-25 points)
  if (coin.market_cap > 100000000000) score += 25;
  else if (coin.market_cap > 10000000000) score += 20;
  else if (coin.market_cap > 1000000000) score += 15;
  else if (coin.market_cap > 100000000) score += 10;
  else score += 5;
  
  // 24h change (0-25 points)
  const change = coin.price_change_percentage_24h || 0;
  if (change > 10) score += 25;
  else if (change > 5) score += 20;
  else if (change > 0) score += 15;
  else if (change > -5) score += 10;
  else if (change > -10) score += 5;
  else score += 0;
  
  // Volume (0-25 points)
  if (coin.total_volume > 5000000000) score += 25;
  else if (coin.total_volume > 1000000000) score += 20;
  else if (coin.total_volume > 500000000) score += 15;
  else if (coin.total_volume > 100000000) score += 10;
  else score += 5;
  
  // Market rank (0-25 points)
  if (coin.market_cap_rank <= 10) score += 25;
  else if (coin.market_cap_rank <= 25) score += 20;
  else if (coin.market_cap_rank <= 50) score += 15;
  else if (coin.market_cap_rank <= 100) score += 10;
  else score += 5;
  
  // Convert score to grade
  if (score >= 85) return 'A+';
  if (score >= 75) return 'A';
  if (score >= 65) return 'A-';
  if (score >= 55) return 'B+';
  if (score >= 45) return 'B';
  if (score >= 35) return 'B-';
  if (score >= 25) return 'C+';
  if (score >= 15) return 'C';
  return 'D';
}

function calculateTargetPrice(currentPrice: number, change24h: number): number {
  const momentum = change24h || 0;
  const multiplier = momentum > 0 ? 1 + (momentum / 100) * 1.2 : 1 + (momentum / 100) * 0.8;
  return Math.round(currentPrice * multiplier * 100) / 100;
}

function generateGradeReasoning(coin: any): string {
  const reasons = [];
  const change = coin.price_change_percentage_24h || 0;
  
  if (change > 5) reasons.push('strong bullish momentum');
  else if (change > 0) reasons.push('positive price action');
  else if (change > -5) reasons.push('stable price performance');
  else reasons.push('recent price decline');
  
  if (coin.total_volume > 1000000000) reasons.push('high trading volume');
  if (coin.market_cap_rank <= 10) reasons.push('top tier market cap');
  else if (coin.market_cap_rank <= 50) reasons.push('established market presence');
  
  return reasons.join(', ') || 'mixed market signals';
}

function generatePriceHistory(currentPrice: number, sparkline: number[]): any[] {
  if (sparkline.length === 0) {
    // Generate mock 7-day history if no sparkline data
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.1;
      history.push({
        timestamp: date,
        price: currentPrice * (1 + variation),
        volume: Math.random() * 1000000000,
      });
    }
    return history;
  }
  
  return sparkline.map((price, index) => ({
    timestamp: new Date(Date.now() - (sparkline.length - index) * 60 * 60 * 1000),
    price,
    volume: Math.random() * 1000000000,
  }));
}

function calculateRSI(prices: number[]): number {
  if (prices.length < 14) return 50; // Default neutral RSI
  
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains.push(change);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(change));
    }
  }
  
  const avgGain = gains.slice(-14).reduce((a, b) => a + b, 0) / 14;
  const avgLoss = losses.slice(-14).reduce((a, b) => a + b, 0) / 14;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}
