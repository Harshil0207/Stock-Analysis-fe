"use client";

import React from "react";
import styled, { css, keyframes } from "styled-components";
import { ArrowUpRight, ArrowDownRight, HelpCircle } from "lucide-react";

const tickUp = keyframes`
  0% { background: rgba(16, 185, 129, 0.2); }
  100% { background: transparent; }
`;

const tickDown = keyframes`
  0% { background: rgba(244, 63, 94, 0.2); }
  100% { background: transparent; }
`;

const Card = styled.article`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(229, 193, 88, 0.25);
  }
`;

const WatchlistCard = styled(Card)`
  display: flex;
  flex-direction: column;
  max-height: 480px;
`;

const WatchlistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CardTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.text};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
`;

const StockRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.mode === "light" ? "rgba(0, 0, 0, 0.01)" : "rgba(255, 255, 255, 0.01)"};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${({ $tickUp, $tickDown }) => 
    $tickUp ? css`${tickUp} 0.5s ease-out` : $tickDown ? css`${tickDown} 0.5s ease-out` : "none"};

  &:hover {
    background: ${({ theme }) => theme.mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.03)"};
    border-color: rgba(229, 193, 88, 0.25);
  }
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
  background: ${({ theme }) => theme.mode === "light" ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.03)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  color: ${({ theme }) => theme.heading};
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px;
`;

const StockNameGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SymbolName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.heading};
`;

const CompanyName = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.text};
`;

const PriceGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const StockPrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.heading};
  font-family: monospace;
`;

const GainsBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $isUp }) => ($isUp ? "#10b981" : "#f43f5e")};
  background: ${({ $isUp }) => ($isUp ? "rgba(16, 185, 129, 0.06)" : "rgba(244, 63, 94, 0.06)")};
  border: 1px solid ${({ $isUp }) => ($isUp ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)")};
  padding: 4px 10px;
  border-radius: 8px;
`;

export default function Watchlist({ watchlist, selectedStock, setSelectedStock }) {
  return (
    <WatchlistCard>
      <WatchlistHeader>
        <CardTitle>Market Watchlist</CardTitle>
        <HelpCircle size={16} style={{ color: "#7c7c8a" }} />
      </WatchlistHeader>

      <StockList>
        {watchlist.map((stock) => {
          const isIndian = stock.symbol.endsWith(".NS") || stock.symbol === "NIFTY50" || stock.symbol === "BANKNIFTY";
          const currencySymbol = isIndian ? "₹" : "$";

          return (
            <StockRow 
              key={stock.symbol}
              onClick={() => setSelectedStock(stock.symbol)}
              $tickUp={stock.tickUp}
              $tickDown={stock.tickDown}
              style={{ 
                borderColor: selectedStock === stock.symbol ? "rgba(229, 193, 88, 0.4)" : undefined,
                background: selectedStock === stock.symbol ? (theme => theme.mode === "light" ? "rgba(229, 193, 88, 0.05)" : "rgba(229, 193, 88, 0.02)") : undefined
              }}
            >
              <StockSymbolInfo>
                <StockIcon>{stock.symbol.replace(".NS", "")}</StockIcon>
                <StockNameGroup>
                  <SymbolName>{stock.symbol}</SymbolName>
                  <CompanyName>{stock.name}</CompanyName>
                </StockNameGroup>
              </StockSymbolInfo>

              <PriceGroup>
                <StockPrice>{currencySymbol}{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</StockPrice>
                <GainsBadge $isUp={stock.isUp} style={{ fontSize: "11px", padding: "2px 6px", marginTop: "4px" }}>
                  {stock.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stock.change}
                </GainsBadge>
              </PriceGroup>
            </StockRow>
          );
        })}
      </StockList>
    </WatchlistCard>
  );
}
