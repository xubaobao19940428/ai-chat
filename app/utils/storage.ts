/**
 * Native IndexedDB Storage Wrapper
 * 
 * Provides a promise-based interface for IndexedDB without external dependencies.
 * Uses connection caching for performance.
 */

const DB_NAME = 'AuraChatDB';
const DB_VERSION = 3;
const STORES = {
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations'
};

// Cached DB connection
let _dbInstance: IDBDatabase | null = null;
let _dbPromise: Promise<IDBDatabase> | null = null;

async function getDB(): Promise<IDBDatabase> {
  // Return cached instance if still open
  if (_dbInstance) return _dbInstance;
  // Avoid concurrent open requests
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return resolve(null as any);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.MESSAGES)) db.createObjectStore(STORES.MESSAGES);
      if (!db.objectStoreNames.contains(STORES.CONVERSATIONS)) db.createObjectStore(STORES.CONVERSATIONS);
    };

    request.onsuccess = () => {
      const db = request.result;
      // Clear cache if the connection closes unexpectedly
      db.onclose = () => { _dbInstance = null; _dbPromise = null; };
      db.onversionchange = () => { db.close(); _dbInstance = null; _dbPromise = null; };
      _dbInstance = db;
      _dbPromise = null;
      resolve(db);
    };
    request.onerror = () => {
      _dbPromise = null;
      reject(request.error);
    };
  });

  return _dbPromise;
}

/**
 * Save messages for a specific conversation
 */
export async function saveLocalMessages(conversationId: string | number, messages: any[]) {
  if (!messages || messages.length === 0) return;
  
  try {
    const db = await getDB();
    if (!db) return;

    const tx = db.transaction(STORES.MESSAGES, 'readwrite');
    const store = tx.objectStore(STORES.MESSAGES);
    
    // JSON round-trip to strip Vue reactive proxies (structuredClone can't handle them)
    const cleanData = JSON.parse(JSON.stringify(messages));
    store.put(cleanData, String(conversationId));

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        console.error('[Storage] Error saving messages:', tx.error);
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error('[Storage] Failed to save local messages:', error);
  }
}

/**
 * Get cached messages for a specific conversation
 */
export async function getLocalMessages(conversationId: string | number): Promise<any[] | null> {
  try {
    const db = await getDB();
    if (!db) return null;

    const tx = db.transaction(STORES.MESSAGES, 'readonly');
    const store = tx.objectStore(STORES.MESSAGES);
    const request = store.get(String(conversationId));

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        console.error('[Storage] Error fetching messages:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Storage] Failed to get local messages:', error);
    return null;
  }
}

/**
 * Save conversation list
 */
export async function saveLocalConversations(conversations: any[]) {
  if (!conversations || conversations.length === 0) return;

  try {
    const db = await getDB();
    if (!db) return;

    const tx = db.transaction(STORES.CONVERSATIONS, 'readwrite');
    const store = tx.objectStore(STORES.CONVERSATIONS);
    
    // JSON round-trip to strip Vue reactive proxies
    const listToSave = JSON.parse(JSON.stringify(conversations.map(c => ({
      ...c,
      messages: (c.messages || []).slice(-5)
    }))));
    
    store.put(listToSave, 'list');

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        console.error('[Storage] Error saving conversation list:', tx.error);
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error('[Storage] Failed to save local conversations:', error);
  }
}

/**
 * Get cached conversation list
 */
export async function getLocalConversations(): Promise<any[] | null> {
  try {
    const db = await getDB();
    if (!db) return null;

    const tx = db.transaction(STORES.CONVERSATIONS, 'readonly');
    const store = tx.objectStore(STORES.CONVERSATIONS);
    const request = store.get('list');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        console.error('[Storage] Error fetching list:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('[Storage] Failed to get local conversations:', error);
    return null;
  }
}

/**
 * Delete cached messages for a conversation
 */
export async function deleteLocalMessages(conversationId: string | number) {
  try {
    const db = await getDB();
    if (!db) return;

    const tx = db.transaction(STORES.MESSAGES, 'readwrite');
    const store = tx.objectStore(STORES.MESSAGES);
    store.delete(String(conversationId));
  } catch (error) {
    console.error('[Storage] Failed to delete local messages:', error);
  }
}
