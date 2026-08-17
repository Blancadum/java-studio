import { useState, useCallback } from 'react';
import { PageType, MODE_TO_PAGE_MAP } from '../data/constants';
import { StudentPersonaMode } from '../data/types';

export function useNavigation() {
  const [history, setHistory] = useState<PageType[]>(['home']);
  const currentPage = history[history.length - 1] || 'home';

  const navigateTo = useCallback((page: PageType) => {
    if (page === currentPage) return;
    setHistory(prev => [...prev, page]);
  }, [currentPage]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history.length]);

  const navigateToApp = useCallback((mode: StudentPersonaMode) => {
    const page = MODE_TO_PAGE_MAP[mode];
    if (page) {
      navigateTo(page);
    } else {
      console.warn(`No page mapping found for mode: ${mode}`);
      navigateTo('home');
    }
  }, [navigateTo]);

  return { currentPage, navigateTo, goBack, navigateToApp };
}
