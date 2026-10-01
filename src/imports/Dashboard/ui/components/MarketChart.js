"use client";

import React from "react";
import styled from "styled-components";

const Card = styled.article`
  background: rgba(10, 10, 12, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(212, 175, 55, 0.15);
  }
`;

const ChartContainerCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 480px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const StockSymbolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StockIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StockNameGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SymbolName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const CompanyName = styled.span`
  font-size: 11px;
  color: #8c8c9a;
`;

const TimeIntervalGroup = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 4px;
`;

const TimeButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: ${({ $active }) => ($active ? "rgba(212, 175, 55, 0.15)" : "transparent")};
  color: ${({ $active }) => ($active ? "#d4af37" : "#8c8c9a")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const GraphPlot = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GridLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.02);
  top: ${({ $top }) => $top}%;
`;

const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
`;

export default function MarketChart({ selectedStock, selectedInterval, setSelectedInterval, chartPrices = [] }) {
  // Generate dynamic chart path based on real stock prices
  const getChartPath = () => {
    if (!chartPrices || chartPrices.length < 2) {
      return "M 0 130 C 40 120, 80 140, 120 100 C 160 80, 200 90, 240 60 C 280 40, 320 50, 360 30";
    }

    const min = Math.min(...chartPrices);
    const max = Math.max(...chartPrices);
    const range = max - min || 1;

    const points = chartPrices.map((price, index) => {
      const x = (index / (chartPrices.length - 1)) * 360;
      const y = 170 - ((price - min) / range) * 140;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <ChartContainerCard>
      <ChartHeader>
        <StockSymbolInfo>
          <StockIcon>{selectedStock}</StockIcon>
          <StockNameGroup>
            <SymbolName>{selectedStock}</SymbolName>
            <CompanyName>Institutional Order Feed</CompanyName>
          </StockNameGroup>
        </StockSymbolInfo>

        <TimeIntervalGroup>
          {["1D", "1W", "1M", "1Y"].map((interval) => (
            <TimeButton 
              key={interval} 
              $active={selectedInterval === interval}
              onClick={() => setSelectedInterval(interval)}
            >
              {interval}
            </TimeButton>
          ))}
        </TimeIntervalGroup>
      </ChartHeader>

      <GraphPlot>
        {[20, 40, 60, 80].map((lineTop) => (
          <GridLine key={lineTop} $top={lineTop} />
        ))}
        <SvgCanvas viewBox="0 0 360 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="goldTermGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d={getChartPath()} 
            fill="none" 
            stroke="#d4af37" 
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path 
            d={`${getChartPath()} L 360 200 L 0 200 Z`} 
            fill="url(#goldTermGradient)"
          />
        </SvgCanvas>
      </GraphPlot>
    </ChartContainerCard>
  );
}
