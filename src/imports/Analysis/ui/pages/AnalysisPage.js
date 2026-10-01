"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  BarChart2, 
  Cpu, 
  Clock, 
  Zap, 
  Sliders, 
  ChevronRight, 
  Compass, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import Sidebar from "../../../Dashboard/ui/components/Sidebar.js";
import Header from "../../../Dashboard/ui/components/Header.js";
import {
  fetchTopGainers,
  fetchTopLosers,
  fetchMarketCap,
  fetchVolume,
  fetch52WeekHigh,
  fetch52WeekLow
} from "../../api/analytics.js";

// Animation keyframes
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const beaconPulse = keyframes`
  0% { transform: scale(0.9); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.5; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
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
              radial-gradient(circle at 95% 95%, rgba(56, 189, 248, 0.02) 0%, transparent 50%);
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

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.06);
  border: 1px solid rgba(56, 189, 248, 0.15);
  padding: 5px 12px;
  border-radius: 30px;
  width: fit-content;
`;

const PulseDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  animation: ${beaconPulse} 2s infinite ease-in-out;
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

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SyncButton = styled.button`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Consensus Overview Box
const ConsensusSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ConsensusCard = styled.div`
  background: linear-gradient(135deg, rgba(18, 18, 24, 0.85) 0%, rgba(10, 10, 12, 0.95) 100%);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 3px;
    background: linear-gradient(90deg, #d4af37 0%, transparent 80%);
  }
`;

const ConsensusTitle = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConsensusMetrics = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

const BigNumber = styled.div`
  font-size: 48px;
  font-weight: 800;
  font-family: var(--font-syne), sans-serif;
  color: #ffffff;
  line-height: 1;

  span {
    font-size: 16px;
    font-weight: 600;
    color: #a8a29e;
    margin-left: 6px;
  }
`;

const SentimentMeter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  max-width: 280px;
`;

const ProgressBar = styled.div`
  height: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.02);
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${({ $percentage }) => $percentage || "50%"};
  background: linear-gradient(90deg, #d4af37 0%, #aa8453 100%);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  border-radius: 20px;
  transition: width 0.8s ease-in-out;
`;

const MetaLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  color: #8c8c9a;
  letter-spacing: 0.05em;
`;

const QuantumCard = styled.div`
  background: linear-gradient(135deg, rgba(10, 12, 18, 0.8) 0%, rgba(5, 5, 8, 0.95) 100%);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 3px;
    background: linear-gradient(90deg, #38bdf8 0%, transparent 80%);
  }
`;

const AlphaAssetsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const AlphaAssetBox = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.04);
    border-color: rgba(56, 189, 248, 0.25);
    transform: translateY(-2px);
  }
`;

const AlphaLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #38bdf8;
  letter-spacing: 0.05em;
`;

const AlphaVal = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
`;

const AlphaSubVal = styled.span`
  font-size: 11px;
  color: #8c8c9a;
`;

// Filter Tabs
const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.15);
    border-radius: 20px;
  }
`;

const TabButton = styled.button`
  background: ${({ $active }) => $active ? "rgba(212, 175, 55, 0.08)" : "transparent"};
  border: 1px solid ${({ $active }) => $active ? "rgba(212, 175, 55, 0.3)" : "rgba(255, 255, 255, 0.05)"};
  color: ${({ $active }) => $active ? "#d4af37" : "#8c8c9a"};
  padding: 10px 22px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  &:hover {
    color: #fff;
    border-color: rgba(212, 175, 55, 0.3);
    background: rgba(255, 255, 255, 0.01);
  }
`;

// Grid Layout for metrics
const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 32px;
`;

// Glassmorphism holographic card
const FuturisticCard = styled.div`
  background: rgba(18, 18, 22, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(25px);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; width: 3px; height: 100%;
    background: ${({ $color }) => $color || "#d4af37"};
    opacity: 0.8;
  }

  &:hover {
    border-color: ${({ $color }) => $color ? `${$color}40` : "rgba(212, 175, 55, 0.25)"};
    transform: translateY(-4px);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.4);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 16px;
`;

const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardHeadline = styled.h4`
  font-family: var(--font-syne), sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
    padding-left: 20px;
  }
`;

const AssetMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SymbolCode = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
`;

const CompanyLabel = styled.span`
  font-size: 11px;
  color: #7c7c8a;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ValueBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const ValueNumber = styled.span`
  font-size: 14.5px;
  font-weight: 700;
  font-family: monospace;
  color: ${({ $color }) => $color || "#ffffff"};
`;

// Dynamic horizontal filling line for relative visualization
const MiniVisualBar = styled.div`
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
`;

const MiniVisualFill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width || "40%"};
  background-color: ${({ $color }) => $color || "#d4af37"};
  border-radius: 10px;
`;

// Skeleton Loading
const SkeletonLine = styled.div`
  height: ${({ height }) => height || "15px"};
  width: ${({ width }) => width || "100%"};
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.01) 25%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.01) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonBlock = styled.div`
  background: rgba(18, 18, 22, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CenterState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  gap: 16px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(244, 63, 94, 0.05);
  border: 1px solid rgba(244, 63, 94, 0.15);
  color: #f43f5e;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function AnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [marketCap, setMarketCap] = useState([]);
  const [volume, setVolume] = useState([]);
  const [highs, setHighs] = useState([]);
  const [lows, setLows] = useState([]);
  
  const [activeTab, setActiveTab] = useState("all"); // "all", "movers", "liquidity", "limits"

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [g, l, mc, v, h, lw] = await Promise.all([
        fetchTopGainers(),
        fetchTopLosers(),
        fetchMarketCap(),
        fetchVolume(),
        fetch52WeekHigh(),
        fetch52WeekLow()
      ]);
      setGainers(g || []);
      setLosers(l || []);
      setMarketCap(mc || []);
      setVolume(v || []);
      setHighs(h || []);
      setLows(lw || []);
    } catch (err) {
      setError(err.message || "Failed to establish synchronization with the Analytics Engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Consensus calculations
  const calculateConsensus = () => {
    if (gainers.length === 0 && losers.length === 0) return { ratio: 50, rating: "Neutral Consensus", score: 50 };
    
    const avgGainerChange = gainers.reduce((acc, curr) => acc + curr.changePercent, 0) / (gainers.length || 1);
    const avgLoserChange = losers.reduce((acc, curr) => acc + Math.abs(curr.changePercent), 0) / (losers.length || 1);
    
    // Weighted index
    const totalMove = avgGainerChange + avgLoserChange;
    const ratio = totalMove > 0 ? (avgGainerChange / totalMove) * 100 : 50;
    
    let rating = "Neutral Consensus";
    if (ratio > 75) rating = "Extremely Bullish Rating";
    else if (ratio > 55) rating = "Moderately Bullish Rating";
    else if (ratio < 25) rating = "Extremely Bearish Rating";
    else if (ratio < 45) rating = "Moderately Bearish Rating";

    return {
      ratio: Math.round(ratio),
      rating,
      score: ratio.toFixed(1)
    };
  };

  const consensus = calculateConsensus();

  // Find dynamic alpha assets (highest marketcap and volume)
  const topCapAsset = marketCap.length > 0 ? marketCap[0] : null;
  const topVolumeAsset = volume.length > 0 ? volume[0] : null;

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <ContentContainer>
          {/* Header row */}
          <PageHeaderRow>
            <TitleBlock>
              <LivePulseContainer>
                <PulseDot />
                Algorithmic Engine Operational
              </LivePulseContainer>
              <Title>Quantum <span>Intelligence</span></Title>
              <Subtitle>Dynamic valuation thresholds, market divergences, and capital velocity vectors.</Subtitle>
            </TitleBlock>

            <ControlGroup>
              <SyncButton onClick={loadData} disabled={loading}>
                <RefreshCw size={14} className={loading ? "spin" : ""} />
                Execute Sync
              </SyncButton>
            </ControlGroup>
          </PageHeaderRow>

          {/* Dynamic computed consensus header section */}
          {!loading && !error && (
            <ConsensusSection>
              <ConsensusCard>
                <ConsensusTitle>
                  <Zap size={14} /> Market Consensus Index
                </ConsensusTitle>

                <ConsensusMetrics>
                  <BigNumber>
                    {consensus.score}<span>/ 100</span>
                  </BigNumber>

                  <SentimentMeter>
                    <MetaLabels>
                      <span>Bearish Vectors</span>
                      <span>Bullish Vectors</span>
                    </MetaLabels>
                    <ProgressBar>
                      <ProgressFill $percentage={`${consensus.ratio}%`} />
                    </ProgressBar>
                    <MetaLabels>
                      <span>{100 - consensus.ratio}%</span>
                      <span style={{ color: "#d4af37" }}>{consensus.ratio}%</span>
                    </MetaLabels>
                  </SentimentMeter>
                </ConsensusMetrics>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#10b981", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <Sparkles size={14} /> consensus vector indicates: {consensus.rating}
                </div>
              </ConsensusCard>

              <QuantumCard>
                <ConsensusTitle style={{ color: "#38bdf8" }}>
                  <Cpu size={14} /> Alpha Metrics Pipeline
                </ConsensusTitle>

                <AlphaAssetsGrid>
                  {topCapAsset && (
                    <AlphaAssetBox>
                      <AlphaLabel>Liquidity Anchor</AlphaLabel>
                      <AlphaVal>{topCapAsset.symbol}</AlphaVal>
                      <AlphaSubVal>₹{(topCapAsset.marketCap / 1e7).toFixed(1)} Cr Cap</AlphaSubVal>
                    </AlphaAssetBox>
                  )}

                  {topVolumeAsset && (
                    <AlphaAssetBox>
                      <AlphaLabel>Velocity Anchor</AlphaLabel>
                      <AlphaVal>{topVolumeAsset.symbol}</AlphaVal>
                      <AlphaSubVal>{(topVolumeAsset.volume / 1e6).toFixed(2)}M Shares</AlphaSubVal>
                    </AlphaAssetBox>
                  )}
                </AlphaAssetsGrid>
              </QuantumCard>
            </ConsensusSection>
          )}

          {/* Tabs Filter */}
          <TabContainer>
            <TabButton $active={activeTab === "all"} onClick={() => setActiveTab("all")}>All Matrices</TabButton>
            <TabButton $active={activeTab === "movers"} onClick={() => setActiveTab("movers")}>Divergent Movers</TabButton>
            <TabButton $active={activeTab === "liquidity"} onClick={() => setActiveTab("liquidity")}>Capital Pipelines</TabButton>
            <TabButton $active={activeTab === "limits"} onClick={() => setActiveTab("limits")}>Extreme Limits</TabButton>
          </TabContainer>

          {/* Core Analytics Grid */}
          {loading ? (
            <AnalyticsGrid>
              <SkeletonBlock>
                <SkeletonLine width="30%" height="20px" />
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </SkeletonBlock>
              <SkeletonBlock>
                <SkeletonLine width="30%" height="20px" />
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </SkeletonBlock>
              <SkeletonBlock>
                <SkeletonLine width="30%" height="20px" />
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </SkeletonBlock>
            </AnalyticsGrid>
          ) : error ? (
            <CenterState>
              <ErrorIcon>
                <AlertTriangle size={24} />
              </ErrorIcon>
              <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "18px", color: "#fff" }}>Sync Pipelines Broken</h4>
              <p style={{ maxWidth: "450px", fontSize: "14px" }}>{error}</p>
              <SyncButton onClick={loadData} style={{ background: "rgba(244, 63, 94, 0.12)", color: "#f43f5e", boxShadow: "none" }}>
                Retry Sync Code
              </SyncButton>
            </CenterState>
          ) : (
            <AnalyticsGrid>
              {/* Top Gainers */}
              {(activeTab === "all" || activeTab === "movers") && (
                <FuturisticCard $color="#10b981">
                  <CardHeader>
                    <CardTitleGroup>
                      <TrendingUp size={18} style={{ color: "#10b981" }} />
                      <CardHeadline>Top Gainers</CardHeadline>
                    </CardTitleGroup>
                  </CardHeader>

                  <List>
                    {gainers.map((item) => (
                      <ListItem key={item.symbol} onClick={() => router.push(`/dashboard/${item.symbol}`)}>
                        <AssetMeta>
                          <SymbolCode>{item.symbol}</SymbolCode>
                          <CompanyLabel>{item.name}</CompanyLabel>
                        </AssetMeta>

                        <ValueBox>
                          <ValueNumber $color="#10b981">+{item.changePercent.toFixed(2)}%</ValueNumber>
                          <MiniVisualBar>
                            <MiniVisualFill $width={`${Math.min(item.changePercent * 20, 100)}%`} $color="#10b981" />
                          </MiniVisualBar>
                        </ValueBox>
                      </ListItem>
                    ))}
                  </List>
                </FuturisticCard>
              )}

              {/* Top Losers */}
              {(activeTab === "all" || activeTab === "movers") && (
                <FuturisticCard $color="#f43f5e">
                  <CardHeader>
                    <CardTitleGroup>
                      <TrendingDown size={18} style={{ color: "#f43f5e" }} />
                      <CardHeadline>Top Losers</CardHeadline>
                    </CardTitleGroup>
                  </CardHeader>

                  <List>
                    {losers.map((item) => (
                      <ListItem key={item.symbol} onClick={() => router.push(`/dashboard/${item.symbol}`)}>
                        <AssetMeta>
                          <SymbolCode>{item.symbol}</SymbolCode>
                          <CompanyLabel>{item.name}</CompanyLabel>
                        </AssetMeta>

                        <ValueBox>
                          <ValueNumber $color="#f43f5e">{item.changePercent.toFixed(2)}%</ValueNumber>
                          <MiniVisualBar>
                            <MiniVisualFill $width={`${Math.min(Math.abs(item.changePercent) * 20, 100)}%`} $color="#f43f5e" />
                          </MiniVisualBar>
                        </ValueBox>
                      </ListItem>
                    ))}
                  </List>
                </FuturisticCard>
              )}

              {/* Market Capitalization */}
              {(activeTab === "all" || activeTab === "liquidity") && (
                <FuturisticCard $color="#d4af37">
                  <CardHeader>
                    <CardTitleGroup>
                      <DollarSign size={18} style={{ color: "#d4af37" }} />
                      <CardHeadline>Capital pipelines</CardHeadline>
                    </CardTitleGroup>
                  </CardHeader>

                  <List>
                    {marketCap.map((item) => (
                      <ListItem key={item.symbol} onClick={() => router.push(`/dashboard/${item.symbol}`)}>
                        <AssetMeta>
                          <SymbolCode>{item.symbol}</SymbolCode>
                          <CompanyLabel>{item.name}</CompanyLabel>
                        </AssetMeta>

                        <ValueBox>
                          <ValueNumber $color="#d4af37">
                            ₹{(item.marketCap / 1e7).toLocaleString(undefined, { maximumFractionDigits: 1 })} Cr
                          </ValueNumber>
                          <MiniVisualBar>
                            <MiniVisualFill $width="75%" $color="#d4af37" />
                          </MiniVisualBar>
                        </ValueBox>
                      </ListItem>
                    ))}
                  </List>
                </FuturisticCard>
              )}

              {/* Volume Leaders */}
              {(activeTab === "all" || activeTab === "liquidity") && (
                <FuturisticCard $color="#38bdf8">
                  <CardHeader>
                    <CardTitleGroup>
                      <Activity size={18} style={{ color: "#38bdf8" }} />
                      <CardHeadline>Volume Leaders</CardHeadline>
                    </CardTitleGroup>
                  </CardHeader>

                  <List>
                    {volume.map((item) => (
                      <ListItem key={item.symbol} onClick={() => router.push(`/dashboard/${item.symbol}`)}>
                        <AssetMeta>
                          <SymbolCode>{item.symbol}</SymbolCode>
                          <CompanyLabel>{item.name}</CompanyLabel>
                        </AssetMeta>

                        <ValueBox>
                          <ValueNumber $color="#38bdf8">
                            {(item.volume / 1e6).toFixed(2)}M
                          </ValueNumber>
                          <MiniVisualBar>
                            <MiniVisualFill $width="60%" $color="#38bdf8" />
                          </MiniVisualBar>
                        </ValueBox>
                      </ListItem>
                    ))}
                  </List>
                </FuturisticCard>
              )}

              {/* 52-Week Highs */}
              {(activeTab === "all" || activeTab === "limits") && (
                <FuturisticCard $color="#a855f7">
                  <CardHeader>
                    <CardTitleGroup>
                      <BarChart2 size={18} style={{ color: "#a855f7" }} />
                      <CardHeadline>52-Week Highs</CardHeadline>
                    </CardTitleGroup>
                  </CardHeader>

                  <List>
                    {highs.map((item) => (
                      <ListItem key={item.symbol} onClick={() => router.push(`/dashboard/${item.symbol}`)}>
                        <AssetMeta>
                          <SymbolCode>{item.symbol}</SymbolCode>
                          <CompanyLabel>{item.name}</CompanyLabel>
                        </AssetMeta>

                        <ValueBox>
                          <ValueNumber $color="#a855f7">
                            ₹{item.high52Week.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                          </ValueNumber>
                          <MiniVisualBar>
                            <MiniVisualFill $width="90%" $color="#a855f7" />
                          </MiniVisualBar>
                        </ValueBox>
                      </ListItem>
                    ))}
                  </List>
                </FuturisticCard>
              )}

              {/* 52-Week Lows */}
              {(activeTab === "all" || activeTab === "limits") && (
                <FuturisticCard $color="#ec4899">
                  <CardHeader>
                    <CardTitleGroup>
                      <BarChart2 size={18} style={{ color: "#ec4899" }} />
                      <CardHeadline>52-Week Lows</CardHeadline>
                    </CardTitleGroup>
                  </CardHeader>

                  <List>
                    {lows.length === 0 ? (
                      <div style={{ textAlign: "center", color: "#8c8c9a", fontSize: "13px", padding: "30px 10px" }}>
                        No entities trading near low threshold envelopes.
                      </div>
                    ) : (
                      lows.map((item) => (
                        <ListItem key={item.symbol} onClick={() => router.push(`/dashboard/${item.symbol}`)}>
                          <AssetMeta>
                            <SymbolCode>{item.symbol}</SymbolCode>
                            <CompanyLabel>{item.name}</CompanyLabel>
                          </AssetMeta>

                          <ValueBox>
                            <ValueNumber $color="#ec4899">
                              ₹{item.low52Week.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                            </ValueNumber>
                            <MiniVisualBar>
                              <MiniVisualFill $width="25%" $color="#ec4899" />
                            </MiniVisualBar>
                          </ValueBox>
                        </ListItem>
                      ))
                    )}
                  </List>
                </FuturisticCard>
              )}
            </AnalyticsGrid>
          )}
        </ContentContainer>
      </MainPanel>
    </DashboardWrapper>
  );
}
