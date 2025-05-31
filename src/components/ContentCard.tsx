
import React, { useState } from 'react';
import { ExternalLink, Save } from 'lucide-react';

interface ContentCardProps {
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  imageUrl?: string;
  readTime?: string;
  url?: string;
  category?: string;
  onSave?: () => void;
  isSaved?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  summary,
  source,
  timeAgo,
  imageUrl,
  readTime,
  url,
  category,
  onSave,
  isSaved = false
}) => {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.();
  };

  return (
    <div className="cyber-card p-6 rounded-lg transition-all duration-300 hover:cyber-glow hover:scale-[1.02] scan-lines">
      {imageUrl && (
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <img 
            src={`https://images.unsplash.com/${imageUrl}?w=400&h=200&fit=crop`}
            alt={title}
            className="w-full h-48 object-cover"
          />
          {category && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-inter font-medium bg-cyan-400/20 text-cyan-400 rounded-full cyber-border">
                {category}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-xl font-playfair font-semibold text-white leading-tight hover:cyber-text-gradient transition-all duration-300 cursor-pointer">
          {title}
        </h3>

        <p className="text-gray-300 font-inter leading-relaxed">
          {summary}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-400 font-inter">
          <div className="flex items-center space-x-4">
            <span className="text-cyan-400 font-medium">{source}</span>
            <span>•</span>
            <span>{timeAgo}</span>
            {readTime && (
              <>
                <span>•</span>
                <span>{readTime}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {url && (
            <button 
              onClick={() => window.open(url, '_blank')}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors duration-300 cyber-border"
            >
              <span className="font-inter font-medium">Read More</span>
              <ExternalLink size={16} />
            </button>
          )}

          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-all duration-300 ${
              saved 
                ? 'bg-purple-400/20 text-purple-400 cyber-glow-purple' 
                : 'bg-gray-800 text-gray-400 hover:text-purple-400'
            }`}
          >
            <Save size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
