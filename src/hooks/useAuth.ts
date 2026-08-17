import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../data/types';

export function useAuth() {
  // User Auth & Modals
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Drive & OAuth State
  const [driveConnected, setDriveConnected] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);

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
              headers: { Authorization: `Bearer ${tokens.access_token}` }
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
  }, [setAccessToken, setDriveConnected, setUserEmail, setIsDriveModalOpen]);

  const handleConnectDrive = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();
      if (data.authUrl) {
        window.open(data.authUrl, 'GoogleAuth', 'width=600,height=700');
      } else {
        alert(data.error || 'No se pudo obtener la URL de OAuth. Verifica las claves OAUTH_CLIENT_ID y OAUTH_CLIENT_SECRET.');
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
    // Note: navigation is handled in AppContent
  }, []);

  return {
    userProfile,
    setUserProfile,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    driveConnected,
    setDriveConnected,
    accessToken,
    setAccessToken,
    userEmail,
    setUserEmail,
    handleConnectDrive,
    handleLogout,
    isDriveModalOpen,
    setIsDriveModalOpen,
  };
}