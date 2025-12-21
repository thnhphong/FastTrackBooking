import { useEffect } from 'react';

/**
 * Custom hook to scroll to top when component mounts
 * Desktop: scrolls to 250px
 * Mobile (< 768px): scrolls to 100px
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 250, left: 0, behavior: 'auto' });
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 100, left: 0, behavior: 'auto' });
    }
  }, []);
};

