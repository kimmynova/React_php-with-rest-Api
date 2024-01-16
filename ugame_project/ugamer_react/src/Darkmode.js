import { createContext, useEffect, useState } from "react";

export const Darkmodes = createContext()
export const DarkmodePrvider = ({ children }) => {
const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  );

  const element = document.documentElement;
  const toggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return(
    <Darkmodes.Provider value={{darkMode,toggle}}>
        {children}
    </Darkmodes.Provider>
  )
}