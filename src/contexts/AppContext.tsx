import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { NewsItem } from '../types/NewsItem';
import { AITool } from '../types/AITool';
import { CryptoData } from '../types/CryptoData';
import { CreativeContent } from '../types/CreativeContent';
import { UserPreferences, SavedItem } from '../types/UserPreferences';
import { rssService } from '../services/rssService';
import { githubService } from '../services/githubService';
import { cryptoService } from '../services/cryptoService';
import { storageService } from '../services/storageService';
import { schedulerService } from '../services/schedulerService';

interface AppState {
  // Content
  aiNews: NewsItem[];
  startupNews: NewsItem[];
  cryptoNews: NewsItem[];
  aiTools: { [category: string]: AITool[] };
  emergingTools: AITool[];
  cryptoData: CryptoData[];
  creativeContent: CreativeContent[];
  
  // User data
  savedItems: SavedItem[];
  preferences: UserPreferences;
  
  // UI state
  loading: {
    aiNews: boolean;
    startupNews: boolean;
    cryptoNews: boolean;
    aiTools: boolean;
    cryptoData: boolean;
    creativeContent: boolean;
  };
  
  errors: {
    aiNews: string | null;
    startupNews: string | null;
    cryptoNews: string | null;
    aiTools: string | null;
    cryptoData: string | null;
    creativeContent: string | null;
  };
  
  lastUpdated: {
    aiNews: Date | null;
    startupNews: Date | null;
    cryptoNews: Date | null;
    aiTools: Date | null;
    cryptoData: Date | null;
    creativeContent: Date | null;
  };
}

type AppAction =
  | { type: 'SET_LOADING'; section: keyof AppState['loading']; loading: boolean }
  | { type: 'SET_ERROR'; section: keyof AppState['errors']; error: string | null }
  | { type: 'SET_AI_NEWS'; news: NewsItem[] }
  | { type: 'SET_STARTUP_NEWS'; news: NewsItem[] }
  | { type: 'SET_CRYPTO_NEWS'; news: NewsItem[] }
  | { type: 'SET_AI_TOOLS'; tools: { [category: string]: AITool[] } }
  | { type: 'SET_EMERGING_TOOLS'; tools: AITool[] }
  | { type: 'SET_CRYPTO_DATA'; data: CryptoData[] }
  | { type: 'SET_CREATIVE_CONTENT'; content: CreativeContent[] }
  | { type: 'SET_SAVED_ITEMS'; items: SavedItem[] }
  | { type: 'ADD_SAVED_ITEM'; item: SavedItem }
  | { type: 'REMOVE_SAVED_ITEM'; id: string }
  | { type: 'UPDATE_PREFERENCES'; preferences: UserPreferences }
  | { type: 'SET_LAST_UPDATED'; section: keyof AppState['lastUpdated']; timestamp: Date };

const initialState: AppState = {
  aiNews: [],
  startupNews: [],
  cryptoNews: [],
  aiTools: {},
  emergingTools: [],
  cryptoData: [],
  creativeContent: [],
  savedItems: [],
  preferences: storageService.getUserPreferences(),
  loading: {
    aiNews: false,
    startupNews: false,
    cryptoNews: false,
    aiTools: false,
    cryptoData: false,
    creativeContent: false,
  },
  errors: {
    aiNews: null,
    startupNews: null,
    cryptoNews: null,
    aiTools: null,
    cryptoData: null,
    creativeContent: null,
  },
  lastUpdated: {
    aiNews: null,
    startupNews: null,
    cryptoNews: null,
    aiTools: null,
    cryptoData: null,
    creativeContent: null,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.section]: action.loading },
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.section]: action.error },
      };
    
    case 'SET_AI_NEWS':
      return { ...state, aiNews: action.news };
    
    case 'SET_STARTUP_NEWS':
      return { ...state, startupNews: action.news };
    
    case 'SET_CRYPTO_NEWS':
      return { ...state, cryptoNews: action.news };
    
    case 'SET_AI_TOOLS':
      return { ...state, aiTools: action.tools };
    
    case 'SET_EMERGING_TOOLS':
      return { ...state, emergingTools: action.tools };
    
    case 'SET_CRYPTO_DATA':
      return { ...state, cryptoData: action.data };
    
    case 'SET_CREATIVE_CONTENT':
      return { ...state, creativeContent: action.content };
    
    case 'SET_SAVED_ITEMS':
      return { ...state, savedItems: action.items };
    
    case 'ADD_SAVED_ITEM':
      return { ...state, savedItems: [action.item, ...state.savedItems] };
    
    case 'REMOVE_SAVED_ITEM':
      return {
        ...state,
        savedItems: state.savedItems.filter(item => item.id !== action.id),
      };
    
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: action.preferences };
    
    case 'SET_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: { ...state.lastUpdated, [action.section]: action.timestamp },
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  actions: {
    refreshAINews: () => Promise<void>;
    refreshStartupNews: () => Promise<void>;
    refreshCryptoNews: () => Promise<void>;
    refreshAITools: () => Promise<void>;
    refreshCryptoData: () => Promise<void>;
    refreshCreativeContent: () => Promise<void>;
    refreshAllContent: () => Promise<void>;
    saveItem: (item: SavedItem) => void;
    removeSavedItem: (id: string) => void;
    updatePreferences: (preferences: UserPreferences) => void;
    isItemSaved: (id: string) => boolean;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved items on mount
  useEffect(() => {
    const savedItems = storageService.getSavedArticles();
    dispatch({ type: 'SET_SAVED_ITEMS', items: savedItems });
  }, []);

  const setLoading = (section: keyof AppState['loading'], loading: boolean) => {
    dispatch({ type: 'SET_LOADING', section, loading });
  };

  const setError = (section: keyof AppState['errors'], error: string | null) => {
    dispatch({ type: 'SET_ERROR', section, error });
  };

  const setLastUpdated = (section: keyof AppState['lastUpdated']) => {
    dispatch({ type: 'SET_LAST_UPDATED', section, timestamp: new Date() });
  };

  const actions = {
    async refreshAINews() {
      setLoading('aiNews', true);
      setError('aiNews', null);
      
      try {
        const response = await rssService.fetchAITechNews();
        dispatch({ type: 'SET_AI_NEWS', news: response.items });
        setLastUpdated('aiNews');
      } catch (error) {
        setError('aiNews', 'Failed to load AI news');
        console.error('AI News refresh error:', error);
      } finally {
        setLoading('aiNews', false);
      }
    },

    async refreshStartupNews() {
      setLoading('startupNews', true);
      setError('startupNews', null);
      
      try {
        const response = await rssService.fetchStartupNews();
        dispatch({ type: 'SET_STARTUP_NEWS', news: response.items });
        setLastUpdated('startupNews');
      } catch (error) {
        setError('startupNews', 'Failed to load startup news');
        console.error('Startup News refresh error:', error);
      } finally {
        setLoading('startupNews', false);
      }
    },

    async refreshCryptoNews() {
      setLoading('cryptoNews', true);
      setError('cryptoNews', null);
      
      try {
        const response = await rssService.fetchCryptoNews();
        dispatch({ type: 'SET_CRYPTO_NEWS', news: response.items });
        setLastUpdated('cryptoNews');
      } catch (error) {
        setError('cryptoNews', 'Failed to load crypto news');
        console.error('Crypto News refresh error:', error);
      } finally {
        setLoading('cryptoNews', false);
      }
    },

    async refreshAITools() {
      setLoading('aiTools', true);
      setError('aiTools', null);
      
      try {
        const [textGenTools, emergingTools] = await Promise.all([
          githubService.searchAIRepositories('Text Generation'),
          githubService.discoverEmergingTools(),
        ]);
        
        dispatch({ 
          type: 'SET_AI_TOOLS', 
          tools: { 'Text Generation': textGenTools }
        });
        dispatch({ type: 'SET_EMERGING_TOOLS', tools: emergingTools });
        setLastUpdated('aiTools');
      } catch (error) {
        setError('aiTools', 'Failed to load AI tools');
        console.error('AI Tools refresh error:', error);
      } finally {
        setLoading('aiTools', false);
      }
    },

    async refreshCryptoData() {
      setLoading('cryptoData', true);
      setError('cryptoData', null);
      
      try {
        const cryptos = await cryptoService.fetchTopCryptos(3);
        dispatch({ type: 'SET_CRYPTO_DATA', data: cryptos });
        setLastUpdated('cryptoData');
      } catch (error) {
        setError('cryptoData', 'Failed to load crypto data');
        console.error('Crypto Data refresh error:', error);
      } finally {
        setLoading('cryptoData', false);
      }
    },

    async refreshCreativeContent() {
      setLoading('creativeContent', true);
      setError('creativeContent', null);
      
      try {
        // Mock creative content for now
        const mockContent: CreativeContent[] = [
          {
            id: 'creative-1',
            type: 'image',
            title: 'AI-Generated Art Trends',
            description: 'Latest trends in AI-generated artwork',
            imageUrl: 'photo-1526374965328-7f61d4dc18c5',
            category: 'Design',
            createdAt: new Date(),
          },
          {
            id: 'creative-2',
            type: 'quote',
            content: 'The future belongs to those who learn more skills and combine them in creative ways.',
            author: 'Robert Greene',
            category: 'Innovation',
            createdAt: new Date(),
          },
        ];
        
        dispatch({ type: 'SET_CREATIVE_CONTENT', content: mockContent });
        setLastUpdated('creativeContent');
      } catch (error) {
        setError('creativeContent', 'Failed to load creative content');
        console.error('Creative Content refresh error:', error);
      } finally {
        setLoading('creativeContent', false);
      }
    },

    async refreshAllContent() {
      await Promise.all([
        actions.refreshAINews(),
        actions.refreshStartupNews(),
        actions.refreshCryptoNews(),
        actions.refreshAITools(),
        actions.refreshCryptoData(),
        actions.refreshCreativeContent(),
      ]);
    },

    saveItem(item: SavedItem) {
      storageService.saveArticle(item);
      dispatch({ type: 'ADD_SAVED_ITEM', item });
    },

    removeSavedItem(id: string) {
      storageService.removeSavedArticle(id);
      dispatch({ type: 'REMOVE_SAVED_ITEM', id });
    },

    updatePreferences(preferences: UserPreferences) {
      storageService.setUserPreferences(preferences);
      dispatch({ type: 'UPDATE_PREFERENCES', preferences });
    },

    isItemSaved(id: string): boolean {
      return state.savedItems.some(item => item.id === id);
    },
  };

  // Initial data load and scheduler setup
  useEffect(() => {
    // Load initial content
    actions.refreshAllContent();
    
    // Set up automatic refresh schedules
    schedulerService.setupCyberPressSchedules(actions);
    
    // Cleanup on unmount
    return () => {
      schedulerService.clearAllSchedules();
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
