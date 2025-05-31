
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not found');
    }

    const { category = 'ai', limit = 10 } = await req.json().catch(() => ({}));

    let query = '';
    let newsCategory = 'AI';
    
    switch (category) {
      case 'ai':
        query = 'Latest developments in artificial intelligence, machine learning, and AI tools 2024';
        newsCategory = 'AI';
        break;
      case 'startup':
        query = 'Recent tech startup funding, acquisitions, and launches 2024';
        newsCategory = 'Startup';
        break;
      case 'crypto':
        query = 'Cryptocurrency news, blockchain developments, and digital asset updates 2024';
        newsCategory = 'Tech';
        break;
      case 'creative':
        query = 'AI design tools, creative technology, and digital art innovations 2024';
        newsCategory = 'Research';
        break;
      default:
        query = 'Technology news and innovations 2024';
        newsCategory = 'Tech';
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a tech news curator. Return exactly ${limit} news items in JSON format with this structure: {"news": [{"title": "string", "summary": "string", "source": "string", "url": "string", "publishedAt": "ISO date string"}]}. Focus on recent, high-quality news from reputable sources.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'week'
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let newsData;
    try {
      newsData = JSON.parse(content);
    } catch {
      // Fallback if JSON parsing fails
      newsData = { news: [] };
    }

    // Transform to our NewsItem format
    const newsItems = (newsData.news || []).slice(0, limit).map((item: any, index: number) => ({
      id: `${category}-${Date.now()}-${index}`,
      title: item.title || 'Tech News Update',
      summary: item.summary || 'Latest developments in technology.',
      source: item.source || 'Tech News',
      url: item.url || '#',
      publishedAt: item.publishedAt || new Date().toISOString(),
      category: newsCategory,
      readTime: `${Math.ceil((item.summary || '').length / 200)} min read`,
      imageUrl: getRandomImageId(),
    }));

    console.log(`Fetched ${newsItems.length} news items for category: ${category}`);

    return new Response(JSON.stringify({ 
      items: newsItems,
      lastUpdated: new Date().toISOString(),
      source: 'Perplexity'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching news content:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      items: [],
      lastUpdated: new Date().toISOString(),
      source: 'Error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getRandomImageId(): string {
  const imageIds = [
    'photo-1488590528505-98d2b5aba04b',
    'photo-1518770660439-4636190af475',
    'photo-1526374965328-7f61d4dc18c5',
    'photo-1500673922987-e212871fec22',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1500375592092-40eb2168fd21'
  ];
  return imageIds[Math.floor(Math.random() * imageIds.length)];
}
