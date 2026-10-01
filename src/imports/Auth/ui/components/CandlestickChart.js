"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export default function CandlestickChart() {
  const [candles, setCandles] = useState([
    { body: 80, wick: 20, up: true },
    { body: 40, wick: 30, up: false },
    { body: 110, wick: 40, up: true },
    { body: 70, wick: 20, up: false },
    { body: 130, wick: 50, up: true },
    { body: 90, wick: 30, up: true },
    { body: 60, wick: 25, up: false }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => prev.map(candle => {
        const offset = Math.floor(Math.random() * 20) - 10;
        const newBody = Math.max(30, Math.min(140, candle.body + offset));
        return {
          ...candle,
          body: newBody,
          up: offset >= 0
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CandlestickBoard>
      {candles.map((candle, idx) => (
        <CandleColumn key={idx}>
          <WickLine $wickHeight={candle.wick} $isBullish={candle.up} />
          <RealBody $bodyHeight={candle.body} $isBullish={candle.up} />
        </CandleColumn>
      ))}
    </CandlestickBoard>
  );
}

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
`;

const CandlestickBoard = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  height: 200px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  position: relative;
  backdrop-filter: blur(10px);
  animation: ${float} 6s ease-in-out infinite;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const CandleColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

const WickLine = styled.div`
  width: 2px;
  height: ${({ $wickHeight }) => $wickHeight}px;
  background-color: ${({ $isBullish }) => ($isBullish ? "#10b981" : "#f43f5e")};
  opacity: 0.6;
`;

const RealBody = styled.div`
  width: 100%;
  max-width: 16px;
  height: ${({ $bodyHeight }) => $bodyHeight}px;
  background: ${({ $isBullish }) =>
    $isBullish 
      ? "linear-gradient(180deg, #10b981 0%, rgba(16, 185, 129, 0.4) 100%)" 
      : "linear-gradient(180deg, #f43f5e 0%, rgba(244, 63, 94, 0.4) 100%)"};
  border-radius: 4px;
  box-shadow: 0 4px 15px ${({ $isBullish }) => ($isBullish ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)")};
  transition: height 0.5s ease;
`;
