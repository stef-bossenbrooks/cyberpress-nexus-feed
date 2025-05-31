
import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

const AITools = () => {
  const [activeCategory, setActiveCategory] = useState('Text Generation');

  const categories = [
    'Text Generation',
    'Image Generation', 
    'Audio & Video',
    'Productivity',
    'Research'
  ];

  const toolRankings = {
    'Text Generation': [
      {
        rank: 1,
        name: 'Claude 3.5 Sonnet',
        description: 'Advanced reasoning and coding capabilities with exceptional context understanding.',
        change: 'up',
        grades: {
          'Barrier to Entry': 'A',
          'Cost': 'B+',
          'Efficiency': 'A+',
          'Speed': 'A',
          'Community': 'A+'
        },
        url: 'https://claude.ai'
      },
      {
        rank: 2,
        name: 'GPT-4 Turbo',
        description: 'OpenAI\'s most capable model with multimodal abilities and extensive training.',
        change: 'same',
        grades: {
          'Barrier to Entry': 'A-',
          'Cost': 'B',
          'Efficiency': 'A',
          'Speed': 'A-',
          'Community': 'A+'
        },
        url: 'https://openai.com'
      },
      {
        rank: 3,
        name: 'Gemini Pro',
        description: 'Google\'s flagship model with strong performance across diverse tasks.',
        change: 'down',
        grades: {
          'Barrier to Entry': 'A',
          'Cost': 'A-',
          'Efficiency': 'B+',
          'Speed': 'A',
          'Community': 'B+'
        },
        url: 'https://gemini.google.com'
      },
      {
        rank: 4,
        name: 'Mistral Large',
        description: 'European AI model with strong multilingual capabilities and reasoning.',
        change: 'up',
        grades: {
          'Barrier to Entry': 'B+',
          'Cost': 'A',
          'Efficiency': 'B+',
          'Speed': 'B+',
          'Community': 'B'
        },
        url: 'https://mistral.ai'
      },
      {
        rank: 5,
        name: 'Llama 3.1 405B',
        description: 'Meta\'s open-source model with impressive performance and customization options.',
        change: 'new',
        grades: {
          'Barrier to Entry': 'C+',
          'Cost': 'A+',
          'Efficiency': 'B+',
          'Speed': 'B',
          'Community': 'A'
        },
        url: 'https://llama.meta.com'
      }
    ]
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-yellow-400';
    if (grade.startsWith('C')) return 'text-orange-400';
    return 'text-red-400';
  };

  const getChangeIcon = (change: string) => {
    if (change === 'up') return <TrendingUp className="text-green-400" size={16} />;
    if (change === 'down') return <TrendingDown className="text-red-400" size={16} />;
    if (change === 'new') return <span className="text-cyan-400 text-xs font-bold">NEW</span>;
    return <span className="text-gray-400">—</span>;
  };

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="p-6 md:p-8 pb-20 md:pb-8">
        <SectionHeader
          title="AI Tool Tracker"
          subtitle="Comprehensive rankings and analysis of leading AI tools"
          lastUpdated="Sunday, 8:00 AM PST"
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-inter font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-cyan-400/20 text-cyan-400 cyber-border cyber-glow'
                  : 'bg-gray-800 text-gray-400 hover:text-cyan-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tool Rankings */}
        <div className="space-y-6">
          {toolRankings[activeCategory as keyof typeof toolRankings]?.map((tool) => (
            <div key={tool.rank} className="cyber-card p-6 rounded-lg scan-lines">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full text-black font-bold text-sm">
                    {tool.rank}
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair font-semibold text-white mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-gray-300 font-inter">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getChangeIcon(tool.change)}
                  <button
                    onClick={() => window.open(tool.url, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors duration-300 cyber-border"
                  >
                    <span className="font-inter font-medium">Visit Tool</span>
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>

              {/* Detailed Grades */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                {Object.entries(tool.grades).map(([category, grade]) => (
                  <div key={category} className="text-center">
                    <div className="text-xs text-gray-400 font-inter mb-1">{category}</div>
                    <div className={`text-lg font-bold ${getGradeColor(grade)}`}>
                      {grade}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                      <div
                        className={`h-1 rounded-full bg-gradient-to-r ${
                          grade.startsWith('A') ? 'from-green-400 to-green-500' :
                          grade.startsWith('B') ? 'from-yellow-400 to-yellow-500' :
                          grade.startsWith('C') ? 'from-orange-400 to-orange-500' :
                          'from-red-400 to-red-500'
                        }`}
                        style={{
                          width: `${
                            grade.startsWith('A') ? 85 + (grade.includes('+') ? 10 : 0) :
                            grade.startsWith('B') ? 70 + (grade.includes('+') ? 10 : 0) :
                            grade.startsWith('C') ? 55 + (grade.includes('+') ? 10 : 0) :
                            40
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* On the Radar Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-playfair font-semibold text-white mb-6">
            On the Radar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Cursor AI',
                description: 'AI-powered code editor with predictive coding',
                stage: 'Beta',
                noteworthy: 'Revolutionary autocomplete that predicts entire functions'
              },
              {
                name: 'Perplexity Spaces',
                description: 'Collaborative AI research workspace',
                stage: 'Early Access',
                noteworthy: 'Real-time fact-checking with source verification'
              },
              {
                name: 'Runway Gen-3',
                description: 'Next-generation video AI model',
                stage: 'Limited Beta',
                noteworthy: 'Photorealistic video generation from text prompts'
              }
            ].map((tool, index) => (
              <div key={index} className="cyber-card p-6 rounded-lg hover:cyber-glow-purple transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-playfair font-semibold text-white">
                    {tool.name}
                  </h3>
                  <span className="px-2 py-1 text-xs font-inter font-medium bg-purple-400/20 text-purple-400 rounded-full">
                    {tool.stage}
                  </span>
                </div>
                <p className="text-gray-300 font-inter mb-4">{tool.description}</p>
                <div className="text-sm text-gray-400 font-inter mb-4">
                  <strong className="text-cyan-400">Why it's noteworthy:</strong> {tool.noteworthy}
                </div>
                <button className="w-full py-2 bg-purple-400/10 text-purple-400 rounded-lg hover:bg-purple-400/20 transition-colors duration-300 cyber-border font-inter font-medium">
                  Check It Out
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
