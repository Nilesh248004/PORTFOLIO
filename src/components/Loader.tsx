'use client';

import { useEffect } from 'react';

// The overlay is pure CSS (fades out on its own); JS only remembers that the intro was seen.
export default function Loader() {
  useEffect(() => {
    try {
      sessionStorage.setItem('intro', '1');
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="loader" aria-hidden="true">
      <div className="loader-mark">NK</div>
      <div className="loader-bar" />
    </div>
  );
}
