'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('user');

  useEffect(() => {
    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'user' ? 'admin' : 'user';
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext); 