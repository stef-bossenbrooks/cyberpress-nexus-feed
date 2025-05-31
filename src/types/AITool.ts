
export interface AITool {
  id: string;
  name: string;
  description: string;
  category: 'Text Generation' | 'Image Generation' | 'Audio & Video' | 'Productivity' | 'Research';
  url: string;
  logoUrl?: string;
  rank: number;
  change: 'up' | 'down' | 'same' | 'new';
  grades: {
    'Barrier to Entry': string;
    'Cost': string;
    'Efficiency': string;
    'Speed': string;
    'Community': string;
  };
  githubUrl?: string;
  stars?: number;
  forks?: number;
  lastCommit?: Date;
  stage?: 'Beta' | 'Early Access' | 'Limited Beta' | 'Public';
  noteworthy?: string;
}

export interface ToolRankings {
  [category: string]: AITool[];
}
