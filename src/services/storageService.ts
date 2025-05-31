
import { UserPreferences, SavedItem } from '../types/UserPreferences';

class StorageService {
  private storagePrefix = 'cyberpress_';

  // Generic storage methods
  private setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(
        this.storagePrefix + key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.storagePrefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(this.storagePrefix + key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  // User preferences
  setUserPreferences(preferences: UserPreferences): void {
    this.setItem('preferences', preferences);
  }

  getUserPreferences(): UserPreferences {
    return this.getItem('preferences', {
      theme: 'dark',
      refreshFrequency: 'daily',
      categories: {
        aiNews: true,
        startupNews: true,
        crypto: true,
        creative: true,
      },
      sources: {
        trusted: [],
        blocked: [],
      },
      notifications: {
        newContent: true,
        priceAlerts: false,
      },
    });
  }

  // Saved items
  saveArticle(item: SavedItem): void {
    const savedItems = this.getSavedArticles();
    const existingIndex = savedItems.findIndex(saved => saved.id === item.id);
    
    if (existingIndex >= 0) {
      savedItems[existingIndex] = item;
    } else {
      savedItems.unshift(item); // Add to beginning
    }
    
    this.setItem('saved_articles', savedItems);
  }

  getSavedArticles(): SavedItem[] {
    return this.getItem('saved_articles', []);
  }

  removeSavedArticle(id: string): void {
    const savedItems = this.getSavedArticles();
    const filtered = savedItems.filter(item => item.id !== id);
    this.setItem('saved_articles', filtered);
  }

  isArticleSaved(id: string): boolean {
    const savedItems = this.getSavedArticles();
    return savedItems.some(item => item.id === id);
  }

  updateReadStatus(id: string, status: 'read' | 'unread'): void {
    const savedItems = this.getSavedArticles();
    const item = savedItems.find(saved => saved.id === id);
    
    if (item) {
      item.readStatus = status;
      this.setItem('saved_articles', savedItems);
    }
  }

  // Content caching
  cacheContent<T>(key: string, data: T, expiryHours = 1): void {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + (expiryHours * 60 * 60 * 1000),
    };
    
    this.setItem(`cache_${key}`, cacheItem);
  }

  getCachedContent<T>(key: string): T | null {
    const cacheItem = this.getItem(`cache_${key}`, null);
    
    if (!cacheItem || Date.now() > cacheItem.expires) {
      this.removeItem(`cache_${key}`);
      return null;
    }
    
    return cacheItem.data;
  }

  clearExpiredCache(): void {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => 
      key.startsWith(this.storagePrefix + 'cache_')
    );
    
    cacheKeys.forEach(key => {
      const cacheItem = this.getItem(key.replace(this.storagePrefix, ''), null);
      if (cacheItem && Date.now() > cacheItem.expires) {
        localStorage.removeItem(key);
      }
    });
  }

  // Statistics
  getStorageStats(): {
    savedItems: number;
    cacheSize: number;
    storageUsed: string;
  } {
    const savedItems = this.getSavedArticles().length;
    const keys = Object.keys(localStorage);
    const cypressKeys = keys.filter(key => key.startsWith(this.storagePrefix));
    
    let totalSize = 0;
    cypressKeys.forEach(key => {
      totalSize += localStorage.getItem(key)?.length || 0;
    });
    
    return {
      savedItems,
      cacheSize: cypressKeys.filter(key => key.includes('cache_')).length,
      storageUsed: `${Math.round(totalSize / 1024)} KB`,
    };
  }

  // Cleanup
  clearAllData(): void {
    const keys = Object.keys(localStorage);
    const cypressKeys = keys.filter(key => key.startsWith(this.storagePrefix));
    cypressKeys.forEach(key => localStorage.removeItem(key));
  }
}

export const storageService = new StorageService();
