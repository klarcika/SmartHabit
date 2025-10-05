// src/offlineSync.js
import { openDB } from 'idb';

const DB_NAME = 'SmartHabit';
const STORE_NAME = 'queued-requests';
const VERSION = 1;

const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : '/api';

// Pretvori vse stare/različne oblike URL-jev v pravilno bazo (dev/prod)
function normalizeUrl(u) {
  if (!u) return API_BASE;

  // 1) Stari absolutni URL-ji na localhost
  const LOCAL = 'http://localhost:4000';
  if (u.startsWith(LOCAL)) {
    return API_BASE + u.slice(LOCAL.length); // ohrani /api/... del
  }

  // 2) Relativni /api/...  -> pripni bazo, če je potrebno
  if (u.startsWith('/api')) {
    return API_BASE === '/api' ? u : `${API_BASE}${u}`;
  }

  // 3) Relativni "api/..." (brez začetnega /)
  if (u.startsWith('api/')) {
    return `${API_BASE}/${u}`;
  }

  // 4) Drugi absolutni URL-ji – pusti pri miru
  return u;
}

// --- IndexedDB ---
async function initDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

// V čakalno vrsto (offline) – URL normaliziramo že ob dodajanju
async function queueRequest(requestData) {
  const db = await initDB();
  const toStore = {
    ...requestData,
    method: (requestData.method || 'GET').toUpperCase(),
    url: normalizeUrl(requestData.url),
    ts: Date.now(),
  };
  await db.add(STORE_NAME, toStore);
}

async function getQueuedRequests() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

async function clearQueuedRequest(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

// Sinhronizacija čakalne vrste – za vsak element še enkrat normaliziramo URL
async function syncRequests(getToken) {
  const token = await getToken?.();
  const queued = await getQueuedRequests();

  for (const req of queued) {
    const url = normalizeUrl(req.url);
    const headers = {
      'Authorization': token ? `Bearer ${token}` : undefined,
      ...(req.method !== 'DELETE' ? { 'Content-Type': 'application/json' } : {}),
    };
    // Odstrani undefined headerje
    Object.keys(headers).forEach(k => headers[k] === undefined && delete headers[k]);

    try {
      const init = {
        method: req.method,
        headers,
        body: (req.method === 'POST' || req.method === 'PUT') ? JSON.stringify(req.body) : undefined,
      };

      const res = await fetch(url, init);
      if (!res.ok) throw new Error(`Sync failed: ${res.status} ${res.statusText}`);

      await clearQueuedRequest(req.id);
    } catch (err) {
      console.error('Failed to sync request:', req, err);
      // Ustavi na prvem failu – naslednjič bomo ponovno poskusili
      break;
    }
  }
}

export { queueRequest, syncRequests };
