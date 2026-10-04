// Lantern Road offline cache. Bump VERSION when you upload a new build.
// The page and app settings are fetched from the network first (so updates show up right away);
// everything else is served from the cache first. The cache is the fallback when offline.
const VERSION='lantern-road-v26';
const CORE=['./','./index.html','./manifest.webmanifest?v=6','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const fresh=req=>{const u=new URL(req.url);return req.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html')||u.pathname.endsWith('.webmanifest');};
const put=(req,r)=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));}return r;};
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  if(fresh(e.request)){e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>put(e.request,r)).catch(()=>caches.match(e.request)));return;}
  e.respondWith(caches.match(e.request).then(hit=>{const net=fetch(e.request).then(r=>put(e.request,r)).catch(()=>hit);return hit||net;}));});
