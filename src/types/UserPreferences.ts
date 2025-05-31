
export interface UserPreferences {
  theme: 'light' | 'dark';
  refreshFrequency: 'hourly' | 'daily' | 'weekly';
  categories: {
    aiNews: boolean;
    startupNews: boolean;
    crypto: boolean;
    creative: boolean;
  };
  sources: {
    trusted: string[];
    blocked: string[];
  };
  notifications: {
    newContent: boolean;
    priceAlerts: boolean;
  };
}

export interface SavedItem {
  id: string;
  type: 'news' | 'tool' | 'crypto' | 'creative';
  title: string;
  summary: string;
  source: string;
  url?: string;
  imageUrl?: string;
  dateSaved: Date;
  readStatus: 'read' | 'unread';
  section: string;
}
