
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import ContentCard from '../components/ContentCard';
import { Link } from 'react-router-dom';
import { TrendingUp, Zap, Bookmark } from 'lucide-react';

const Home = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const featuredContent = [
    {
      title: "GPT-4 Turbo Achieves New Benchmarks in Code Generation",
      summary: "OpenAI's latest model shows significant improvements in programming tasks, outperforming previous versions by 23% in coding accuracy.",
      source: "MIT Technology Review",
      timeAgo: "2 hours ago",
      readTime: "4 min read",
      imageUrl: "photo-1488590528505-98d2b5aba04b",
      category: "AI News",
      url: "https://example.com"
    },
    {
      title: "Anthropic Raises $4B Series C, Valuation Reaches $18.4B",
      summary: "The AI safety company secures massive funding round led by Google and Spark Capital, positioning for next-generation AI development.",
      source: "TechCrunch",
      timeAgo: "4 hours ago",
      readTime: "3 min read",
      imageUrl: "photo-1518770660439-4636190af475",
      category: "Startup",
      url: "https://example.com"
    },
    {
      title: "The Art of Minimalist AI Interface Design",
      summary: "Exploring how leading AI companies are embracing clean, focused design principles to enhance user experience and reduce cognitive load.",
      source: "Design Weekly",
      timeAgo: "6 hours ago",
      readTime: "7 min read",
      imageUrl: "photo-1526374965328-7f61d4dc18c5",
      category: "Creative",
      url: "https://example.com"
    }
  ];

  const quickStats = [
    { label: 'Bitcoin', value: '$67,420', change: '+2.4%', positive: true },
    { label: 'Ethereum', value: '$3,842', change: '+1.8%', positive: true },
    { label: 'Top AI Tool', value: 'Claude 3.5', change: 'A+ Grade', positive: true },
  ];

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
          <h2 className="text-2xl font-playfair font-semibold text-white mb-6">
            Today's Featured Stories
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredContent.map((content, index) => (
              <ContentCard key={index} {...content} />
            ))}
          </div>
        </div>

        {/* Live Feed Status */}
        <div className="cyber-card p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-playfair font-semibold text-white mb-2">
                Feed Status
              </h3>
              <p className="text-gray-400 font-inter">
                All content sources are online and actively monitored
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
