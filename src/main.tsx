import { Buffer } from 'buffer';
window.Buffer = Buffer; // polyfill global Buffer in browser

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(<App />);
