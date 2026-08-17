import React from 'react';
import { LandingPage } from './LandingPage';
import { Campus } from '../components/home/Campus'; // Keep this import
import { JavaFile, StudentPersonaMode, PageType, SavedSession } from '../data/types'; // Import all necessary types, including PageType
interface HomeProps {
  // User State
  userProfile?: any | null;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;

  // Active Mode
  activeMode: StudentPersonaMode;
  onSelectMode: (mode: StudentPersonaMode) => void;

  // Analysis Workflow
  onStartAnalysis: (
    noFiles: JavaFile[],
    fixedFiles: JavaFile[],
    teacherDocContent: string,
    modeSpecificOptions: any
  ) => void;
  isAnalyzing: boolean;

  // Drive & Cloud
  onOpenDriveModal: () => void;
  driveConnected?: boolean;
  onConnectDrive?: () => void;

  // UI Actions
  onLoadSample: () => void;
  onOpenDemo?: () => void;
  onOpenTutorWithQuery?: (query: string) => void;

  // Session Management
  onLoadSession?: (session: SavedSession) => void; // Keep this
  onNavigateTo?: (page: PageType) => void; // Corrected type to PageType
}

export const HomePage: React.FC<HomeProps> = ({
  userProfile,
  activeMode,
  onSelectMode,
  onStartAnalysis,
  onOpenDriveModal,
  onLoadSample,
  isAnalyzing,
  onOpenAuth,
  onOpenTutorWithQuery,
  onOpenProfile,
  driveConnected,
  onConnectDrive,
  onLoadSession,
  onOpenDemo,
  onNavigateTo,
}) => {
  // RENDERIZAR CAMPUS SI ESTÁ AUTENTICADO
  if (userProfile) {
    return (
      <Campus
        user={userProfile}
        activeMode={activeMode}
        onSelectMode={onSelectMode}
        onOpenDriveModal={onOpenDriveModal}
        onLoadSample={onLoadSample}
        onOpenProfile={onOpenProfile}
        driveConnected={driveConnected}
        onConnectDrive={onConnectDrive}
        onOpenTutorWithQuery={onOpenTutorWithQuery}
        onStartAnalysis={onStartAnalysis}
        onLoadSession={onLoadSession}
      />

    );
  }

  // RENDERIZAR LANDING PAGE SI NO ESTÁ AUTENTICADO (o si la ruta es 'home')
  return (
    <LandingPage
      userProfile={userProfile}
      onLoadSample={onLoadSample}
      onOpenAuth={onOpenAuth}
      onNavigateTo={onNavigateTo || (() => {})} // Ensure onNavigateTo is always a function
    />
  );
};
