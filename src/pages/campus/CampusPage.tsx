import React from 'react';
import { JavaFile, StudentPersonaMode, UserProfile, SavedSession } from '../../data/types';
import { Campus } from '../../components/campus/Campus';

interface CampusPageProps {
  // Auth
  userProfile: UserProfile | null;
  driveConnected: boolean;
  onConnectDrive: () => void;
  onOpenProfile: () => void;

  // Analysis
  activeMode: StudentPersonaMode;
  onSelectMode: (mode: StudentPersonaMode) => void;
  onStartAnalysis: (
    noFiles: JavaFile[],
    fixedFiles: JavaFile[],
    teacherDocContent: string,
    modeSpecificOptions: any
  ) => void;
  onLoadSample: () => void;
  onLoadSession: (session: SavedSession) => void;

  // Modals
  onOpenDriveModal: () => void;
  onOpenTutorWithQuery: (query: string) => void;
  navigateToApp: (mode: StudentPersonaMode) => void;
}

export const CampusPage: React.FC<CampusPageProps> = (props) => {
  if (!props.userProfile) {
    // Idealmente, el PageRenderer no debería mostrar esta página si no hay usuario.
    // Esto es solo una salvaguarda.
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p>Debes iniciar sesión para acceder al campus.</p>
      </div>
    );
  }

  return <Campus user={props.userProfile} {...props} />;
};