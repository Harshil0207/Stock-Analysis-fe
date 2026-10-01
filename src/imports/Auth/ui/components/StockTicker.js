"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const defaultStocks = [
  { symbol: "TSLA", value: "248.60", change: "+3.85%", isUp: true },
  { symbol: "AAPL", value: "189.42", change: "+1.20%", isUp: true },
  { symbol: "BTC/USD", value: "59,320.00", change: "+4.12%", isUp: true },
  { symbol: "NVDA", value: "127.35", change: "-1.82%", isUp: false },
  { symbol: "TRADESET INDEX", value: "9,842.10", change: "+2.78%", isUp: true },
];

export default function StockTicker() {
  // Duplicate for infinite marquee effect
  const tickerItems = [...defaultStocks, ...defaultStocks];

  return (
    <TickerSection>
      <TickerTrack>
        {tickerItems.map((item, idx) => (
          <TickerItem key={idx}>
            <TickerSymbol>{item.symbol}</TickerSymbol>
            <TickerValue>{item.value}</TickerValue>
            <TickerChange $isUp={item.isUp}>
              {item.isUp ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {item.change}
            </TickerChange>
          </TickerItem>
        ))}
      </TickerTrack>
    </TickerSection>
  );
}
const ticker = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const TickerSection = styled.div`
  width: 100%;
  background: rgba(6, 6, 8, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding: 12px 0;
  overflow: hidden;
  position: relative;
  z-index: 10;
  backdrop-filter: blur(8px);
`;

const TickerTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${ticker} 40s linear infinite;
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 48px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #e5e5e7;
`;

const TickerSymbol = styled.span`
  color: #8e8e93;
  font-weight: 600;
`;

const TickerValue = styled.span`
  font-family: monospace;
`;

const TickerChange = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;
  color: ${({ $isUp }) => ($isUp ? "#10b981" : "#f43f5e")};
`;
