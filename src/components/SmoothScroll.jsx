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
          window.history.pushState(null, '', target.hash);
          
          // Wait for mobile menu to close before scrolling to avoid layout shifts
          setTimeout(() => {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 350); // Slightly longer than the 0.3s menu transition
        }
      }
    };
    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);
  
  return null;
}
