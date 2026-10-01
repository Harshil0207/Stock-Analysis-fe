"use client";

import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar.js";
import Header from "../components/Header.js";
import TradingViewScreener from "../components/TradingViewScreener.js";
import TradingViewTickerTape from "../components/TradingViewTickerTape.js";
import OrderForm from "../components/OrderForm.js";
import TransactionsTable from "../components/TransactionsTable.js";
import { fetchStockQuote } from "../../api/stocks.js";

const tickUp = keyframes`
  0% { background: rgba(16, 185, 129, 0.25); }
  100% { background: transparent; }
`;

const tickDown = keyframes`
  0% { background: rgba(244, 63, 94, 0.25); }
  100% { background: transparent; }
`;

const DashboardWrapper = styled.section`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: var(--font-outfit), sans-serif;
  display: flex;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainPanel = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 32px;
  background: ${({ theme }) => theme.mode === "light"
    ? "radial-gradient(circle at 5% 5%, rgba(229, 193, 88, 0.03) 0%, transparent 35%)"
    : "radial-gradient(circle at 5% 5%, rgba(212, 175, 55, 0.04) 0%, transparent 35%), radial-gradient(circle at 95% 85%, rgba(16, 185, 129, 0.03) 0%, transparent 45%)"
  };
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #e5c158; /* Platinum gold */
`;

const SubText = styled.p`
  font-size: 13px;
  color: #94a3b8; /* Higher contrast slate gray */
  margin-left: auto;
`;

const BenchmarksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 36px;
`;

const IndexCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ theme }) => theme.mode === "light" ? "0 4px 20px rgba(0, 0, 0, 0.03)" : "0 4px 20px rgba(0, 0, 0, 0.3)"};
  animation: ${({ $tickUp, $tickDown }) => 
    $tickUp ? css`${tickUp} 0.6s ease-out` : $tickDown ? css`${tickDown} 0.6s ease-out` : "none"};

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(212, 175, 55, 0.4);
    box-shadow: 0 8px 30px rgba(212, 175, 55, 0.08);
  }
`;

const IndexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 8px;
  flex-wrap: wrap;
`;

const IndexName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const IndexValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.heading};
  font-family: monospace;
`;

const ChangeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isUp }) => ($isUp ? "#10b981" : "#f43f5e")};
  background: ${({ $isUp }) => ($isUp ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)")};
  border: 1px solid ${({ $isUp }) => ($isUp ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)")};
  padding: 4px 10px;
  border-radius: 8px;
`;

const StocksTableCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(16px);
  margin-bottom: 36px;
  box-shadow: ${({ theme }) => theme.mode === "light" ? "0 12px 40px rgba(0, 0, 0, 0.04)" : "0 12px 40px rgba(0, 0, 0, 0.5)"};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${({ $tickUp, $tickDown }) => 
    $tickUp ? css`${tickUp} 0.6s ease-out` : $tickDown ? css`${tickDown} 0.6s ease-out` : "none"};

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const Td = styled.td`
  padding: 18px 16px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
`;

const StockIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(212, 175, 55, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  color: #e5c158;
  border: 1px solid rgba(212, 175, 55, 0.15);
`;

export default function DashboardPage() {
  const router = useRouter();
  const [selectedStock, setSelectedStock] = useState("RELIANCE.NS");

  const [indexes, setIndexes] = useState([
    { symbol: "NIFTY50", name: "Nifty 50 Index", price: 24320.00, change: "+0.85%", isUp: true, tickUp: false, tickDown: false },
    { symbol: "BANKNIFTY", name: "Nifty Bank Index", price: 52250.00, change: "+1.15%", isUp: true, tickUp: false, tickDown: false },
    { symbol: "NIFTYIT", name: "Nifty IT Index", price: 38240.00, change: "+0.45%", isUp: true, tickUp: false, tickDown: false },
    { symbol: "NIFTYPHARMA", name: "Nifty Pharma Index", price: 20120.00, change: "-0.20%", isUp: false, tickUp: false, tickDown: false },
    { symbol: "NIFTYFMCG", name: "Nifty FMCG Index", price: 57450.00, change: "+0.60%", isUp: true, tickUp: false, tickDown: false },
    { symbol: "NIFTYAUTO", name: "Nifty Auto Index", price: 25180.00, change: "-0.95%", isUp: false, tickUp: false, tickDown: false }
  ]);

  const [equities, setEquities] = useState([
    { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd.", price: 2455.00, change: "+1.25%", isUp: true, tickUp: false, tickDown: false },
    { symbol: "TCS.NS", name: "Tata Consultancy Services", price: 3825.00, change: "+0.45%", isUp: true, tickUp: false, tickDown: false },
    { symbol: "INFY.NS", name: "Infosys Limited", price: 1645.00, change: "-0.80%", isUp: false, tickUp: false, tickDown: false },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank Limited", price: 1565.00, change: "-0.30%", isUp: false, tickUp: false, tickDown: false },
    { symbol: "TATAMOTORS.NS", name: "Tata Motors Limited", price: 985.00, change: "+2.40%", isUp: true, tickUp: false, tickDown: false }
  ]);

  const [transactions, setTransactions] = useState([
    { id: "TX-7023", symbol: "RELIANCE.NS", type: "BUY", quantity: 50, price: "₹2,455.00", date: "Just now", status: "Completed" },
    { id: "TX-7022", symbol: "TCS.NS", type: "BUY", quantity: 15, price: "₹3,825.00", date: "3 hours ago", status: "Completed" },
    { id: "TX-7021", symbol: "INFY.NS", type: "SELL", quantity: 30, price: "₹1,645.00", date: "Yesterday", status: "Completed" }
  ]);

  // Real-time polling: Interval shortened to 5 seconds for rapid updates
  useEffect(() => {
    let active = true;
    const updateQuotes = async () => {
      try {
        const updatedIndexes = await Promise.all(
          indexes.map(async (stock) => {
            try {
              const quote = await fetchStockQuote(stock.symbol);
              if (!quote || quote.c === 0) return stock;
              return {
                ...stock,
                price: quote.c,
                change: `${quote.dp >= 0 ? "+" : ""}${quote.dp.toFixed(2)}%`,
                isUp: quote.dp >= 0,
                tickUp: quote.c > stock.price,
                tickDown: quote.c < stock.price
              };
            } catch (e) {
              return stock;
            }
          })
        );

        const updatedEquities = await Promise.all(
          equities.map(async (stock) => {
            try {
              const quote = await fetchStockQuote(stock.symbol);
              if (!quote || quote.c === 0) return stock;
              return {
                ...stock,
                price: quote.c,
                change: `${quote.dp >= 0 ? "+" : ""}${quote.dp.toFixed(2)}%`,
                isUp: quote.dp >= 0,
                tickUp: quote.c > stock.price,
                tickDown: quote.c < stock.price
              };
            } catch (e) {
              return stock;
            }
          })
        );

        if (active) {
          setIndexes(updatedIndexes);
          setEquities(updatedEquities);
          
          setTimeout(() => {
            if (active) {
              setIndexes((prev) => prev.map((s) => ({ ...s, tickUp: false, tickDown: false })));
              setEquities((prev) => prev.map((s) => ({ ...s, tickUp: false, tickDown: false })));
            }
          }, 600);
        }
      } catch (err) {
        console.error("Error polling Indian quotes:", err);
      }
    };

    updateQuotes();
    const interval = setInterval(updateQuotes, 5000); // 5 seconds polling
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleStockClick = (symbol) => {
    router.push(`/dashboard/${symbol}`);
  };

  const handleOrderExecuted = (order) => {
    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      symbol: order.symbol,
      type: order.type,
      quantity: order.quantity,
      price: `₹${order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      date: "Just now",
      status: "Completed"
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const fullWatchlist = [...indexes, ...equities];

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <TradingViewTickerTape />

        <SectionHeader>
          <TrendingUp size={18} style={{ color: "#e5c158" }} />
          <SectionTitle>Indian Benchmarks</SectionTitle>
          <SubText>Click on benchmark to load analytical candlestick charts</SubText>
        </SectionHeader>

        <BenchmarksGrid>
          {indexes.map((ind) => (
            <IndexCard 
              key={ind.symbol} 
              onClick={() => handleStockClick(ind.symbol)}
              $tickUp={ind.tickUp}
              $tickDown={ind.tickDown}
            >
              <IndexName>{ind.name}</IndexName>
              <IndexRow>
                <IndexValue>₹{ind.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</IndexValue>
                <ChangeBadge $isUp={ind.isUp}>
                  {ind.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {ind.change}
                </ChangeBadge>
              </IndexRow>
            </IndexCard>
          ))}
        </BenchmarksGrid>

        <SectionHeader>
          <Activity size={18} style={{ color: "#e5c158" }} />
          <SectionTitle>Market Intelligence Radar</SectionTitle>
          <SubText>Real-time Indian equities screener, technical ratings & analysis</SubText>
        </SectionHeader>

        <div style={{ marginBottom: "36px" }}>
          <TradingViewScreener />
        </div>

        <SectionHeader>
          <Activity size={18} style={{ color: "#e5c158" }} />
          <SectionTitle>Indian Equities (NSE)</SectionTitle>
          <SubText>Select any equity row to open company profile, news and candles</SubText>
        </SectionHeader>

        <StocksTableCard>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: "80px" }}>Asset</Th>
                <Th>Symbol</Th>
                <Th>Company Name</Th>
                <Th>Last Trade Price</Th>
                <Th>Day Change</Th>
                <Th style={{ textAlign: "right" }}>Trade</Th>
              </tr>
            </thead>
            <tbody>
              {equities.map((stock) => (
                <Tr 
                  key={stock.symbol} 
                  onClick={() => handleStockClick(stock.symbol)}
                  $tickUp={stock.tickUp}
                  $tickDown={stock.tickDown}
                >
                  <Td>
                    <StockIcon>{stock.symbol.split(".")[0]}</StockIcon>
                  </Td>
                  <Td style={{ fontWeight: 700 }}>{stock.symbol}</Td>
                  <Td style={{ color: "#cbd5e1" }}>{stock.name}</Td>
                  <Td style={{ fontFamily: "monospace", fontSize: "15px" }}>
                    ₹{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Td>
                  <Td>
                    <ChangeBadge $isUp={stock.isUp} style={{ padding: "3px 8px", fontSize: "12px" }}>
                      {stock.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stock.change}
                    </ChangeBadge>
                  </Td>
                  <Td style={{ textAlign: "right" }}>
                    <ChangeBadge $isUp={true} style={{ 
                      background: "rgba(229, 193, 88, 0.08)", 
                      color: "#e5c158", 
                      border: "1px solid rgba(229, 193, 88, 0.25)",
                      cursor: "pointer"
                    }}>
                      Analyze
                    </ChangeBadge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </StocksTableCard>

        <SectionHeader>
          <ShieldCheck size={18} style={{ color: "#e5c158" }} />
          <SectionTitle>Instant Execution Suite</SectionTitle>
        </SectionHeader>

        <OrderForm 
          watchlist={fullWatchlist}
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          onOrderExecuted={handleOrderExecuted}
        />

        <TransactionsTable transactions={transactions} />
      </MainPanel>
    </DashboardWrapper>
  );
}
