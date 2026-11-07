import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Purge any legacy cache keys from earlier sessions so website starts completely fresh
try {
  const legacyKeys = [
    'grantly_profile_storage',
    'grantly_profile_storage_v2',
    'grantly_profile_storage_v3',
    'grantly_documents_storage',
    'grantly_applications_storage',
    'grantly_scholarships_storage'
  ];
  for (const k of legacyKeys) {
    localStorage.removeItem(k);
  }
} catch {
  // Ignore localStorage errors in private or sandboxed environments
}

createRoot(document.getElementById('root')!).render(<App />);
