import React from 'react';

interface AdSpaceProps {
  format: 'leaderboard' | 'rectangle' | 'skyscraper';
  className?: string;
}

export const AdSpace: React.FC<AdSpaceProps> = ({ format, className = '' }) => {
  const getDimensions = () => {
    switch (format) {
      case 'leaderboard':
        return 'w-full h-24 max-w-[728px] mx-auto';
      case 'rectangle':
        return 'w-full h-[250px] max-w-[300px] mx-auto';
      case 'skyscraper':
        return 'w-full h-[600px] max-w-[160px] mx-auto';
      default:
        return 'w-full h-auto';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-200 text-gray-400 ${getDimensions()} ${className}`}>
      <span className="text-[10px] tracking-widest uppercase mb-1">Advertisement</span>
      <div className="w-full h-full flex items-center justify-center border-t border-gray-200">
        <span className="text-sm font-medium">Space Reserved</span>
      </div>
    </div>
  );
};
