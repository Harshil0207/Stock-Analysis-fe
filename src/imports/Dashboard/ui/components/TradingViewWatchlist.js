"use client";

import React, { useEffect } from "react";

export default function TradingViewWatchlist() {
  useEffect(() => {
    const container = document.getElementById("tv-watchlist-container");
    if (!container) return;

    if (container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 450,
      symbolsGroups: [
        {
          name: "Indian Equities (NSE)",
          originalName: "Indices",
          symbols: [
            { name: "NSE:RELIANCE", displayName: "Reliance Industries" },
            { name: "NSE:TCS", displayName: "Tata Consultancy Services" },
            { name: "NSE:INFY", displayName: "Infosys" },
            { name: "NSE:HDFCBANK", displayName: "HDFC Bank" },
            { name: "NSE:TATAMOTORS", displayName: "Tata Motors" }
          ]
        }
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      locale: "en"
    });

    container.appendChild(script);
  }, []);

  return (
    <div 
      id="tv-watchlist-container" 
      style={{ 
        width: "100%", 
        height: "450px",
        borderRadius: "20px", 
        overflow: "hidden", 
        border: "1px solid rgba(255, 255, 255, 0.05)",
        background: "rgba(13, 17, 28, 0.7)",
        backdropFilter: "blur(16px)"
      }} 
    />
  );
}
