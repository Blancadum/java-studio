import React from 'react';
import { DrivePickerModal } from './drivePicker/DrivePickerModal';
import { AuthModal } from './authModal/AuthModal';
import { UserProfileModal } from './userProfile/UserProfileModal';
import { UserProfile, SavedSession, JavaFile, AnalysisResult } from '../data/types';

interface GlobalModalsProps {
  // Auth & Profile State
  userProfile: UserProfile | null;
  setUserProfile: (user: UserProfile | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  handleLoadSavedSession: (session: SavedSession) => void;

  // Drive State
  accessToken: string;
  isDriveModalOpen: boolean;
  setIsDriveModalOpen: (isOpen: boolean) => void;
  driveConnected: boolean;
  handleConnectDrive: () => void;

  // Workspace & Analysis State for Modals
  setNoFiles: (files: JavaFile[]) => void;
  setFixedFiles: (files: JavaFile[]) => void;
  setTeacherDoc: (doc: string) => void;
  tutorModalQuery: string | null;
  setTutorModalQuery: (query: string | null) => void;
}

export const GlobalModals: React.FC<GlobalModalsProps> = (props) => {
  const {
    userProfile, setUserProfile, isAuthModalOpen, setIsAuthModalOpen,
    isProfileModalOpen, setIsProfileModalOpen, handleLogout, handleLoadSavedSession,
    accessToken, isDriveModalOpen, setIsDriveModalOpen, driveConnected, handleConnectDrive,
    setNoFiles, setFixedFiles, setTeacherDoc, // These are from useWorkspace, passed from AppContent
    tutorModalQuery, setTutorModalQuery, // These are from useAnalysis, passed from AppContent
  } = props;

  return (
    <>
      {/* Drive Explorer Modal */}
      <DrivePickerModal
        accessToken={accessToken}
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onImportFiles={(importedNo, importedFixed, importedTeacher) => {
          if (importedNo.length > 0) setNoFiles(importedNo);
          if (importedFixed.length > 0) setFixedFiles(importedFixed);
          if (importedTeacher) setTeacherDoc(importedTeacher);
          setIsDriveModalOpen(false);
          alert('¡Archivos importados con éxito desde Google Drive!');
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setUserProfile(user)}
        onConnectDrive={handleConnectDrive}
      />

      {/* User Profile & AI Key Config Modal */}
      {userProfile && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={userProfile}
          onUpdateUser={(updated) => setUserProfile(updated)}
          onLoadSavedSession={handleLoadSavedSession}
          onLogout={handleLogout}
          driveConnected={driveConnected}
          onConnectDrive={handleConnectDrive}
          onOpenDriveModal={() => setIsDriveModalOpen(true)}
        />
      )}
    </>
  );
};