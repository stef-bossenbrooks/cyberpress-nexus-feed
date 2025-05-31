
import { AITool } from '../types/AITool';
import { supabase } from '../integrations/supabase/client';

class GitHubService {
  async searchAIRepositories(category: string, limit = 20): Promise<AITool[]> {
    try {
      console.log(`Fetching AI tools from GitHub API via Edge Function`);
      
      const { data, error } = await supabase.functions.invoke('fetch-github-tools', {
        body: { category: 'ai-tools', limit }
      });

      if (error) {
        console.error('GitHub Edge function error:', error);
        return this.getFallbackTools();
      }

      console.log(`Fetched ${data.length} AI tools from GitHub`);
      return data || this.getFallbackTools();
    } catch (error) {
      console.error('Failed to fetch AI tools:', error);
      return this.getFallbackTools();
    }
  }

  async fetchRepositoryStats(owner: string, repo: string): Promise<Partial<AITool>> {
    // This would be called by the main searchAIRepositories function
    return {
      stars: 0,
      forks: 0,
      lastCommit: new Date(),
    };
  }

  async discoverEmergingTools(): Promise<AITool[]> {
    // Mock emerging tools for now
    const emergingTools: AITool[] = [
      {
        id: 'cursor-ai',
        name: 'Cursor AI',
        description: 'AI-powered code editor with predictive coding',
        category: 'Productivity',
        url: 'https://cursor.sh',
        rank: 1,
        change: 'new',
        grades: {
          'Barrier to Entry': 'B+',
          'Cost': 'A',
          'Efficiency': 'A-',
          'Speed': 'A+',
          'Community': 'B',
        },
        stage: 'Beta',
        noteworthy: 'Revolutionary autocomplete that predicts entire functions',
        stars: 2500,
        forks: 180,
        lastCommit: new Date(),
      },
      {
        id: 'perplexity-spaces',
        name: 'Perplexity Spaces',
        description: 'Collaborative AI research workspace',
        category: 'Research',
        url: 'https://perplexity.ai',
        rank: 2,
        change: 'new',
        grades: {
          'Barrier to Entry': 'A-',
          'Cost': 'B+',
          'Efficiency': 'A',
          'Speed': 'A-',
          'Community': 'B+',
        },
        stage: 'Early Access',
        noteworthy: 'Real-time fact-checking with source verification',
        stars: 890,
        forks: 67,
        lastCommit: new Date(),
      },
      {
        id: 'runway-gen3',
        name: 'Runway Gen-3',
        description: 'Next-generation video AI model',
        category: 'Audio & Video',
        url: 'https://runwayml.com',
        rank: 3,
        change: 'new',
        grades: {
          'Barrier to Entry': 'C+',
          'Cost': 'C',
          'Efficiency': 'A+',
          'Speed': 'B+',
          'Community': 'A-',
        },
        stage: 'Limited Beta',
        noteworthy: 'Photorealistic video generation from text prompts',
        stars: 450,
        forks: 34,
        lastCommit: new Date(),
      },
    ];

    return emergingTools;
  }

  private getFallbackTools(): AITool[] {
    // Fallback data if API fails
    return [
      {
        id: 'claude-anthropic',
        name: 'Claude 3.5 Sonnet',
        description: 'Advanced reasoning and coding capabilities with exceptional context understanding.',
        category: 'Text Generation',
        url: 'https://claude.ai',
        rank: 1,
        change: 'up',
        grades: {
          'Barrier to Entry': 'A',
          'Cost': 'B+',
          'Efficiency': 'A+',
          'Speed': 'A',
          'Community': 'A+',
        },
        githubUrl: 'https://github.com/anthropics/anthropic-sdk-typescript',
        stars: 1250,
        forks: 89,
        lastCommit: new Date(),
      }
    ];
  }
}

export const githubService = new GitHubService();
