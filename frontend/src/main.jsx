import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Automatically clean up any leftover demo tasks from localStorage
try {
  const stored = localStorage.getItem('taskflow_local_tasks');
  if (stored) {
    const demoTitles = [
      'Setup TaskFlow SaaS Architecture',
      'Connect Firebase & Google OAuth',
      'Organize Tasks with Kanban Workflow',
    ];
    const parsed = JSON.parse(stored);
    const cleaned = (parsed || []).filter((t) => !demoTitles.includes(t.title));
    localStorage.setItem('taskflow_local_tasks', JSON.stringify(cleaned));
  }
} catch (e) {
  localStorage.removeItem('taskflow_local_tasks');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
