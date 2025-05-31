
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Bookmark, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Home = () => {
  const { state, actions } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Combine all news for featured content
  const allNews = [
    ...state.aiNews,
    ...state.startupNews,
    ...state.cryptoNews
  ].sort(() => Math.random() - 0.5).slice(0, 6);

  const quickStats = [
    { 
      label: 'Bitcoin', 
      value: state.cryptoData.length > 0 ? `$${state.cryptoData[0]?.price?.toLocaleString() || '0'}` : '$--,---',
      change: state.cryptoData.length > 0 ? `${state.cryptoData[0]?.change24h >= 0 ? '+' : ''}${state.cryptoData[0]?.change24h?.toFixed(1) || '0'}%` : '--%',
      positive: state.cryptoData.length > 0 ? state.cryptoData[0]?.change24h >= 0 : true 
    },
    { 
      label: 'Ethereum', 
      value: state.cryptoData.length > 1 ? `$${state.cryptoData[1]?.price?.toLocaleString() || '0'}` : '$--,---',
      change: state.cryptoData.length > 1 ? `${state.cryptoData[1]?.change24h >= 0 ? '+' : ''}${state.cryptoData[1]?.change24h?.toFixed(1) || '0'}%` : '--%',
      positive: state.cryptoData.length > 1 ? state.cryptoData[1]?.change24h >= 0 : true 
    },
    { 
      label: 'Top AI Tool', 
      value: Object.values(state.aiTools).flat()[0]?.name || 'Loading...',
      change: Object.values(state.aiTools).flat()[0]?.grades?.['Community'] || 'A+',
      positive: true 
    },
  ];

  const isLoading = state.loading.aiNews || state.loading.startupNews || state.loading.cryptoNews;

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="p-6 md:p-8 pb-20 md:pb-8">
        <SectionHeader
          title={`${getGreeting()}, Tech Explorer`}
          subtitle="Your personalized digital newspaper is ready"
          lastUpdated={new Date().toLocaleString()}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="cyber-card p-4 rounded-lg">
              <div className="text-sm text-gray-400 font-inter">{stat.label}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-semibold text-white">{stat.value}</span>
                <span className={`text-sm font-medium ${
                  stat.positive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/ai-tools" 
            className="cyber-card p-6 rounded-lg hover:cyber-glow transition-all duration-300 group"
          >
            <Zap className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="text-lg font-playfair font-semibold text-white mb-2">AI Tool Tracker</h3>
            <p className="text-gray-400 font-inter text-sm">Discover and rank the latest AI tools with detailed performance grades.</p>
          </Link>

          <Link 
            to="/crypto" 
            className="cyber-card p-6 rounded-lg hover:cyber-glow transition-all duration-300 group"
          >
            <TrendingUp className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="text-lg font-playfair font-semibold text-white mb-2">Crypto Analysis</h3>
            <p className="text-gray-400 font-inter text-sm">Live price tracking with buy grades and technical analysis.</p>
          </Link>

          <Link 
            to="/creative" 
            className="cyber-card p-6 rounded-lg hover:cyber-glow transition-all duration-300 group"
          >
            <Bookmark className="text-pink-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="text-lg font-playfair font-semibold text-white mb-2">Creative Inspiration</h3>
            <p className="text-gray-400 font-inter text-sm">Curated visual content to spark creativity and innovation.</p>
          </Link>
        </div>

        {/* Featured Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-playfair font-semibold text-white">
              Today's Featured Stories
            </h2>
            <button
              onClick={() => actions.refreshAllContent()}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors duration-300 cyber-border disabled:opacity-50"
            >
              <RefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={16} />
              <span className="font-inter font-medium">Refresh</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="cyber-card p-6 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : allNews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {allNews.map((content, index) => (
                <ContentCard key={content.id || index} {...content} />
              ))}
            </div>
          ) : (
            <div className="cyber-card p-8 rounded-lg text-center">
              <p className="text-gray-400 font-inter mb-4">
                No featured stories available right now. Try refreshing to load the latest content.
              </p>
              <button
                onClick={() => actions.refreshAllContent()}
                className="px-6 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors duration-300 cyber-border font-inter font-medium"
              >
                Refresh Content
              </button>
            </div>
          )}
        </div>

        {/* Live Feed Status */}
        <div className="cyber-card p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-playfair font-semibold text-white mb-2">
                Feed Status
              </h3>
              <p className="text-gray-400 font-inter">
                {isLoading ? 'Updating content sources...' : 'All content sources are online and actively monitored'}
              </p>
            </div>
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full ${state.errors.aiNews ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`}></div>
              <div className={`w-3 h-3 rounded-full ${state.errors.cryptoData ? 'bg-red-400' : 'bg-cyan-400 animate-pulse'}`} style={{animationDelay: '0.5s'}}></div>
              <div className={`w-3 h-3 rounded-full ${state.errors.startupNews ? 'bg-red-400' : 'bg-purple-400 animate-pulse'}`} style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
