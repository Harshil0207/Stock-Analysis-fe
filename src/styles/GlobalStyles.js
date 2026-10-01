"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  ::selection {
    background: ${({ theme }) => theme.gold} !important;
    color: ${({ theme }) => theme.dark};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    outline: none !important;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
    overflow-y: auto;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    margin: 0;
    padding: 0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.heading};
    margin: 0;
    font-weight: 500;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  button, input {
    font-family: inherit;
  }

  /* Custom Premium Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.bg};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.gold};
  }
`;

export default GlobalStyles;
