import { useEffect, useState } from 'react';
import { BUILD_DATE } from './litters';

/**
 * Today's date (YYYY-MM-DD). Starts at the build date, so the first render matches the
 * prerendered HTML, then switches to the visitor's real date after hydration. Time-based
 * content (the next-litter banner, the copyright year) therefore updates itself even if
 * the site has not been rebuilt for a while.
 */
export const useToday = (): string => {
  const [today, setToday] = useState(BUILD_DATE);
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);
  return today;
};
