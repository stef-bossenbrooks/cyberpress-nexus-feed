
import { NewsItem, NewsResponse } from '../types/NewsItem';
import { supabase } from '../integrations/supabase/client';

class RSSService {
  private async fetchFromEdgeFunction(category: string): Promise<NewsResponse> {
    try {
      console.log(`Fetching ${category} news from Edge Function`);
      
      const { data, error } = await supabase.functions.invoke('fetch-news-content', {
        body: { category, limit: 10 }
      });

      if (error) {
        console.error(`Edge function error for ${category}:`, error);
        throw error;
      }

      return {
        items: data.items || [],
        lastUpdated: new Date(data.lastUpdated),
        source: data.source || 'Perplexity'
      };
    } catch (error) {
      console.error(`Failed to fetch ${category} news:`, error);
      
      // Return empty response on error
      return {
        items: [],
        lastUpdated: new Date(),
        source: 'Error'
      };
    }
  }

  async fetchAITechNews(): Promise<NewsResponse> {
    return this.fetchFromEdgeFunction('ai');
  }

  async fetchStartupNews(): Promise<NewsResponse> {
    return this.fetchFromEdgeFunction('startup');
  }

  async fetchCryptoNews(): Promise<NewsResponse> {
    return this.fetchFromEdgeFunction('crypto');
  }

  async refreshAllContent(): Promise<{
    aiTech: NewsResponse;
    startup: NewsResponse;
    crypto: NewsResponse;
  }> {
    console.log('Refreshing all content from APIs...');
    
    const [aiTech, startup, crypto] = await Promise.all([
      this.fetchAITechNews(),
      this.fetchStartupNews(),
      this.fetchCryptoNews(),
    ]);

    console.log('All content refreshed successfully');
    return { aiTech, startup, crypto };
  }
}

export const rssService = new RSSService();
