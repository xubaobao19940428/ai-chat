/**
 * Native IndexedDB Storage Wrapper
 * 
 * Provides a promise-based interface for IndexedDB without external dependencies.
 */

const DB_NAME = 'AuraChatDB';
const DB_VERSION = 3; // Bump version to force upgrade if needed
const STORES = {
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations'
};

/**
 * Run a self-check to verify the DB is working
 */
async function runSelfCheck(db: IDBDatabase) {
  try {
    const tx = db.transaction(STORES.CONVERSATIONS, 'readwrite');
    const store = tx.objectStore(STORES.CONVERSATIONS);
    const testKey = '_self_check_';
    const testVal = Date.now();
    store.put(testVal, testKey);
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    
    console.log('[Storage] Self-check: Write successful');
    
    const readTx = db.transaction(STORES.CONVERSATIONS, 'readonly');
    const readStore = readTx.objectStore(STORES.CONVERSATIONS);
    const request = readStore.get(testKey);
    
    const result = await new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
    });
    
    if (result === testVal) {
      console.log('[Storage] Self-check: Read successful. DB is fully functional.');
    } else {
      console.error('[Storage] Self-check: Read failed or data mismatch.');
    }
  } catch (error) {
    console.error('[Storage] Self-check failed:', error);
  }
}

let hasChecked = false;

async function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[Storage] IndexedDB not available in this environment');
      return resolve(null as any);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      console.log(`[Storage] Upgrading DB to v${DB_VERSION}`);
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.MESSAGES)) db.createObjectStore(STORES.MESSAGES);
      if (!db.objectStoreNames.contains(STORES.CONVERSATIONS)) db.createObjectStore(STORES.CONVERSATIONS);
    };

    request.onsuccess = () => {
      const db = request.result;
      if (!hasChecked) {
        hasChecked = true;
        runSelfCheck(db);
      }
      resolve(db);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save messages for a specific conversation
 */
export async function saveLocalMessages(conversationId: string | number, messages: any[]) {
  if (!messages || messages.length === 0) return;
  
  try {
    const db = await getDB();
    if (!db) return;

    console.log(`[Storage] Saving ${messages.length} messages for conversation ${conversationId}`);
    const tx = db.transaction(STORES.MESSAGES, 'readwrite');
    const store = tx.objectStore(STORES.MESSAGES);
    
    // Create a plain copy to avoid observer proxy issues
    const cleanData = JSON.parse(JSON.stringify(messages));
    store.put(cleanData, String(conversationId));

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        console.log('[Storage] Messages saved successfully');
        resolve(true);
      };
      tx.onerror = () => {
        console.error('[Storage] Transaction error while saving messages:', tx.error);
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

    console.log(`[Storage] Fetching messages for conversation ${conversationId}`);
    const tx = db.transaction(STORES.MESSAGES, 'readonly');
    const store = tx.objectStore(STORES.MESSAGES);
    const request = store.get(String(conversationId));

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result || null;
        console.log(`[Storage] Loaded ${result ? result.length : 0} messages from cache`);
        resolve(result);
      };
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

    console.log(`[Storage] Saving conversation list (count: ${conversations.length})`);
    const tx = db.transaction(STORES.CONVERSATIONS, 'readwrite');
    const store = tx.objectStore(STORES.CONVERSATIONS);
    
    // Save metadata and a few recent messages for instant preview
    const listToSave = JSON.parse(JSON.stringify(conversations.map(c => ({
      ...c,
      messages: (c.messages || []).slice(-5)
    }))));
    
    store.put(listToSave, 'list');

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        console.log('[Storage] Conversation list saved successfully');
        resolve(true);
      };
      tx.onerror = () => {
        console.error('[Storage] Transaction error while saving list:', tx.error);
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

    console.log('[Storage] Fetching conversation list from cache');
    const tx = db.transaction(STORES.CONVERSATIONS, 'readonly');
    const store = tx.objectStore(STORES.CONVERSATIONS);
    const request = store.get('list');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result || null;
        console.log(`[Storage] Loaded ${result ? result.length : 0} conversations from cache`);
        resolve(result);
      };
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

    console.log(`[Storage] Deleting messages for conversation ${conversationId}`);
    const tx = db.transaction(STORES.MESSAGES, 'readwrite');
    const store = tx.objectStore(STORES.MESSAGES);
    store.delete(String(conversationId));
  } catch (error) {
    console.error('[Storage] Failed to delete local messages:', error);
  }
}
