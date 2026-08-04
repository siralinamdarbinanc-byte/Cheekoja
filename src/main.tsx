import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Register Service Worker automatically for PWA offline capabilities
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New content available, updating service worker...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[PWA] CheKoja app is ready to operate offline.');
  },
  onRegisterError(error) {
    console.warn('[PWA] Service Worker registration error:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
