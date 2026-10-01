"use client";

import React, { useEffect, useRef } from "react";

export default function TradingViewTickerTape() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Avoid injecting twice (e.g. during HMR / Strict Mode double-mount)
    if (container.querySelector("script")) return;

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    // TradingView reads its config from the text content of the script tag itself.
    // Assigning to .text (not .innerHTML) ensures the browser exposes it correctly.
    script.text = JSON.stringify({
      symbols: [
        { proName: "NSE:NIFTY", title: "Nifty 50" },
        { proName: "NSE:BANKNIFTY", title: "Nifty Bank" },
        { description: "Reliance", proName: "NSE:RELIANCE" },
        { description: "TCS", proName: "NSE:TCS" },
        { description: "Infosys", proName: "NSE:INFY" },
        { description: "HDFC Bank", proName: "NSE:HDFCBANK" },
        { description: "Tata Motors", proName: "NSE:TATAMOTORS" },
        { description: "S&P 500", proName: "FOREXCOM:SPX500" },
        { description: "Nasdaq 100", proName: "FOREXCOM:NSXUSD" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });

    container.appendChild(widgetDiv);
    container.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{
        width: "100%",
        margin: "12px 0 24px 0",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        background: "rgba(13, 17, 28, 0.4)",
        minHeight: "46px",
      }}
    />
  );
}
