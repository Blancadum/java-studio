import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../data/types';

interface AuthContextType {
  // User & Profile
  userProfile: UserProfile | null;
  setUserProfile: (user: UserProfile | null) => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;

  // Drive & OAuth
  driveConnected: boolean;
  accessToken: string;
  userEmail: string;
  isDriveModalOpen: boolean;
  setIsDriveModalOpen: (isOpen: boolean) => void;

  // Actions
  handleConnectDrive: () => Promise<void>;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [driveConnected, setDriveConnected] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Listen for OAuth postMessage from popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const tokens = event.data.tokens;
        if (tokens?.access_token) {
          setAccessToken(tokens.access_token);
          setDriveConnected(true);

          // Fetch user info from Google
          try {
            const res = await fetch('/api/auth/user', {
              headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const userData = await res.json();
            if (userData.email) {
              setUserEmail(userData.email);
            }
          } catch (err) {
            console.error('Error fetching user info:', err);
          }

          // Automatically open the Drive modal after successful connection
          setIsDriveModalOpen(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectDrive = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();
      if (data.authUrl) {
        window.open(data.authUrl, 'GoogleAuth', 'width=600,height=700');
      } else {
        alert(
          data.error ||
            'No se pudo obtener la URL de OAuth. Verifica las claves OAUTH_CLIENT_ID y OAUTH_CLIENT_SECRET.'
        );
      }
    } catch (err: any) {
      console.error('Failed to initiate OAuth:', err);
      alert('Error al conectar con Google: ' + err.message);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUserProfile(null);
    setAccessToken('');
    setDriveConnected(false);
    setUserEmail('');
    setIsProfileModalOpen(false);
  }, []);

  const value: AuthContextType = {
    userProfile,
    setUserProfile,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    driveConnected,
    accessToken,
    userEmail,
    isDriveModalOpen,
    setIsDriveModalOpen,
    handleConnectDrive,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
