import React, { createContext, useContext, useState, useCallback } from 'react';
import { StudentPersonaMode } from '../data/types';

type PageType = 'home' | 'documentation' | 'privacy' | 'terms' | 'contact' | 'explore-modes';

interface NavigationContextType {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
  goBack: () => void;
  navigateToApp: (mode: StudentPersonaMode) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [history, setHistory] = useState<PageType[]>(['home']);
  const currentPage = history[history.length - 1] || 'home';

  const navigateTo = useCallback((page: PageType) => {
    if (page === currentPage) return;
    setHistory((prev) => [...prev, page]);
  }, [currentPage]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [history.length]);

  const navigateToApp = useCallback(
    (mode: StudentPersonaMode) => {
      // Simple mode to page mapping inline
      const modePageMap: Record<StudentPersonaMode, PageType> = {
        'FEEDBACK_REVISION': 'home',
        'ARCHITECTURE_NOOB': 'home',
        'PRE_SUBMISSION_AUDIT': 'home',
        'SONAR_QUALITY': 'home',
      };
      const page = modePageMap[mode];
      if (page) {
        navigateTo(page);
      } else {
        console.warn(`No page mapping found for mode: ${mode}`);
        navigateTo('home');
      }
    },
    [navigateTo]
  );

  const value: NavigationContextType = {
    currentPage,
    navigateTo,
    goBack,
    navigateToApp,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
}
