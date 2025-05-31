
class SchedulerService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private refreshCallbacks: Map<string, () => Promise<void>> = new Map();

  constructor() {
    // Clean up expired cache on startup
    this.scheduleCleanup();
  }

  scheduleRefresh(
    key: string,
    callback: () => Promise<void>,
    intervalMs: number
  ): void {
    // Clear existing interval if it exists
    this.clearSchedule(key);

    // Store callback
    this.refreshCallbacks.set(key, callback);

    // Set up new interval
    const interval = setInterval(async () => {
      try {
        console.log(`Scheduled refresh: ${key}`);
        await callback();
      } catch (error) {
        console.error(`Scheduled refresh failed for ${key}:`, error);
      }
    }, intervalMs);

    this.intervals.set(key, interval);
    console.log(`Scheduled refresh for ${key} every ${intervalMs}ms`);
  }

  scheduleDailyRefresh(
    key: string,
    callback: () => Promise<void>,
    hour = 8,
    minute = 0
  ): void {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(hour, minute, 0, 0);

    // If target time has passed today, schedule for tomorrow
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const msUntilFirst = targetTime.getTime() - now.getTime();
    const msPerDay = 24 * 60 * 60 * 1000;

    // Schedule first execution
    setTimeout(() => {
      callback();
      // Then schedule daily repeats
      this.scheduleRefresh(key, callback, msPerDay);
    }, msUntilFirst);

    console.log(`Scheduled daily refresh for ${key} at ${hour}:${minute.toString().padStart(2, '0')}`);
  }

  scheduleWeeklyRefresh(
    key: string,
    callback: () => Promise<void>,
    dayOfWeek = 0, // 0 = Sunday
    hour = 8,
    minute = 0
  ): void {
    const now = new Date();
    const targetTime = new Date(now);
    
    // Calculate days until next target day
    const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
    targetTime.setDate(now.getDate() + daysUntilTarget);
    targetTime.setHours(hour, minute, 0, 0);

    // If target time has passed this week, schedule for next week
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 7);
    }

    const msUntilFirst = targetTime.getTime() - now.getTime();
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;

    // Schedule first execution
    setTimeout(() => {
      callback();
      // Then schedule weekly repeats
      this.scheduleRefresh(key, callback, msPerWeek);
    }, msUntilFirst);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    console.log(`Scheduled weekly refresh for ${key} on ${dayNames[dayOfWeek]} at ${hour}:${minute.toString().padStart(2, '0')}`);
  }

  manualRefresh(key: string): Promise<void> {
    const callback = this.refreshCallbacks.get(key);
    if (callback) {
      console.log(`Manual refresh triggered for ${key}`);
      return callback();
    } else {
      console.warn(`No refresh callback found for ${key}`);
      return Promise.resolve();
    }
  }

  clearSchedule(key: string): void {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
      console.log(`Cleared schedule for ${key}`);
    }
  }

  clearAllSchedules(): void {
    for (const [key, interval] of this.intervals) {
      clearInterval(interval);
      console.log(`Cleared schedule for ${key}`);
    }
    this.intervals.clear();
    this.refreshCallbacks.clear();
  }

  getScheduleStatus(): { [key: string]: { scheduled: boolean; lastRun?: Date } } {
    const status: { [key: string]: { scheduled: boolean; lastRun?: Date } } = {};
    
    for (const key of this.refreshCallbacks.keys()) {
      status[key] = {
        scheduled: this.intervals.has(key),
        // In a real implementation, you'd track last run times
        lastRun: undefined,
      };
    }
    
    return status;
  }

  private scheduleCleanup(): void {
    // Clean up expired cache every hour
    this.scheduleRefresh('cache-cleanup', async () => {
      const { storageService } = await import('./storageService');
      storageService.clearExpiredCache();
    }, 60 * 60 * 1000); // 1 hour
  }

  // Helper method to set up all CyberPress schedules
  setupCyberPressSchedules(refreshActions: {
    refreshAINews: () => Promise<void>;
    refreshStartupNews: () => Promise<void>;
    refreshCryptoNews: () => Promise<void>;
    refreshAITools: () => Promise<void>;
    refreshCryptoData: () => Promise<void>;
    refreshCreativeContent: () => Promise<void>;
  }): void {
    // Daily content refreshes at 8am PST
    this.scheduleDailyRefresh('ai-news', refreshActions.refreshAINews, 8, 0);
    this.scheduleDailyRefresh('startup-news', refreshActions.refreshStartupNews, 8, 0);
    this.scheduleDailyRefresh('crypto-news', refreshActions.refreshCryptoNews, 8, 0);
    this.scheduleDailyRefresh('creative-content', refreshActions.refreshCreativeContent, 8, 0);

    // Weekly AI tools refresh on Sunday at 8am PST
    this.scheduleWeeklyRefresh('ai-tools', refreshActions.refreshAITools, 0, 8, 0);

    // Hourly crypto data refresh
    this.scheduleRefresh('crypto-data', refreshActions.refreshCryptoData, 60 * 60 * 1000);

    console.log('CyberPress refresh schedules initialized');
  }
}

export const schedulerService = new SchedulerService();
