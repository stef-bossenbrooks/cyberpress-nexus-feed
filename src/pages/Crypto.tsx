
import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Crypto = () => {
  const [activeTab, setActiveTab] = useState('BTC');
  const [timeframe, setTimeframe] = useState('24h');

  const cryptocurrencies = {
    BTC: {
      name: 'Bitcoin',
      price: '$67,420.50',
      change: '+2.4%',
      changeValue: '+$1,580.30',
      positive: true,
      buyGrade: 'B+',
      targetPrice: '$72,000',
      gradeReasoning: 'Strong institutional adoption with mild overbought signals'
    },
    ETH: {
      name: 'Ethereum',
      price: '$3,842.15',
      change: '+1.8%',
      changeValue: '+$67.82',
      positive: true,
      buyGrade: 'A-',
      targetPrice: '$4,200',
      gradeReasoning: 'Upcoming ETF approval and staking yield attractiveness'
    },
    SOL: {
      name: 'Solana',
      price: '$198.44',
      change: '+5.2%',
      changeValue: '+$9.84',
      positive: true,
      buyGrade: 'A',
      targetPrice: '$250',
      gradeReasoning: 'Ecosystem growth and memecoin activity driving momentum'
    }
  };

  const timeframes = ['24h', '7d', '30d', 'YTD'];

  const newsItems = [
    {
      title: 'BlackRock Bitcoin ETF Sees Record $1.2B Inflow',
      source: 'CoinDesk',
      time: '2 hours ago',
      summary: 'Institutional demand continues to drive Bitcoin adoption with largest single-day inflow recorded.'
    },
    {
      title: 'Ethereum Staking Rewards Hit New High at 4.2% APY',
      source: 'The Block',
      time: '4 hours ago',
      summary: 'Network upgrades and reduced validator competition boost staking yields for ETH holders.'
    },
    {
      title: 'Solana DeFi TVL Reaches $5.8B Milestone',
      source: 'DeFi Pulse',
      time: '6 hours ago',
      summary: 'Rapid ecosystem expansion drives total value locked to new all-time high.'
    }
  ];

  const getBuyGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400 bg-green-400/20';
    if (grade.startsWith('B')) return 'text-yellow-400 bg-yellow-400/20';
    if (grade.startsWith('C')) return 'text-orange-400 bg-orange-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  const currentCrypto = cryptocurrencies[activeTab as keyof typeof cryptocurrencies];

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="p-6 md:p-8 pb-20 md:pb-8">
        <SectionHeader
          title="Crypto Analysis"
          subtitle="Live price tracking with technical analysis and buy grades"
          lastUpdated="Live • Updates every hour"
        />

        {/* Crypto Tabs */}
        <div className="flex space-x-4 mb-8">
          {Object.entries(cryptocurrencies).map(([symbol, crypto]) => (
            <button
              key={symbol}
              onClick={() => setActiveTab(symbol)}
              className={`flex-1 p-4 rounded-lg transition-all duration-300 ${
                activeTab === symbol
                  ? 'cyber-card cyber-glow'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="text-left">
                <div className="text-lg font-playfair font-semibold text-white mb-1">
                  {symbol}
                </div>
                <div className="text-sm text-gray-400 font-inter">{crypto.name}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-white font-semibold">{crypto.price}</span>
                  <span className={`text-sm flex items-center ${
                    crypto.positive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {crypto.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {crypto.change}
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
                    {currentCrypto.name} ({activeTab})
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-3xl font-bold text-white">{currentCrypto.price}</span>
                    <span className={`text-lg flex items-center space-x-1 ${
                      currentCrypto.positive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {currentCrypto.positive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      <span>{currentCrypto.change}</span>
                      <span className="text-sm">({currentCrypto.changeValue})</span>
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
                {currentCrypto.name} News
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
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold cyber-border ${getBuyGradeColor(currentCrypto.buyGrade)}`}>
                  {currentCrypto.buyGrade}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Current Price</span>
                  <span className="text-white font-semibold">{currentCrypto.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Target Price</span>
                  <span className="text-green-400 font-semibold">{currentCrypto.targetPrice}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <p className="text-sm text-gray-300 font-inter">
                    <strong className="text-cyan-400">Analysis:</strong> {currentCrypto.gradeReasoning}
                  </p>
                </div>
                <div className="text-xs text-gray-500 font-inter">
                  Last updated: {new Date().toLocaleTimeString()}
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
                  { label: 'RSI (14)', value: '58.2', status: 'Neutral' },
                  { label: 'MACD', value: 'Bullish', status: 'Buy Signal' },
                  { label: '50-Day MA', value: '$63,840', status: 'Above' },
                  { label: 'Volume', value: 'High', status: 'Increasing' }
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
                  <span className="text-yellow-400">Medium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Liquidity</span>
                  <span className="text-green-400">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-inter">Correlation</span>
                  <span className="text-cyan-400">Low</span>
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
