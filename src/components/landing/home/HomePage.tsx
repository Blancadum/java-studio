import React from 'react';
import { UserProfile, PageType } from '../../../data/types';
import { LandingPage } from '../../../pages/LandingPage';
// The 'ViewMode' type is not exported from '../../../data/types'. 'PageType' is the correct type.
interface HomeProps {
  onLoadSample: () => void;
  onOpenAuth?: () => void;
  onNavigateTo: (page: PageType) => void;
  userProfile: UserProfile | null;
}

export const HomePage: React.FC<HomeProps> = ({
  onLoadSample,
  onOpenAuth,
  onNavigateTo,
  userProfile,
}) => {
  // La HomePage ahora siempre muestra la LandingPage.
  // La lógica para mostrar el Campus se ha movido a CampusPage.
  return (
    <LandingPage
      onLoadSample={onLoadSample}
      onOpenAuth={onOpenAuth}
      onNavigateTo={onNavigateTo}
      userProfile={userProfile}
    />
  );
};
