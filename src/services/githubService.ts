
import { AITool } from '../types/AITool';
import { ApiClient } from './api';

const GITHUB_BASE_URL = 'https://api.github.com';

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  topics: string[];
}

class GitHubService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(GITHUB_BASE_URL);
  }

  async searchAIRepositories(category: string, limit = 20): Promise<AITool[]> {
    try {
      // Mock GitHub data for demo
      const mockTools: AITool[] = [
        {
          id: 'anthropic-claude',
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
        },
        {
          id: 'openai-gpt4',
          name: 'GPT-4 Turbo',
          description: "OpenAI's most capable model with multimodal abilities and extensive training.",
          category: 'Text Generation',
          url: 'https://openai.com',
          rank: 2,
          change: 'same',
          grades: {
            'Barrier to Entry': 'A-',
            'Cost': 'B',
            'Efficiency': 'A',
            'Speed': 'A-',
            'Community': 'A+',
          },
          githubUrl: 'https://github.com/openai/openai-python',
          stars: 18500,
          forks: 2100,
          lastCommit: new Date(),
        },
        {
          id: 'google-gemini',
          name: 'Gemini Pro',
          description: "Google's flagship model with strong performance across diverse tasks.",
          category: 'Text Generation',
          url: 'https://gemini.google.com',
          rank: 3,
          change: 'down',
          grades: {
            'Barrier to Entry': 'A',
            'Cost': 'A-',
            'Efficiency': 'B+',
            'Speed': 'A',
            'Community': 'B+',
          },
          githubUrl: 'https://github.com/google/generative-ai-js',
          stars: 3200,
          forks: 320,
          lastCommit: new Date(),
        },
      ];

      return mockTools;
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);
      return [];
    }
  }

  async fetchRepositoryStats(owner: string, repo: string): Promise<Partial<AITool>> {
    try {
      // Mock repository stats
      return {
        stars: Math.floor(Math.random() * 10000) + 100,
        forks: Math.floor(Math.random() * 1000) + 10,
        lastCommit: new Date(),
      };
    } catch (error) {
      console.error(`Failed to fetch stats for ${owner}/${repo}:`, error);
      return {};
    }
  }

  async discoverEmergingTools(): Promise<AITool[]> {
    try {
      // Mock emerging tools
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
    } catch (error) {
      console.error('Failed to discover emerging tools:', error);
      return [];
    }
  }

  calculateToolGrades(repo: GitHubRepo): AITool['grades'] {
    const stars = repo.stargazers_count;
    const forks = repo.forks_count;
    const lastUpdated = new Date(repo.updated_at);
    const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

    // Calculate grades based on metrics
    const communityGrade = this.getGradeFromStars(stars);
    const efficiencyGrade = this.getGradeFromForks(forks);
    const speedGrade = this.getGradeFromActivity(daysSinceUpdate);

    return {
      'Barrier to Entry': 'B+', // Default - would analyze documentation
      'Cost': 'A', // Default - most open source tools are free
      'Efficiency': efficiencyGrade,
      'Speed': speedGrade,
      'Community': communityGrade,
    };
  }

  private getGradeFromStars(stars: number): string {
    if (stars >= 10000) return 'A+';
    if (stars >= 5000) return 'A';
    if (stars >= 2000) return 'A-';
    if (stars >= 1000) return 'B+';
    if (stars >= 500) return 'B';
    if (stars >= 200) return 'B-';
    if (stars >= 100) return 'C+';
    return 'C';
  }

  private getGradeFromForks(forks: number): string {
    if (forks >= 1000) return 'A+';
    if (forks >= 500) return 'A';
    if (forks >= 200) return 'A-';
    if (forks >= 100) return 'B+';
    if (forks >= 50) return 'B';
    if (forks >= 20) return 'B-';
    if (forks >= 10) return 'C+';
    return 'C';
  }

  private getGradeFromActivity(daysSinceUpdate: number): string {
    if (daysSinceUpdate <= 7) return 'A+';
    if (daysSinceUpdate <= 14) return 'A';
    if (daysSinceUpdate <= 30) return 'A-';
    if (daysSinceUpdate <= 60) return 'B+';
    if (daysSinceUpdate <= 90) return 'B';
    if (daysSinceUpdate <= 180) return 'B-';
    if (daysSinceUpdate <= 365) return 'C+';
    return 'C';
  }
}

export const githubService = new GitHubService();
