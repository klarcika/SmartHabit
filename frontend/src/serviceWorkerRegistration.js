// frontend/src/serviceWorkerRegistration.js

// Enotna absolutna pot – Vite zgradi SW na /service-worker.js
const SW_URL = '/service-worker.js';

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(SW_URL)
        .then((registration) => {
          // (neobvezno) obvestilo ob update-u
          registration.onupdatefound = () => {
            const installing = registration.installing;
            if (!installing) return;
            installing.onstatechange = () => {
              if (
                installing.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.log('Nova verzija je na voljo (refresh).');
              }
            };
          };
        })
        .catch((err) => {
          console.error('SW registration failed:', err);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch((e) => console.error(e));
  }
}
