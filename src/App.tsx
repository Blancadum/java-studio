import React from 'react';
import { WorkspaceProvider } from './components/home/WorkspaceContext';
import { AppContent } from './AppContent';

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
