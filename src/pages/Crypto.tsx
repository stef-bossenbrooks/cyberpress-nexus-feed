
import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Crypto = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('BTC');
  const [timeframe, setTimeframe] = useState('24h');

  // Get crypto data from context instead of hardcoded data
  const cryptoMap = state.cryptoData.reduce((acc, crypto) => {
    acc[crypto.symbol] = crypto;
    return acc;
  }, {} as Record<string, any>);

  // Default to first available crypto if activeTab doesn't exist
  const availableSymbols = Object.keys(cryptoMap);
  const currentSymbol = cryptoMap[activeTab] ? activeTab : availableSymbols[0] || 'BTC';
  const currentCrypto = cryptoMap[currentSymbol];

  // If no crypto data is available, show loading or fallback
  if (state.loading.cryptoData) {
    return (
      <div className="min-h-screen bg-background md:ml-64">
        <div className="p-6 md:p-8 pb-20 md:pb-8">
          <SectionHeader
            title="Crypto Analysis"
            subtitle="Loading live price data..."
            lastUpdated="Updating..."
          />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (state.cryptoData.length === 0) {
    return (
      <div className="min-h-screen bg-background md:ml-64">
        <div className="p-6 md:p-8 pb-20 md:pb-8">
          <SectionHeader
            title="Crypto Analysis"
            subtitle="No crypto data available"
            lastUpdated="Error loading data"
          />
          <div className="cyber-card p-8 rounded-lg text-center">
            <p className="text-gray-400 font-inter">
              Unable to load cryptocurrency data. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const timeframes = ['24h', '7d', '30d', 'YTD'];

  const newsItems = [
    {
      title: `${currentCrypto?.name || 'Bitcoin'} ETF Sees Record Inflow`,
      source: 'CoinDesk',
      time: '2 hours ago',
      summary: 'Institutional demand continues to drive adoption with largest single-day inflow recorded.'
    },
    {
      title: `${currentCrypto?.name || 'Ethereum'} Technical Analysis Update`,
      source: 'The Block',
      time: '4 hours ago',
      summary: 'Chart patterns suggest continued momentum with strong support levels.'
    },
    {
      title: `${currentCrypto?.name || 'Solana'} DeFi Integration Milestone`,
      source: 'DeFi Pulse',
      time: '6 hours ago',
      summary: 'Major DeFi protocol announces integration, expanding utility and use cases.'
    }
  ];

  const getBuyGradeColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'text-green-400 bg-green-400/20';
    if (grade?.startsWith('B')) return 'text-yellow-400 bg-yellow-400/20';
    if (grade?.startsWith('C')) return 'text-orange-400 bg-orange-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="p-6 md:p-8 pb-20 md:pb-8">
        <SectionHeader
          title="Crypto Analysis"
          subtitle="Live price tracking with technical analysis and buy grades"
          lastUpdated={state.lastUpdated.cryptoData ? `Updated ${state.lastUpdated.cryptoData.toLocaleTimeString()}` : "Live • Updates every hour"}
        />

        {/* Crypto Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {state.cryptoData.slice(0, 6).map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => setActiveTab(crypto.symbol)}
              className={`flex-shrink-0 p-4 rounded-lg transition-all duration-300 ${
                activeTab === crypto.symbol
                  ? 'cyber-card cyber-glow'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="text-left min-w-[120px]">
                <div className="text-lg font-playfair font-semibold text-white mb-1">
                  {crypto.symbol}
                </div>
                <div className="text-sm text-gray-400 font-inter">{crypto.name}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-white font-semibold">{formatPrice(crypto.price)}</span>
                  <span className={`text-sm flex items-center ${
                    crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {crypto.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {formatChange(crypto.change24h)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Chart Section */}
          <div className="lg:col-span-2">
            <div className="cyber-card p-6 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-white">
                    {currentCrypto?.name} ({currentSymbol})
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-3xl font-bold text-white">{formatPrice(currentCrypto?.price || 0)}</span>
                    <span className={`text-lg flex items-center space-x-1 ${
                      (currentCrypto?.change24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(currentCrypto?.change24h || 0) >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <span>{formatChange(currentCrypto?.change24h || 0)}</span>
                      <span className="text-sm">({formatPrice(currentCrypto?.changeValue24h || 0)})</span>
                    </span>
                  </div>
                </div>

                {/* Timeframe Toggles */}
                <div className="flex space-x-2">
                  {timeframes.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded text-sm font-inter transition-all duration-300 ${
                        timeframe === tf
                          ? 'bg-cyan-400/20 text-cyan-400 cyber-border'
                          : 'bg-gray-700 text-gray-400 hover:text-cyan-300'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mock Chart */}
              <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center border cyber-border">
                <div className="text-center">
                  <TrendingUp className="text-cyan-400 mx-auto mb-2" size={48} />
                  <p className="text-gray-400 font-inter">Interactive price chart</p>
                  <p className="text-sm text-gray-500 font-inter mt-1">Chart component would be integrated here</p>
                </div>
              </div>
            </div>

            {/* News Section */}
            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-xl font-playfair font-semibold text-white mb-4">
                {currentCrypto?.name} News
              </h3>
              <div className="space-y-4">
                {newsItems.map((news, index) => (
                  <div key={index} className="border-l-2 border-cyan-400/30 pl-4 hover:border-cyan-400 transition-colors duration-300">
                    <h4 className="font-inter font-semibold text-white mb-1">
                      {news.title}
                    </h4>
                    <p className="text-gray-300 text-sm font-inter mb-2">
                      {news.summary}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 font-inter">
                      <span className="text-cyan-400">{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Sidebar */}
          <div className="space-y-6">
            {/* Buy Grade */}
            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-white mb-4">
                Buy Grade Analysis
              </h3>
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold cyber-border ${getBuyGradeColor(currentCrypto?.buyGrade || 'B')}`}>
                  {currentCrypto?.buyGrade || 'B'}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Current Price</span>
                  <span className="text-white font-semibold">{formatPrice(currentCrypto?.price || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Target Price</span>
                  <span className="text-green-400 font-semibold">{formatPrice(currentCrypto?.targetPrice || 0)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <p className="text-sm text-gray-300 font-inter">
                    <strong className="text-cyan-400">Analysis:</strong> {currentCrypto?.gradeReasoning || 'Market analysis pending'}
                  </p>
                </div>
                <div className="text-xs text-gray-500 font-inter">
                  Last updated: {currentCrypto?.lastUpdated ? new Date(currentCrypto.lastUpdated).toLocaleTimeString() : 'Unknown'}
                </div>
              </div>
            </div>

            {/* Market Indicators */}
            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-white mb-4">
                Market Indicators
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'RSI (14)', value: currentCrypto?.indicators?.rsi?.toFixed(1) || '50.0', status: 'Neutral' },
                  { label: 'MACD', value: currentCrypto?.indicators?.macd || 'Neutral', status: currentCrypto?.change24h >= 0 ? 'Buy Signal' : 'Sell Signal' },
                  { label: '50-Day MA', value: formatPrice(currentCrypto?.indicators?.ma50 || 0), status: (currentCrypto?.price || 0) > (currentCrypto?.indicators?.ma50 || 0) ? 'Above' : 'Below' },
                  { label: 'Volume', value: currentCrypto?.indicators?.volume || 'Medium', status: 'Normal' }
                ].map((indicator, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-400 font-inter text-sm">{indicator.label}</span>
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">{indicator.value}</div>
                      <div className="text-xs text-cyan-400">{indicator.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="cyber-card p-6 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-white mb-4">
                Risk Assessment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Volatility</span>
                  <span className={`${
                    currentCrypto?.riskAssessment?.volatility === 'High' ? 'text-red-400' :
                    currentCrypto?.riskAssessment?.volatility === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                  }`}>{currentCrypto?.riskAssessment?.volatility || 'Medium'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Liquidity</span>
                  <span className={`${
                    currentCrypto?.riskAssessment?.liquidity === 'High' ? 'text-green-400' :
                    currentCrypto?.riskAssessment?.liquidity === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>{currentCrypto?.riskAssessment?.liquidity || 'High'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Market Cap</span>
                  <span className="text-cyan-400">${((currentCrypto?.marketCap || 0) / 1e9).toFixed(1)}B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crypto;
