
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
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    
    if (!githubToken) {
      throw new Error('GitHub token not found');
    }

    const { category = 'ai-tools', limit = 10 } = await req.json().catch(() => ({}));

    // Predefined AI tool repositories to track
    const aiToolRepos = [
      { owner: 'openai', repo: 'openai-python', name: 'OpenAI Python SDK' },
      { owner: 'anthropics', repo: 'anthropic-sdk-typescript', name: 'Claude 3.5 Sonnet' },
      { owner: 'google', repo: 'generative-ai-js', name: 'Gemini Pro' },
      { owner: 'meta-llama', repo: 'llama', name: 'Llama 3.1' },
      { owner: 'microsoft', repo: 'semantic-kernel', name: 'Semantic Kernel' },
      { owner: 'langchain-ai', repo: 'langchain', name: 'LangChain' },
      { owner: 'nomic-ai', repo: 'gpt4all', name: 'GPT4All' },
      { owner: 'ollama', repo: 'ollama', name: 'Ollama' }
    ];

    const tools = [];
    
    for (let i = 0; i < Math.min(aiToolRepos.length, limit); i++) {
      const { owner, repo, name } = aiToolRepos[i];
      
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CyberPress-App'
          },
        });

        if (!response.ok) {
          console.warn(`Failed to fetch ${owner}/${repo}: ${response.status}`);
          continue;
        }

        const repoData = await response.json();
        
        const tool = {
          id: `${owner}-${repo}`,
          name: name,
          description: repoData.description || 'AI tool repository',
          category: 'Text Generation',
          url: repoData.html_url,
          rank: i + 1,
          change: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'same',
          grades: calculateToolGrades(repoData),
          githubUrl: repoData.html_url,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          lastCommit: new Date(repoData.updated_at),
        };

        tools.push(tool);
      } catch (error) {
        console.error(`Error fetching ${owner}/${repo}:`, error);
      }
    }

    // Sort by stars and assign ranks
    tools.sort((a, b) => b.stars - a.stars);
    tools.forEach((tool, index) => {
      tool.rank = index + 1;
    });

    console.log(`Fetched ${tools.length} AI tools from GitHub`);

    return new Response(JSON.stringify(tools), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching GitHub tools:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateToolGrades(repoData: any) {
  const stars = repoData.stargazers_count || 0;
  const forks = repoData.forks_count || 0;
  const lastUpdated = new Date(repoData.updated_at);
  const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

  return {
    'Barrier to Entry': getGradeFromStars(stars),
    'Cost': 'A', // Most GitHub repos are free
    'Efficiency': getGradeFromForks(forks),
    'Speed': getGradeFromActivity(daysSinceUpdate),
    'Community': getGradeFromStars(stars),
  };
}

function getGradeFromStars(stars: number): string {
  if (stars >= 50000) return 'A+';
  if (stars >= 25000) return 'A';
  if (stars >= 10000) return 'A-';
  if (stars >= 5000) return 'B+';
  if (stars >= 2000) return 'B';
  if (stars >= 1000) return 'B-';
  if (stars >= 500) return 'C+';
  return 'C';
}

function getGradeFromForks(forks: number): string {
  if (forks >= 10000) return 'A+';
  if (forks >= 5000) return 'A';
  if (forks >= 2000) return 'A-';
  if (forks >= 1000) return 'B+';
  if (forks >= 500) return 'B';
  if (forks >= 200) return 'B-';
  if (forks >= 100) return 'C+';
  return 'C';
}

function getGradeFromActivity(daysSinceUpdate: number): string {
  if (daysSinceUpdate <= 7) return 'A+';
  if (daysSinceUpdate <= 14) return 'A';
  if (daysSinceUpdate <= 30) return 'A-';
  if (daysSinceUpdate <= 60) return 'B+';
  if (daysSinceUpdate <= 90) return 'B';
  if (daysSinceUpdate <= 180) return 'B-';
  if (daysSinceUpdate <= 365) return 'C+';
  return 'C';
}
