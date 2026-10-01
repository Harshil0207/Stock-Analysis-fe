"use client";

import React, { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { PieChart, TrendingUp, TrendingDown, DollarSign, Briefcase, Plus, ArrowRight, RefreshCw, BarChart2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../Dashboard/ui/components/Sidebar.js";
import Header from "../../../Dashboard/ui/components/Header.js";
import TradingViewTickerTape from "../../../Dashboard/ui/components/TradingViewTickerTape.js";
import { fetchPortfolioSummary, fetchPortfolioHoldings } from "../../api/portfolio.js";
import { fetchStockQuote } from "../../../Dashboard/api/stocks.js";

const tickUp = keyframes`
  0% { background: rgba(16, 185, 129, 0.2); }
  100% { background: transparent; }
`;

const tickDown = keyframes`
  0% { background: rgba(244, 63, 94, 0.2); }
  100% { background: transparent; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardWrapper = styled.section`
  min-height: 100vh;
  background-color: #030304;
  color: #a8a29e;
  font-family: var(--font-outfit), sans-serif;
  display: flex;
  overflow: hidden;
  position: relative;
`;

const MainPanel = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 32px;
  background: radial-gradient(circle at 5% 5%, rgba(212, 175, 55, 0.05) 0%, transparent 40%), 
              radial-gradient(circle at 95% 95%, rgba(16, 185, 129, 0.02) 0%, transparent 50%);
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: ${slideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const PageHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  padding-bottom: 24px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LivePulseContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #10b981;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
  padding: 5px 12px;
  border-radius: 30px;
  width: fit-content;
`;

const PulseDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: ${tickUp} 2s infinite ease-in-out;
`;

const Title = styled.h2`
  font-family: var(--font-syne), sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(90deg, #d4af37 0%, #aa8453 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled.p`
  color: #8c8c9a;
  font-size: 14px;
`;

const RefreshButton = styled.button`
  background: linear-gradient(90deg, #d4af37 0%, #aa8453 100%);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const StatCard = styled.div`
  background: rgba(18, 18, 22, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(212, 175, 55, 0.2);
  }
`;

const CardDecor = styled.div`
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${({ $color }) => $color || "rgba(229, 193, 88, 0.05)"};
  filter: blur(40px);
  pointer-events: none;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  font-family: var(--font-syne), sans-serif;
`;

const StatSubText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? "#10b981" : "#f43f5e")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(18, 18, 22, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
`;

const CardTitle = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e5c158;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 16px;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
`;

const Th = styled.th`
  background: rgba(255, 255, 255, 0.01);
  padding: 16px 20px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.08em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;

const Td = styled.td`
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  color: #ffffff;
`;

const Tr = styled.tr`
  transition: all 0.25s ease;
  animation: ${({ $tickUp, $tickDown }) => 
    $tickUp ? css`${tickUp} 0.6s ease-out` : $tickDown ? css`${tickDown} 0.6s ease-out` : "none"};
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AssetLogo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e5c158 0%, #aa8453 100%);
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfitBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${({ $positive }) => ($positive ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)")};
  color: ${({ $positive }) => ($positive ? "#10b981" : "#f43f5e")};
  border: 1px solid ${({ $positive }) => ($positive ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)")};
`;

const AllocationRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const AllocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #e5c158 0%, #10b981 100%);
  width: ${({ $width }) => $width || "0%"};
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export default function PortfolioPage() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    cashBalance: 0.00,
    equityValue: 0.00,
    totalCost: 0.00,
    netWorth: 0.00,
    totalGain: 0.00,
    gainPercent: 0.00
  });
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);

  const loadPortfolioData = async () => {
    setLoading(true);
    setAuthRequired(false);
    try {
      const summaryData = await fetchPortfolioSummary();
      setSummary(summaryData);

      const holdingsData = await fetchPortfolioHoldings();
      setHoldings(holdingsData || []);
    } catch (e) {
      console.warn("Failed to load portfolio statistics:", e.message);
      setAuthRequired(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Polling loop for active market updates
  useEffect(() => {
    if (holdings.length === 0 || loading) return;

    let active = true;
    const pollQuotes = async () => {
      try {
        const updated = await Promise.all(
          holdings.map(async (holding) => {
            try {
              const quote = await fetchStockQuote(holding.symbol);
              if (!quote || quote.c === 0) return holding;

              const livePrice = quote.c;
              const currentValue = holding.quantity * livePrice;
              const totalCost = holding.quantity * parseFloat(holding.avgPrice);
              const totalGain = currentValue - totalCost;
              const gainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

              return {
                ...holding,
                currentPrice: livePrice,
                currentValue,
                totalGain,
                gainPercent,
                tickUp: livePrice > (holding.currentPrice || 0),
                tickDown: livePrice < (holding.currentPrice || 0)
              };
            } catch (err) {
              return holding;
            }
          })
        );

        if (!active) return;

        setHoldings(updated);

        // Recalculate summary metrics from updated values
        const totalEquityVal = updated.reduce((acc, h) => acc + (h.currentValue || 0), 0);
        const totalCostBasis = updated.reduce((acc, h) => acc + (h.totalCost || 0), 0);
        const totalGain = totalEquityVal - totalCostBasis;
        const gainPercent = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;
        const netWorth = (summary.cashBalance || 0) + totalEquityVal;

        setSummary((prev) => ({
          ...prev,
          equityValue: totalEquityVal,
          totalCost: totalCostBasis,
          totalGain,
          gainPercent,
          netWorth
        }));

        setTimeout(() => {
          if (active) {
            setHoldings((prev) => prev.map((h) => ({ ...h, tickUp: false, tickDown: false })));
          }
        }, 600);
      } catch (err) {
        console.error("Live portfolio polling error:", err);
      }
    };

    const interval = setInterval(pollQuotes, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [loading, holdings.length]);

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <TradingViewTickerTape />

        {authRequired ? (
          <Card style={{ marginTop: "24px" }}>
            <EmptyState>
              <ShieldAlert size={48} style={{ color: "#f43f5e" }} />
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#ffffff" }}>Authentication Required</div>
              <p style={{ fontSize: "13px", maxWidth: "360px", lineHeight: "1.5" }}>
                Please log in to your TradeSet profile to inspect real-time stock holdings and portfolio allocations.
              </p>
            </EmptyState>
          </Card>
        ) : (
          <ContentContainer>
            {/* Header row */}
            <PageHeaderRow>
              <TitleBlock>
                <LivePulseContainer>
                  <PulseDot />
                  Market Feed Active (5s Poll)
                </LivePulseContainer>
                <Title>Asset <span>Portfolio Ledger</span></Title>
                <Subtitle>Detailed metrics on active allocations, settlement cash, and real-time unrealized gains.</Subtitle>
              </TitleBlock>

              <RefreshButton onClick={loadPortfolioData}>
                <RefreshCw size={14} />
                Sync Ledger
              </RefreshButton>
            </PageHeaderRow>

            {/* Stats Cards */}
            <StatsGrid>
              <StatCard>
                <CardDecor $color="rgba(229, 193, 88, 0.06)" />
                <StatLabel>Total Net Worth</StatLabel>
                <StatValue>₹{summary.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</StatValue>
                <StatSubText $positive={summary.totalGain >= 0}>
                  {summary.totalGain >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {summary.totalGain >= 0 ? "+" : ""}
                  {summary.gainPercent.toFixed(2)}% (Unrealized)
                </StatSubText>
              </StatCard>

              <StatCard>
                <CardDecor $color="rgba(16, 185, 129, 0.05)" />
                <StatLabel>Unrealized Profit/Loss</StatLabel>
                <StatValue style={{ color: summary.totalGain >= 0 ? "#10b981" : "#f43f5e" }}>
                  ₹{summary.totalGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </StatValue>
                <StatSubText $positive={summary.totalGain >= 0}>
                  Total returns across all active investments
                </StatSubText>
              </StatCard>

              <StatCard>
                <CardDecor $color="rgba(56, 189, 248, 0.05)" />
                <StatLabel>Equity Holdings</StatLabel>
                <StatValue>₹{summary.equityValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</StatValue>
                <StatSubText $positive={true} style={{ color: "#94a3b8" }}>
                  Cost basis: ₹{summary.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </StatSubText>
              </StatCard>

              <StatCard>
                <CardDecor $color="rgba(255, 255, 255, 0.03)" />
                <StatLabel>Settlement Cash</StatLabel>
                <StatValue>₹{summary.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</StatValue>
                <StatSubText $positive={true} style={{ color: "#94a3b8" }}>
                  Available for asset procurement
                </StatSubText>
              </StatCard>
            </StatsGrid>

            {/* Holdings & Allocations */}
            <MainGrid>
              <Card>
                <CardTitle>
                  <Briefcase size={18} />
                  Active Asset Portfolio Holdings
                </CardTitle>

                {loading ? (
                  <EmptyState>
                    <RefreshCw size={32} className="spin" style={{ color: "#e5c158" }} />
                    <span>Loading active assets...</span>
                  </EmptyState>
                ) : holdings.length === 0 ? (
                  <EmptyState>
                    <Briefcase size={32} />
                    <span>Your portfolio is empty. Purchase assets to build your ledger.</span>
                    <button 
                      onClick={() => router.push("/dashboard")} 
                      style={{
                        background: "linear-gradient(135deg, #e5c158 0%, #aa8453 100%)",
                        border: "none",
                        color: "#000",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Plus size={16} /> Open Trading Terminal
                    </button>
                  </EmptyState>
                ) : (
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <Th>Asset Symbol</Th>
                          <Th>Shares Owned</Th>
                          <Th>Avg Purchase Price</Th>
                          <Th>Current Price</Th>
                          <Th>Total Investment</Th>
                          <Th>Current Valuation</Th>
                          <Th>Profit / Loss</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map((h) => {
                          const profitVal = h.totalGain;
                          const isProfit = profitVal >= 0;

                          return (
                            <Tr key={h.id} $tickUp={h.tickUp} $tickDown={h.tickDown} onClick={() => router.push(`/dashboard/${h.symbol}`)}>
                              <Td>
                                <AssetInfo>
                                  <AssetLogo>{h.symbol.substring(0, 2)}</AssetLogo>
                                  <div>
                                    <div style={{ fontWeight: "700", fontSize: "14px" }}>{h.symbol}</div>
                                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>NSE Market</div>
                                  </div>
                                </AssetInfo>
                              </Td>
                              <Td style={{ fontFamily: "monospace", fontWeight: "700" }}>{h.quantity}</Td>
                              <Td style={{ fontFamily: "monospace" }}>₹{parseFloat(h.avgPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                              <Td style={{ fontFamily: "monospace", color: "#e5c158" }}>₹{parseFloat(h.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                              <Td style={{ fontFamily: "monospace" }}>₹{h.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                              <Td style={{ fontFamily: "monospace", fontWeight: "700" }}>₹{h.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                              <Td>
                                <ProfitBadge $positive={isProfit}>
                                  {isProfit ? "+" : ""}
                                  {h.gainPercent.toFixed(2)}%
                                </ProfitBadge>
                              </Td>
                            </Tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </TableWrapper>
                )}
              </Card>

              <Card>
                <CardTitle>
                  <PieChart size={18} />
                  Asset Allocation Weights
                </CardTitle>

                {holdings.length === 0 ? (
                  <EmptyState style={{ padding: "32px 0" }}>
                    <BarChart2 size={24} />
                    <span style={{ fontSize: "13px" }}>No allocation data to display.</span>
                  </EmptyState>
                ) : (
                  <div>
                    {holdings.map((h) => {
                      const allocationPercent = summary.equityValue > 0 ? (h.currentValue / summary.equityValue) * 100 : 0;
                      return (
                        <AllocationRow key={h.id}>
                          <AllocationHeader>
                            <span>{h.symbol}</span>
                            <span style={{ color: "#e5c158" }}>{allocationPercent.toFixed(1)}%</span>
                          </AllocationHeader>
                          <ProgressBarContainer>
                            <ProgressBar $width={`${allocationPercent}%`} />
                          </ProgressBarContainer>
                        </AllocationRow>
                      );
                    })}
                  </div>
                )}
              </Card>
            </MainGrid>
          </ContentContainer>
        )}
      </MainPanel>
    </DashboardWrapper>
  );
}
