
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  author?: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  category: 'AI' | 'Tech' | 'Startup' | 'Funding' | 'Research';
  readTime?: string;
  tags?: string[];
  isSaved?: boolean;
}

export interface NewsResponse {
  items: NewsItem[];
  lastUpdated: Date;
  source: string;
}
