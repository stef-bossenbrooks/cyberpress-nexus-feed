
import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import ContentCard from '../components/ContentCard';
import { ExternalLink, Save, Trash2 } from 'lucide-react';

const Saved = () => {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('unread');

  const savedItems = [
    {
      id: 1,
      title: "GPT-4 Turbo Achieves New Benchmarks in Code Generation",
      summary: "OpenAI's latest model shows significant improvements in programming tasks, outperforming previous versions by 23% in coding accuracy.",
      source: "MIT Technology Review",
      timeAgo: "2 hours ago",
      dateSaved: "Today",
      section: "AI News",
      readStatus: "unread",
      imageUrl: "photo-1488590528505-98d2b5aba04b",
      url: "https://example.com"
    },
    {
      id: 2,
      title: "The Art of Minimalist AI Interface Design",
      summary: "Exploring how leading AI companies are embracing clean, focused design principles to enhance user experience and reduce cognitive load.",
      source: "Design Weekly",
      timeAgo: "6 hours ago",
      dateSaved: "Today",
      section: "Creative",
      readStatus: "read",
      imageUrl: "photo-1526374965328-7f61d4dc18c5",
      url: "https://example.com"
    },
    {
      id: 3,
      title: "Claude 3.5 Sonnet Performance Analysis",
      summary: "Comprehensive breakdown of Anthropic's latest model capabilities across different task categories.",
      source: "AI Research Weekly",
      timeAgo: "1 day ago",
      dateSaved: "Yesterday",
      section: "AI Tools",
      readStatus: "unread",
      url: "https://example.com"
    },
    {
      id: 4,
      title: "Bitcoin Technical Analysis: Bull Flag Formation",
      summary: "Chart patterns suggest continued upward momentum with potential target of $75,000 in Q1 2024.",
      source: "Crypto Insights",
      timeAgo: "2 days ago",
      dateSaved: "Yesterday",
      section: "Crypto",
      readStatus: "read",
      url: "https://example.com"
    }
  ];

  const sections = ['All', 'AI News', 'AI Tools', 'Crypto', 'Creative'];
  const viewModes = [
    { key: 'all', label: 'All Items' },
    { key: 'unread', label: 'Unread' },
    { key: 'read', label: 'Read' }
  ];

  const filteredItems = savedItems.filter(item => {
    const sectionMatch = filter === 'All' || item.section === filter;
    const statusMatch = viewMode === 'all' || item.readStatus === viewMode;
    return sectionMatch && statusMatch;
  });

  const getSectionIcon = (section: string) => {
    const iconClass = "w-4 h-4";
    switch (section) {
      case 'AI News': return '🤖';
      case 'AI Tools': return '⚡';
      case 'Crypto': return '📈';
      case 'Creative': return '🎨';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="p-6 md:p-8 pb-20 md:pb-8">
        <SectionHeader
          title="Saved Items"
          subtitle="Your curated collection of important content"
          lastUpdated={`${savedItems.length} items saved`}
        />

        {/* Filter Controls */}
        <div className="space-y-4 mb-8">
          {/* Section Filters */}
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setFilter(section)}
                className={`px-4 py-2 rounded-lg font-inter font-medium transition-all duration-300 ${
                  filter === section
                    ? 'bg-cyan-400/20 text-cyan-400 cyber-border cyber-glow'
                    : 'bg-gray-800 text-gray-400 hover:text-cyan-300 hover:bg-gray-700'
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* View Mode Toggles */}
          <div className="flex space-x-2">
            {viewModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`px-3 py-1 rounded text-sm font-inter transition-all duration-300 ${
                  viewMode === mode.key
                    ? 'bg-purple-400/20 text-purple-400 cyber-border'
                    : 'bg-gray-700 text-gray-400 hover:text-purple-300'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Items List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="cyber-card p-6 rounded-lg hover:cyber-glow transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-lg">{getSectionIcon(item.section)}</span>
                      <span className="px-2 py-1 text-xs font-inter font-medium bg-cyan-400/20 text-cyan-400 rounded-full">
                        {item.section}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${
                        item.readStatus === 'unread' ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}></span>
                      <span className="text-sm text-gray-400 font-inter">
                        Saved {item.dateSaved}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl font-playfair font-semibold mb-2 transition-all duration-300 ${
                      item.readStatus === 'unread' ? 'text-white' : 'text-gray-300'
                    }`}>
                      {item.title}
                    </h3>

                    <p className="text-gray-300 font-inter mb-3">
                      {item.summary}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400 font-inter">
                      <span className="text-cyan-400 font-medium">{item.source}</span>
                      <span>•</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {item.imageUrl && (
                    <div className="ml-6 flex-shrink-0">
                      <img 
                        src={`https://images.unsplash.com/${item.imageUrl}?w=120&h=80&fit=crop`}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                    {item.url && (
                      <button 
                        onClick={() => window.open(item.url, '_blank')}
                        className="flex items-center space-x-2 px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors duration-300 cyber-border"
                      >
                        <span className="font-inter font-medium">Read</span>
                        <ExternalLink size={16} />
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors duration-300">
                      {item.readStatus === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                    </button>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Save className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-playfair font-semibold text-gray-400 mb-2">
              No saved items found
            </h3>
            <p className="text-gray-500 font-inter">
              {filter === 'All' 
                ? "Start saving interesting content from other sections" 
                : `No saved items in ${filter} section`}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="cyber-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-cyan-400">{savedItems.length}</div>
            <div className="text-sm text-gray-400 font-inter">Total Saved</div>
          </div>
          <div className="cyber-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">
              {savedItems.filter(item => item.readStatus === 'unread').length}
            </div>
            <div className="text-sm text-gray-400 font-inter">Unread</div>
          </div>
          <div className="cyber-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-pink-400">
              {savedItems.filter(item => item.section === 'Creative').length}
            </div>
            <div className="text-sm text-gray-400 font-inter">Creative</div>
          </div>
          <div className="cyber-card p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {savedItems.filter(item => item.dateSaved === 'Today').length}
            </div>
            <div className="text-sm text-gray-400 font-inter">Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;
