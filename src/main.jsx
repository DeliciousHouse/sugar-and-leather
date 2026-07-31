import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { installConsoleCapture } from './lib/consoleCapture';
import './styles/tokens.css';
import './styles/site.css';
import './styles/responsive.css';

// Wrap console.error before the app mounts so errors thrown during the very first
// render are still in the buffer if the visitor files a report about them.
installConsoleCapture();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
