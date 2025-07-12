// src/components/navigation-loader.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import NProgress from 'nprogress';

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef(pathname + searchParams.toString());

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    if (previousPath.current !== currentPath) {
      NProgress.start();
    }
    // The `previousPath.current` is updated in the cleanup function
    // to ensure `NProgress.done()` is called for the *previous* navigation.
    NProgress.done();

    return () => {
      previousPath.current = currentPath;
    };
  }, [pathname, searchParams]);

  return null;
}
