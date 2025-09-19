import { openDB } from 'idb';

class OfflineService {
  constructor() {
    this.db = null;
    this.dbName = 'IPICIADB';
    this.version = 1;

    // Retention policies
    this.retentionPolicies = {
      scanResults: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
      pendingSync: 7 * 24 * 60 * 60 * 1000,  // 7 days for sync queue
      userProfile: null, // Never expire user profiles
      settings: null     // Never expire settings
    };

    // Cleanup scheduling
    this.lastCleanup = null;
    this.cleanupInterval = 24 * 60 * 60 * 1000; // Run cleanup every 24 hours
  }

  async initialize() {
    try {
      this.db = await openDB(this.dbName, this.version, {
        upgrade(db) {
          // Scan results store
          if (!db.objectStoreNames.contains('scanResults')) {
            const scanStore = db.createObjectStore('scanResults', { keyPath: 'id' });
            scanStore.createIndex('timestamp', 'timestamp');
            scanStore.createIndex('category', 'category');
          }

          // Pending sync store
          if (!db.objectStoreNames.contains('pendingSync')) {
            const syncStore = db.createObjectStore('pendingSync', { keyPath: 'id' });
            syncStore.createIndex('timestamp', 'timestamp');
            syncStore.createIndex('type', 'type');
          }

          // Ingredient database cache
          if (!db.objectStoreNames.contains('ingredients')) {
            const ingredientStore = db.createObjectStore('ingredients', { keyPath: 'id' });
            ingredientStore.createIndex('name', 'name');
            ingredientStore.createIndex('category', 'category');
            ingredientStore.createIndex('synonyms', 'synonyms', { multiEntry: true });
          }

          // User profile store
          if (!db.objectStoreNames.contains('userProfile')) {
            db.createObjectStore('userProfile', { keyPath: 'id' });
          }

          // App settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
        }
      });

      console.log('OfflineService initialized');

      // Perform initial cleanup on startup
      await this.performCleanup();

      // Schedule periodic cleanup
      this.scheduleCleanup();

    } catch (error) {
      console.error('Failed to initialize OfflineService:', error);
      throw error;
    }
  }

  // Scan Results Management
  async saveScanResult(scanResult) {
    if (!this.db) await this.initialize();

    try {
      await this.db.put('scanResults', {
        ...scanResult,
        timestamp: scanResult.timestamp || new Date().toISOString(),
        synced: navigator.onLine
      });

      // If offline, queue for sync
      if (!navigator.onLine) {
        await this.queueForSync('scanResult', scanResult);
      }

      return scanResult.id;
    } catch (error) {
      console.error('Failed to save scan result:', error);
      throw error;
    }
  }

  async getScanResults(limit = 50, offset = 0) {
    if (!this.db) await this.initialize();

    try {
      const transaction = this.db.transaction(['scanResults'], 'readonly');
      const store = transaction.objectStore('scanResults');
      const index = store.index('timestamp');

      const results = [];
      let cursor = await index.openCursor(null, 'prev'); // Newest first
      let count = 0;

      while (cursor && count < offset + limit) {
        if (count >= offset) {
          results.push(cursor.value);
        }
        count++;
        cursor = await cursor.continue();
      }

      return results;
    } catch (error) {
      console.error('Failed to get scan results:', error);
      throw error;
    }
  }

  async getScanResult(id) {
    if (!this.db) await this.initialize();

    try {
      return await this.db.get('scanResults', id);
    } catch (error) {
      console.error('Failed to get scan result:', error);
      throw error;
    }
  }

  async deleteScanResult(id) {
    if (!this.db) await this.initialize();

    try {
      await this.db.delete('scanResults', id);
    } catch (error) {
      console.error('Failed to delete scan result:', error);
      throw error;
    }
  }

  // Ingredient Database Management
  async cacheIngredients(ingredients) {
    if (!this.db) await this.initialize();

    try {
      const transaction = this.db.transaction(['ingredients'], 'readwrite');
      const store = transaction.objectStore('ingredients');

      for (const ingredient of ingredients) {
        await store.put(ingredient);
      }

      await transaction.complete;
    } catch (error) {
      console.error('Failed to cache ingredients:', error);
      throw error;
    }
  }

  async findIngredient(name, category = null) {
    if (!this.db) await this.initialize();

    try {
      const transaction = this.db.transaction(['ingredients'], 'readonly');
      const store = transaction.objectStore('ingredients');

      // Try exact name match first
      let ingredient = await store.index('name').get(name.toLowerCase());

      // If not found, try synonym match
      if (!ingredient) {
        const synonymIndex = store.index('synonyms');
        ingredient = await synonymIndex.get(name.toLowerCase());
      }

      // Filter by category if specified
      if (ingredient && category && ingredient.categories && !ingredient.categories.includes(category)) {
        return null;
      }

      return ingredient;
    } catch (error) {
      console.error('Failed to find ingredient:', error);
      return null;
    }
  }

  // User Profile Management
  async saveUserProfile(profile) {
    if (!this.db) await this.initialize();

    try {
      await this.db.put('userProfile', {
        id: 'current',
        ...profile,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }

  async getUserProfile() {
    if (!this.db) await this.initialize();

    try {
      return await this.db.get('userProfile', 'current');
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  // Settings Management
  async saveSetting(key, value) {
    if (!this.db) await this.initialize();

    try {
      await this.db.put('settings', { key, value });
    } catch (error) {
      console.error('Failed to save setting:', error);
      throw error;
    }
  }

  async getSetting(key, defaultValue = null) {
    if (!this.db) await this.initialize();

    try {
      const setting = await this.db.get('settings', key);
      return setting ? setting.value : defaultValue;
    } catch (error) {
      console.error('Failed to get setting:', error);
      return defaultValue;
    }
  }

  // Sync Management
  async queueForSync(type, data) {
    if (!this.db) await this.initialize();

    try {
      const syncItem = {
        id: `${type}_${Date.now()}_${Math.random()}`,
        type,
        data,
        timestamp: new Date().toISOString(),
        retries: 0
      };

      await this.db.put('pendingSync', syncItem);

      // Register background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync-scan-results');
      }
    } catch (error) {
      console.error('Failed to queue for sync:', error);
    }
  }

  async syncWhenOnline() {
    if (!navigator.onLine || !this.db) return;

    try {
      const transaction = this.db.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');
      const pendingItems = await store.getAll();

      for (const item of pendingItems) {
        try {
          await this.syncItem(item);
          await this.db.delete('pendingSync', item.id);
        } catch (error) {
          console.error('Failed to sync item:', error);
          // Increment retry counter
          item.retries++;
          if (item.retries < 3) {
            await this.db.put('pendingSync', item);
          } else {
            // Remove after 3 failed attempts
            await this.db.delete('pendingSync', item.id);
          }
        }
      }
    } catch (error) {
      console.error('Sync process failed:', error);
    }
  }

  async syncItem(item) {
    // Implementation depends on your backend API
    // This is a placeholder for the actual sync logic
    console.log('Syncing item:', item.type, item.id);

    // Example: sync scan result to server
    if (item.type === 'scanResult') {
      // await fetch('/api/scan-results', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(item.data)
      // });
    }
  }

  // Storage Management
  async getStorageEstimate() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return await navigator.storage.estimate();
    }
    return null;
  }

  async clearStorage() {
    if (!this.db) return;

    try {
      const stores = ['scanResults', 'pendingSync', 'ingredients', 'userProfile', 'settings'];
      const transaction = this.db.transaction(stores, 'readwrite');

      for (const storeName of stores) {
        const store = transaction.objectStore(storeName);
        await store.clear();
      }

      await transaction.complete;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  // Data Retention and Cleanup Methods

  /**
   * Perform cleanup of expired data based on retention policies
   */
  async performCleanup() {
    if (!this.db) await this.initialize();

    try {
      const now = Date.now();
      let totalCleaned = 0;

      console.log('Starting data cleanup...');

      // Check if cleanup is needed (avoid running too frequently)
      const lastCleanupSetting = await this.getSetting('lastCleanup');
      if (lastCleanupSetting) {
        const lastCleanupTime = new Date(lastCleanupSetting).getTime();
        if (now - lastCleanupTime < this.cleanupInterval) {
          console.log('Skipping cleanup - ran recently');
          return { cleaned: 0, skipped: true };
        }
      }

      // Clean up each store according to its retention policy
      for (const [storeName, retentionMs] of Object.entries(this.retentionPolicies)) {
        if (retentionMs === null) continue; // Skip stores with no expiration

        const cleaned = await this.cleanupStore(storeName, retentionMs);
        totalCleaned += cleaned;
        console.log(`Cleaned ${cleaned} expired entries from ${storeName}`);
      }

      // Update last cleanup timestamp
      await this.saveSetting('lastCleanup', new Date().toISOString());
      this.lastCleanup = now;

      console.log(`Data cleanup completed. Total entries cleaned: ${totalCleaned}`);
      return { cleaned: totalCleaned, skipped: false };

    } catch (error) {
      console.error('Data cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Clean up expired entries from a specific store
   */
  async cleanupStore(storeName, retentionMs) {
    try {
      const cutoffTime = Date.now() - retentionMs;
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('timestamp');

      let cleanedCount = 0;
      let cursor = await index.openCursor(IDBKeyRange.upperBound(cutoffTime));

      while (cursor) {
        await cursor.delete();
        cleanedCount++;
        cursor = await cursor.continue();
      }

      await transaction.complete;
      return cleanedCount;

    } catch (error) {
      console.error(`Failed to cleanup ${storeName}:`, error);
      return 0;
    }
  }

  /**
   * Schedule periodic cleanup
   */
  scheduleCleanup() {
    // Clear any existing cleanup timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    // Schedule cleanup to run every 24 hours
    this.cleanupTimer = setInterval(async () => {
      try {
        await this.performCleanup();
      } catch (error) {
        console.error('Scheduled cleanup failed:', error);
      }
    }, this.cleanupInterval);

    console.log('Cleanup scheduler initialized - will run every 24 hours');
  }

  /**
   * Get storage statistics including expired entries
   */
  async getStorageStats() {
    if (!this.db) await this.initialize();

    try {
      const stats = {};
      const now = Date.now();

      for (const storeName of ['scanResults', 'pendingSync', 'ingredients', 'userProfile', 'settings']) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        const total = await store.count();
        let expired = 0;

        // Count expired entries if store has retention policy
        const retentionMs = this.retentionPolicies[storeName];
        if (retentionMs !== null) {
          const cutoffTime = now - retentionMs;
          const index = store.index('timestamp');
          expired = await index.count(IDBKeyRange.upperBound(cutoffTime));
        }

        stats[storeName] = {
          total,
          expired,
          retentionDays: retentionMs ? Math.floor(retentionMs / (24 * 60 * 60 * 1000)) : 'never'
        };
      }

      // Add cleanup info
      const lastCleanup = await this.getSetting('lastCleanup');
      stats.lastCleanup = lastCleanup || 'never';
      stats.nextCleanup = this.lastCleanup
        ? new Date(this.lastCleanup + this.cleanupInterval).toISOString()
        : 'next app restart';

      return stats;

    } catch (error) {
      console.error('Failed to get storage stats:', error);
      throw error;
    }
  }

  /**
   * Manually trigger cleanup (for testing or admin purposes)
   */
  async forceCleanup() {
    console.log('Forcing manual cleanup...');
    // Reset last cleanup time to force execution
    await this.saveSetting('lastCleanup', new Date(0).toISOString());
    return await this.performCleanup();
  }

  /**
   * Get retention policy information
   */
  getRetentionPolicies() {
    const policies = {};
    for (const [store, retentionMs] of Object.entries(this.retentionPolicies)) {
      policies[store] = retentionMs
        ? `${Math.floor(retentionMs / (24 * 60 * 60 * 1000))} days`
        : 'never expires';
    }
    return policies;
  }

  /**
   * Update retention policy for a store
   */
  updateRetentionPolicy(storeName, retentionDays) {
    if (retentionDays === null || retentionDays === 0) {
      this.retentionPolicies[storeName] = null;
    } else {
      this.retentionPolicies[storeName] = retentionDays * 24 * 60 * 60 * 1000;
    }
    console.log(`Updated retention policy for ${storeName}: ${retentionDays || 'never expires'} days`);
  }

  /**
   * Cleanup resources when service is destroyed
   */
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    console.log('OfflineService cleanup scheduler stopped');
  }
}

export const offlineService = new OfflineService();