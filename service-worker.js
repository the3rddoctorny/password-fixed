/* service-worker.js */
const CACHE_VERSION = "v1.0.1"; // bump for fixed ordering
const CACHE_NAME = `pwa-password-fixed-${CACHE_VERSION}`;
const ASSETS = ["./","./index.html","./manifest.json","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):Promise.resolve()))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{ const req=e.request; if(new URL(req.url).origin===self.location.origin){ e.respondWith(caches.match(req).then(cached=>{ if(cached) return cached; return fetch(req).then(resp=>{ if(req.method==='GET' && resp.ok){ const copy=resp.clone(); caches.open(CACHE_NAME).then(c=>c.put(req, copy)); } return resp; }).catch(()=>{ if(req.mode==='navigate') return caches.match('./index.html'); }); })); }});
