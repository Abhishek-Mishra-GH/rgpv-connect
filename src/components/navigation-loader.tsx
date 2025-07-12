'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // We use the pathname and searchParams to detect when navigation is complete
    handleStop();
    
    return () => {
      handleStop();
    };
  }, [pathname, searchParams]);
  
  // This effect will run on mount and when navigation starts
  useEffect(() => {
      NProgress.start();
      const timer = setTimeout(() => {
          NProgress.done()
      }, 500); // Failsafe to stop loader
      return () => clearTimeout(timer);
  }, [pathname, searchParams]);


  return null;
}
