
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

const rootElement = document.getElementById('root');

// Bail early if Vite didn't give us a root (saves noisy runtime errors)
if (!rootElement) {
  throw new Error('Root element not found');
}

// Kick off the React tree
createRoot(rootElement).render(<App />);
