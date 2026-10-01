import { Syne, Outfit } from "next/font/google";
import StyledComponentsRegistry from "../lib/Registry.js";
import ClientThemeProvider from "../styles/ClientThemeProvider.js";
import { ToastProvider } from "../lib/toast.js";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "TradeSet | Luxury Stock Market Platform",
  description: "Experience premium algorithmic trading and stock analysis on our high-luxury platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ClientThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ClientThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

