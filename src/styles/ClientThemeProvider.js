"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./Theme.js";
import GlobalStyles from "./GlobalStyles.js";

const ThemeModeContext = createContext({
  themeMode: "dark",
  toggleThemeMode: () => {}
});

export const useThemeMode = () => useContext(ThemeModeContext);

export default function ClientThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setThemeMode(saved);
    }
  }, []);

  const toggleThemeMode = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    localStorage.setItem("theme", next);
  };

  const activeTheme = themeMode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      <ThemeProvider theme={activeTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
