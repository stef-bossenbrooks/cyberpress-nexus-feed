
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  actionButton?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  lastUpdated,
  actionButton
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-playfair font-bold cyber-text-gradient mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 font-inter text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {actionButton && actionButton}
      </div>

      {lastUpdated && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 font-inter">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Last updated: {lastUpdated}</span>
        </div>
      )}

      {/* Decorative line */}
      <div className="mt-6 h-[1px] cyber-gradient opacity-30"></div>
    </div>
  );
};

export default SectionHeader;
