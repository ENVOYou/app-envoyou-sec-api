"use client";
import { useEffect, useState } from 'react';

export function useScrollElevation(threshold: number = 8) {
  const [elevated, setElevated] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > threshold;
      if (scrolled !== elevated) setElevated(scrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, elevated]);
  return elevated;
}
