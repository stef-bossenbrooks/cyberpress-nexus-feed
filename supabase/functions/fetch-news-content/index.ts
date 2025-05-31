
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
      console.error('Perplexity API key not found');
      throw new Error('Perplexity API key not found');
    }

    const { category = 'ai', limit = 10 } = await req.json().catch(() => ({}));
    console.log(`Processing request for category: ${category}, limit: ${limit}`);

    let query = '';
    let newsCategory = 'AI';
    
    switch (category) {
      case 'ai':
        query = 'Latest AI news, machine learning breakthroughs, and artificial intelligence developments in 2024';
        newsCategory = 'AI';
        break;
      case 'startup':
        query = 'Recent tech startup funding rounds, acquisitions, and new company launches in 2024';
        newsCategory = 'Startup';
        break;
      case 'crypto':
        query = 'Latest cryptocurrency news, blockchain developments, and digital asset market updates 2024';
        newsCategory = 'Tech';
        break;
      case 'creative':
        query = 'AI design tools, creative technology innovations, and digital art developments 2024';
        newsCategory = 'Research';
        break;
      default:
        query = 'Technology news and innovations 2024';
        newsCategory = 'Tech';
    }

    console.log(`Making Perplexity API request with query: ${query}`);

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
            content: `You are a tech news curator. Return exactly ${limit} recent news items in valid JSON format. Use this exact structure: {"items": [{"title": "string", "summary": "string", "source": "string", "url": "string", "publishedAt": "ISO date string"}]}. Focus on recent, high-quality news from reputable tech sources. Each summary should be 2-3 sentences. Make sure URLs are real and working.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.2,
        max_tokens: 3000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'week'
      }),
    });

    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity API response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure from Perplexity API');
      throw new Error('Invalid response structure from Perplexity API');
    }

    const content = data.choices[0].message.content;
    console.log('Raw content from Perplexity:', content);
    
    let newsData;
    try {
      // Try to parse the JSON response
      newsData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON from Perplexity response:', parseError);
      console.log('Content that failed to parse:', content);
      
      // If JSON parsing fails, create fallback content
      newsData = {
        items: [
          {
            title: `Latest ${newsCategory} Updates`,
            summary: "Stay tuned for the latest developments in this rapidly evolving space.",
            source: "Tech News",
            url: "#",
            publishedAt: new Date().toISOString()
          }
        ]
      };
    }

    // Ensure we have the items array
    if (!newsData.items || !Array.isArray(newsData.items)) {
      console.warn('No items array found in response, creating fallback');
      newsData = { items: [] };
    }

    // Transform to our NewsItem format
    const newsItems = newsData.items.slice(0, limit).map((item: any, index: number) => {
      const baseId = `${category}-${Date.now()}-${index}`;
      return {
        id: baseId,
        title: item.title || `${newsCategory} News Update ${index + 1}`,
        summary: item.summary || 'Latest developments in technology and innovation.',
        source: item.source || 'Tech News',
        url: item.url || '#',
        publishedAt: item.publishedAt || new Date().toISOString(),
        category: newsCategory,
        readTime: `${Math.max(1, Math.ceil((item.summary || '').length / 200))} min read`,
        imageUrl: getRandomImageId(),
        timeAgo: calculateTimeAgo(item.publishedAt || new Date().toISOString()),
      };
    });

    console.log(`Successfully processed ${newsItems.length} news items for category: ${category}`);

    return new Response(JSON.stringify({ 
      items: newsItems,
      lastUpdated: new Date().toISOString(),
      source: 'Perplexity'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-news-content function:', error);
    
    // Return fallback data instead of empty array
    const { category = 'ai', limit = 10 } = await req.json().catch(() => ({}));
    const fallbackItems = Array.from({ length: Math.min(limit, 3) }, (_, index) => ({
      id: `fallback-${category}-${Date.now()}-${index}`,
      title: `${category.toUpperCase()} Technology Update`,
      summary: "We're currently updating our news sources. Please check back shortly for the latest updates.",
      source: "CyberPress",
      url: "#",
      publishedAt: new Date().toISOString(),
      category: category === 'ai' ? 'AI' : category === 'startup' ? 'Startup' : 'Tech',
      readTime: "2 min read",
      imageUrl: getRandomImageId(),
      timeAgo: "Just now",
    }));

    return new Response(JSON.stringify({ 
      items: fallbackItems,
      lastUpdated: new Date().toISOString(),
      source: 'Fallback',
      error: error.message
    }), {
      status: 200, // Return 200 with fallback data instead of 500
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

function calculateTimeAgo(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffInMs = now.getTime() - published.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return `${Math.floor(diffInDays / 7)} weeks ago`;
}
