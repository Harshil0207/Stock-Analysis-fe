"use client";

import React, { useEffect } from "react";

export default function TradingViewScreener() {
  useEffect(() => {
    const container = document.getElementById("tv-screener-container");
    if (!container) return;

    if (container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 600,
      defaultColumn: "overview",
      defaultScreen: "most_capitalized",
      market: "india",
      showToolbar: true,
      colorTheme: "dark",
      locale: "en",
      isTransparent: true
    });

    container.appendChild(script);
  }, []);

  return (
    <div 
      id="tv-screener-container" 
      style={{ 
        width: "100%", 
        height: "600px",
        borderRadius: "20px", 
        overflow: "hidden", 
        border: "1px solid rgba(255, 255, 255, 0.05)",
        background: "rgba(13, 17, 28, 0.7)",
        backdropFilter: "blur(16px)"
      }} 
    />
  );
}
