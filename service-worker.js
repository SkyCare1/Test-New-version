/* Service Support Center PWA service worker — v56 */
'use strict';

const VERSION = '20260728-mx-tcs-visible-v3';
const STATIC_CACHE = 'ssc-static-' + VERSION;
const PAGE_CACHE = 'ssc-pages-' + VERSION;

/* Icons are intentionally stored at the repository root. This makes GitHub
   Pages deployment less error-prone when users upload files individually. */
const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './assets/dashboard.min.css?v=' + VERSION,
  './assets/dashboard.js?v=' + VERSION,
  './assets/tcs-mx-live.css?v=' + VERSION,
  './assets/tcs-mx-live.js?v=' + VERSION,
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => Promise.allSettled(
        APP_SHELL.map(url => cache.add(new Request(url, { cache: 'reload' })))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('ssc-') && ![STATIC_CACHE, PAGE_CACHE].includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isLiveDataRequest(url, request) {
  const path = url.pathname.toLowerCase();
  if (request.cache === 'no-store') return true;
  return path.includes('/data/') || /\.(json|csv|xlsx?|xlsb|xlsm)(?:$|\?)/i.test(url.href);
}

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      await Promise.allSettled([
        cache.put(request, response.clone()),
        cache.put('./index.html', response.clone())
      ]);
    }
    return response;
  } catch (_error) {
    return (await caches.match(request)) ||
      (await caches.match('./index.html')) ||
      (await caches.match('./offline.html'));
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request, { ignoreSearch: false });
  const network = fetch(request)
    .then(async response => {
      if (response && response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  /* Never serve stale operational data from the PWA cache. */
  if (isLiveDataRequest(url, request)) {
    event.respondWith(fetch(request));
    return;
  }

  if (['style', 'script', 'image', 'font', 'manifest'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
