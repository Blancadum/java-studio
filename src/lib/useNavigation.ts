import { useState } from 'react';
import { PageType, PAGE_HIERARCHY, MODE_TO_PAGE_MAP } from '../data/constants';
import { scrollToTop } from '../lib/utils';
import { StudentPersonaMode } from '../data/types';

// src/hooks/useNavigation.ts
export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [breadcrumb, setBreadcrumb] = useState<PageType[]>(['home']);

  const navigateTo = (page: PageType) => {
    const existingIndex = breadcrumb.indexOf(page);

    if (existingIndex !== -1) {
      // If the page is already in the breadcrumb, truncate it to that point.
      setBreadcrumb(prev => prev.slice(0, existingIndex + 1));
    } else {
      // If it's a new page, add it.
      const parentPage = PAGE_HIERARCHY[page]?.parent;
      if (!parentPage) { // It's a top-level page, reset breadcrumb
        setBreadcrumb([page]);
      } else { // It's a child page, add it to the trail
        setBreadcrumb(prev => [...prev, page]);
      }
    }
    setCurrentPage(page);
    scrollToTop();
  };

  const goBack = () => {
    if (breadcrumb.length > 1) {
      const newBreadcrumb: PageType[] = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      setCurrentPage(newBreadcrumb[newBreadcrumb.length - 1]);
    } else {
      navigateTo('home');
    }
    scrollToTop();
  };

  const navigateToApp = (mode: StudentPersonaMode) => {
    navigateTo(MODE_TO_PAGE_MAP[mode]);
  };

  return { currentPage, navigateTo, goBack, navigateToApp, breadcrumb };
}