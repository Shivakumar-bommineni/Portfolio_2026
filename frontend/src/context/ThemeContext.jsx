import { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('shiv_theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shiv_theme', theme);
  }, [theme]);

  const toggle = (event) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const isTransitionSupported =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTransitionSupported) {
      setTheme(nextTheme);
      return;
    }

    const x = event?.clientX ?? window.innerWidth - 60;
    const y = event?.clientY ?? 36;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 550,
          easing: 'cubic-bezier(0.2, 0.9, 0.4, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
