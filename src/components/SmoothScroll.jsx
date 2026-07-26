'use client';
import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    const handleHashClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.hash && target.hash.startsWith('#') && target.origin === window.location.origin) {
        const element = document.querySelector(target.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', target.hash);
        }
      }
    };
    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);
  
  return null;
}
