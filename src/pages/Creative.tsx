
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { ExternalLink, Save } from 'lucide-react';

const Creative = () => {
  const inspirationContent = [
    {
      type: 'image',
      title: 'Minimalist AI Interface Design Principles',
      description: 'Clean, focused interfaces that reduce cognitive load while maintaining powerful functionality.',
      imageUrl: 'photo-1526374965328-7f61d4dc18c5',
      source: 'Design Systems Weekly',
      category: 'UI/UX'
    },
    {
      type: 'quote',
      content: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay',
      category: 'Innovation'
    },
    {
      type: 'image',
      title: 'Cyberpunk Architecture Meets Modern Tech',
      description: 'Exploring how futuristic design concepts influence contemporary digital interfaces.',
      imageUrl: 'photo-1500673922987-e212871fec22',
      source: 'Architectural Digest',
      category: 'Design'
    },
    {
      type: 'concept',
      title: 'Neural Interface Prototyping',
      description: 'Revolutionary concepts for direct brain-computer interfaces that could transform how we interact with AI systems.',
      category: 'Concept',
      tags: ['AI', 'Hardware', 'Future Tech']
    },
    {
      type: 'image',
      title: 'Organic Data Visualization',
      description: 'Nature-inspired approaches to representing complex data structures and AI decision trees.',
      imageUrl: 'photo-1470071459604-3b5ec3a7fe05',
      source: 'Data Art Collective',
      category: 'Data Viz'
    },
    {
      type: 'quote',
      content: 'Technology is best when it brings people together.',
      author: 'Matt Mullenweg',
      category: 'Philosophy'
    },
    {
      type: 'image',
      title: 'Digital Ocean: Fluid AI Interfaces',
      description: 'Exploring how AI interfaces can feel more natural and intuitive through fluid, water-like interactions.',
      imageUrl: 'photo-1500375592092-40eb2168fd21',
      source: 'Interaction Design Foundation',
      category: 'Interaction'
    },
    {
      type: 'concept',
      title: 'Sustainable AI Computing',
      description: 'Innovative approaches to reducing the environmental impact of AI training and inference through green technology.',
      category: 'Sustainability',
      tags: ['Green Tech', 'AI Ethics', 'Environment']
    }
  ];

  const QuoteCard = ({ content, author, category }: { content: string; author: string; category: string }) => (
    <div className="cyber-card p-8 rounded-lg hover:cyber-glow-purple transition-all duration-300 flex flex-col justify-center text-center">
      <div className="mb-4">
        <span className="text-xs font-inter font-medium px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full">
          {category}
        </span>
      </div>
      <blockquote className="text-xl font-playfair font-semibold text-white mb-4 leading-relaxed">
        "{content}"
      </blockquote>
      <cite className="text-cyan-400 font-inter">— {author}</cite>
      <button className="mt-4 p-2 text-gray-400 hover:text-purple-400 transition-colors">
        <Save size={16} />
      </button>
    </div>
  );

  const ImageCard = ({ title, description, imageUrl, source, category }: any) => (
    <div className="cyber-card rounded-lg overflow-hidden hover:cyber-glow transition-all duration-300 group">
      <div className="relative">
        <img 
          src={`https://images.unsplash.com/${imageUrl}?w=600&h=400&fit=crop`}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-inter font-medium bg-black/60 text-cyan-400 rounded-full backdrop-blur-sm">
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-black/60 text-gray-400 hover:text-purple-400 rounded-full backdrop-blur-sm transition-colors">
            <Save size={14} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-playfair font-semibold text-white mb-2 group-hover:cyber-text-gradient transition-all duration-300">
          {title}
        </h3>
        <p className="text-gray-300 font-inter text-sm mb-3">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-cyan-400 font-inter">{source}</span>
          <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-cyan-400 transition-colors">
            <span>View</span>
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );

  const ConceptCard = ({ title, description, category, tags }: any) => (
    <div className="cyber-card p-6 rounded-lg hover:cyber-glow-pink transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2 py-1 text-xs font-inter font-medium bg-pink-400/20 text-pink-400 rounded-full">
          {category}
        </span>
        <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
          <Save size={16} />
        </button>
      </div>
      <h3 className="text-lg font-playfair font-semibold text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-300 font-inter mb-4">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string, index: number) => (
          <span key={index} className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="p-6 md:p-8 pb-20 md:pb-8">
        <SectionHeader
          title="Creative Inspiration"
          subtitle="Curated content to spark innovation and creative thinking"
          lastUpdated="Today, 8:00 AM PST"
        />

        {/* Filter Options */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Design', 'Innovation', 'Concept', 'Philosophy', 'Data Viz'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-lg font-inter font-medium transition-all duration-300 bg-gray-800 text-gray-400 hover:text-cyan-300 hover:bg-gray-700"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {inspirationContent.map((item, index) => {
            if (item.type === 'quote') {
              return <QuoteCard key={index} {...item} />;
            } else if (item.type === 'image') {
              return <ImageCard key={index} {...item} />;
            } else if (item.type === 'concept') {
              return <ConceptCard key={index} {...item} />;
            }
            return null;
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 cyber-card rounded-lg hover:cyber-glow transition-all duration-300 font-inter font-medium text-white">
            Load More Inspiration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Creative;
