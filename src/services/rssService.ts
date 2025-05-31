
import { NewsItem, NewsResponse } from '../types/NewsItem';
import { ApiClient } from './api';

const RSS_SOURCES = {
  AI_TECH: [
    {
      name: 'MIT Technology Review',
      url: 'https://www.technologyreview.com/feed/',
      category: 'Tech' as const,
    },
    {
      name: 'VentureBeat AI',
      url: 'https://venturebeat.com/category/ai/feed/',
      category: 'AI' as const,
    },
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
      category: 'AI' as const,
    },
  ],
  STARTUP: [
    {
      name: 'TechCrunch Startups',
      url: 'https://techcrunch.com/category/startups/feed/',
      category: 'Startup' as const,
    },
    {
      name: 'Y Combinator',
      url: 'https://blog.ycombinator.com/feed',
      category: 'Startup' as const,
    },
    {
      name: 'First Round Review',
      url: 'https://review.firstround.com/feed',
      category: 'Startup' as const,
    },
  ],
  CRYPTO: [
    {
      name: 'CoinDesk',
      url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
      category: 'Tech' as const,
    },
    {
      name: 'Cointelegraph',
      url: 'https://cointelegraph.com/rss',
      category: 'Tech' as const,
    },
  ],
};

class RSSService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  private async parseRSSFeed(url: string, sourceName: string, category: NewsItem['category']): Promise<NewsItem[]> {
    try {
      // Note: In a production environment, you would use a CORS proxy or server-side RSS parsing
      // For this demo, we'll simulate RSS parsing with mock data
      const mockItems: NewsItem[] = [
        {
          id: `${sourceName}-1`,
          title: `Latest ${category} developments from ${sourceName}`,
          summary: `Recent breakthrough in ${category} technology with significant implications for the industry.`,
          source: sourceName,
          url: url,
          publishedAt: new Date(),
          category,
          readTime: '3 min read',
          imageUrl: 'photo-1488590528505-98d2b5aba04b',
        },
        {
          id: `${sourceName}-2`,
          title: `Innovation spotlight: ${category} trends`,
          summary: `Comprehensive analysis of emerging trends in ${category} space.`,
          source: sourceName,
          url: url,
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          category,
          readTime: '5 min read',
          imageUrl: 'photo-1518770660439-4636190af475',
        },
      ];

      return mockItems;
    } catch (error) {
      console.error(`Failed to parse RSS feed ${url}:`, error);
      return [];
    }
  }

  async fetchAITechNews(): Promise<NewsResponse> {
    const allItems: NewsItem[] = [];

    for (const source of RSS_SOURCES.AI_TECH) {
      const items = await this.parseRSSFeed(source.url, source.name, source.category);
      allItems.push(...items);
    }

    // Remove duplicates and sort by publication date
    const uniqueItems = this.deduplicateAndSort(allItems);

    return {
      items: uniqueItems.slice(0, 20), // Limit to 20 items
      lastUpdated: new Date(),
      source: 'RSS Feeds',
    };
  }

  async fetchStartupNews(): Promise<NewsResponse> {
    const allItems: NewsItem[] = [];

    for (const source of RSS_SOURCES.STARTUP) {
      const items = await this.parseRSSFeed(source.url, source.name, source.category);
      allItems.push(...items);
    }

    const uniqueItems = this.deduplicateAndSort(allItems);

    return {
      items: uniqueItems.slice(0, 20),
      lastUpdated: new Date(),
      source: 'RSS Feeds',
    };
  }

  async fetchCryptoNews(): Promise<NewsResponse> {
    const allItems: NewsItem[] = [];

    for (const source of RSS_SOURCES.CRYPTO) {
      const items = await this.parseRSSFeed(source.url, source.name, source.category);
      allItems.push(...items);
    }

    const uniqueItems = this.deduplicateAndSort(allItems);

    return {
      items: uniqueItems.slice(0, 10),
      lastUpdated: new Date(),
      source: 'RSS Feeds',
    };
  }

  private deduplicateAndSort(items: NewsItem[]): NewsItem[] {
    // Remove duplicates based on title similarity
    const unique = items.filter((item, index, array) => 
      array.findIndex(other => 
        this.titleSimilarity(item.title, other.title) < 0.8
      ) === index
    );

    // Sort by publication date (newest first)
    return unique.sort((a, b) => 
      b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }

  private titleSimilarity(title1: string, title2: string): number {
    const words1 = title1.toLowerCase().split(' ');
    const words2 = title2.toLowerCase().split(' ');
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  }

  async refreshAllContent(): Promise<{
    aiTech: NewsResponse;
    startup: NewsResponse;
    crypto: NewsResponse;
  }> {
    const [aiTech, startup, crypto] = await Promise.all([
      this.fetchAITechNews(),
      this.fetchStartupNews(),
      this.fetchCryptoNews(),
    ]);

    return { aiTech, startup, crypto };
  }
}

export const rssService = new RSSService();
