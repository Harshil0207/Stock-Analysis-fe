"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Compass, 
  Search, 
  TrendingUp, 
  Activity, 
  Layers, 
  Globe, 
  Cpu, 
  DollarSign, 
  Zap, 
  Award, 
  ChevronRight, 
  Star,
  ExternalLink,
  Flame
} from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../Dashboard/ui/components/Sidebar.js";
import Header from "../../../Dashboard/ui/components/Header.js";
import TradingViewTickerTape from "../../../Dashboard/ui/components/TradingViewTickerTape.js";
import { fetchStockQuote } from "../../../Dashboard/api/stocks.js";

const collectionsData = [
  {
    id: 1,
    title: "Quantum Growth Leaders",
    description: "Algorithmic selection targeting companies pioneering next-gen artificial intelligence, semiconductors, and automated logistics.",
    icon: <Cpu size={18} />,
    color: "#38bdf8",
    popularity: "High Heat",
    tags: ["TATAMOTORS.NS", "TCS.NS", "INFY.NS"],
    category: "equities"
  },
  {
    id: 2,
    title: "Sovereign Yield Anchors",
    description: "Commodity hedges, inflation index vectors, and energy reserves built to guard capital reserves during macroeconomic shifts.",
    icon: <Globe size={18} />,
    color: "#d4af37",
    popularity: "Institutional",
    tags: ["GOLD1!", "OIL1!", "BRENT1!"],
    category: "commodities"
  },
  {
    id: 3,
    title: "Platinum Blue Chips",
    description: "Premium large-cap enterprises selected for consistent dividend outputs, capital moat dominance, and strong liquidity reserves.",
    icon: <Award size={18} />,
    color: "#a855f7",
    popularity: "Dividend Focused",
    tags: ["RELIANCE.NS", "HDFCBANK.NS", "TCS.NS"],
    category: "equities"
  },
  {
    id: 4,
    title: "Crypto Innovation Vectors",
    description: "Leading decentralized digital ledger platforms positioned for network transaction speed scaling and high-growth potential.",
    icon: <Zap size={18} />,
    color: "#ec4899",
    popularity: "High Volatility",
    tags: ["BTCUSD", "ETHUSD", "SOLUSD"],
    category: "crypto"
  }
];

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "equities", "commodities", "crypto"

  const [sectors, setSectors] = useState([
    { name: "Information Technology", change: "+2.14%", isUp: true, weight: "85%" },
    { name: "Banking & Financials", change: "+1.85%", isUp: true, weight: "72%" },
    { name: "Consumer Goods & FMCG", change: "+0.42%", isUp: true, weight: "40%" },
    { name: "Energy & Infrastructure", change: "-0.95%", isUp: false, weight: "30%" },
    { name: "Automotive & Industrial", change: "+2.85%", isUp: true, weight: "92%" },
    { name: "Pharmaceuticals & Healthcare", change: "-0.32%", isUp: false, weight: "22%" }
  ]);

  const [hotAssets, setHotAssets] = useState([
    { symbol: "TATAMOTORS.NS", name: "Tata Motors Ltd.", price: "₹985.00", change: "+2.85%", isUp: true },
    { symbol: "TCS.NS", name: "Tata Consultancy Services", price: "₹3,825.00", change: "+1.25%", isUp: true },
    { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd.", price: "₹2,455.00", change: "+0.85%", isUp: true },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd.", price: "₹1,565.00", change: "-0.65%", isUp: false },
    { symbol: "INFY.NS", name: "Infosys Limited", price: "₹1,645.00", change: "+1.15%", isUp: true }
  ]);

  useEffect(() => {
    let active = true;

    const updateQuotes = async () => {
      try {
        const symbols = ["TATAMOTORS.NS", "TCS.NS", "RELIANCE.NS", "HDFCBANK.NS", "INFY.NS", "ITC.NS", "SUNPHARMA.NS"];
        const quotes = {};

        await Promise.all(
          symbols.map(async (sym) => {
            try {
              const q = await fetchStockQuote(sym);
              if (q) {
                quotes[sym] = q;
              }
            } catch (err) {
              console.warn(`Failed to fetch quote for ${sym}:`, err);
            }
          })
        );

        if (!active) return;

        // Update hot assets
        setHotAssets((prev) =>
          prev.map((asset) => {
            const q = quotes[asset.symbol];
            if (q) {
              const isUp = q.dp >= 0;
              return {
                ...asset,
                price: `₹${q.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: `${isUp ? "+" : ""}${q.dp.toFixed(2)}%`,
                isUp,
              };
            }
            return asset;
          })
        );

        // Update sectors
        setSectors((prev) =>
          prev.map((sec) => {
            let symbolToUse;
            if (sec.name === "Information Technology") symbolToUse = "TCS.NS";
            else if (sec.name === "Banking & Financials") symbolToUse = "HDFCBANK.NS";
            else if (sec.name === "Consumer Goods & FMCG") symbolToUse = "ITC.NS";
            else if (sec.name === "Energy & Infrastructure") symbolToUse = "RELIANCE.NS";
            else if (sec.name === "Automotive & Industrial") symbolToUse = "TATAMOTORS.NS";
            else if (sec.name === "Pharmaceuticals & Healthcare") symbolToUse = "SUNPHARMA.NS";

            const q = quotes[symbolToUse];
            if (q) {
              const isUp = q.dp >= 0;
              const weightValue = Math.min(Math.max(50 + q.dp * 10, 10), 100);
              return {
                ...sec,
                change: `${isUp ? "+" : ""}${q.dp.toFixed(2)}%`,
                isUp,
                weight: `${weightValue}%`,
              };
            }
            return sec;
          })
        );
      } catch (err) {
        console.error("Explore page quote update error:", err);
      }
    };

    updateQuotes();
    const interval = setInterval(updateQuotes, 10000); // Poll every 10 seconds

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Filter collections
  const filteredCollections = collectionsData.filter(col => {
    const matchesTab = activeTab === "all" || col.category === activeTab;
    const matchesSearch = col.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          col.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          col.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <TradingViewTickerTape />

        <ContentContainer>
          {/* Header */}
          <PageHeaderRow>
            <TitleBlock>
              <LivePulseContainer>
                <PulseDot />
                Discovery Pipeline Connected
              </LivePulseContainer>
              <Title>Alpha Asset <span>Discovery</span></Title>
              <Subtitle>Screener heatmaps, themed portfolios, and institutional-grade collection templates.</Subtitle>
            </TitleBlock>

            <ControlGroup>
              <SearchBox>
                <SearchInput 
                  type="text" 
                  placeholder="Search assets, collections..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              </SearchBox>
            </ControlGroup>
          </PageHeaderRow>

          {/* Navigation Category Tabs */}
          <TabContainer>
            <TabButton $active={activeTab === "all"} onClick={() => setActiveTab("all")}>All Assets</TabButton>
            <TabButton $active={activeTab === "equities"} onClick={() => setActiveTab("equities")}>Equities</TabButton>
            <TabButton $active={activeTab === "commodities"} onClick={() => setActiveTab("commodities")}>Commodities</TabButton>
            <TabButton $active={activeTab === "crypto"} onClick={() => setActiveTab("crypto")}>Cryptocurrencies</TabButton>
          </TabContainer>

          {/* Curated Thematic Collections */}
          <div>
            <SectionTitle>
              <Star size={16} /> Curated Thematic Pools
            </SectionTitle>
            <p style={{ fontSize: "13px", color: "#8c8c9a", marginBottom: "20px" }}>
              Pre-configured asset grouping models based on institutional momentum algorithms.
            </p>

            {filteredCollections.length === 0 ? (
              <EmptyState style={{ padding: "40px 0" }}>
                <Compass size={24} />
                <span style={{ fontSize: "13px" }}>No curated pools matching the selected criteria.</span>
              </EmptyState>
            ) : (
              <CollectionsGrid>
                {filteredCollections.map(col => (
                  <CollectionCard key={col.id} $color={col.color}>
                    <CardHeader>
                      <IconWrapper $color={col.color}>
                        {col.icon}
                      </IconWrapper>
                      <PopularityBadge>{col.popularity}</PopularityBadge>
                    </CardHeader>

                    <CollectionTitle>{col.title}</CollectionTitle>
                    <CollectionDescription>{col.description}</CollectionDescription>

                    <TagRow>
                      {col.tags.map((tag, idx) => (
                        <MiniTag key={idx} onClick={() => router.push(`/dashboard/${tag}`)}>{tag}</MiniTag>
                      ))}
                    </TagRow>
                  </CollectionCard>
                ))}
              </CollectionsGrid>
            )}
          </div>

          {/* Sector heat vectors & trending lists */}
          <PerformanceGrid>
            {/* Sector Heat vectors */}
            <GlassPanel>
              <SectionTitle style={{ marginTop: 0, marginBottom: "20px" }}>
                <Activity size={16} /> Sector Heat Vectors
              </SectionTitle>

              <div>
                {sectors.map((sec, idx) => (
                  <SectorRow key={idx}>
                    <SectorInfo>
                      <SectorName>{sec.name}</SectorName>
                    </SectorInfo>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <SectorBarContainer>
                        <SectorBarFill $width={sec.weight} $isUp={sec.isUp} />
                      </SectorBarContainer>
                      <SectorChange $isUp={sec.isUp}>
                        {sec.change}
                      </SectorChange>
                    </div>
                  </SectorRow>
                ))}
              </div>
            </GlassPanel>

            {/* Live Trending assets */}
            <GlassPanel>
              <SectionTitle style={{ marginTop: 0, marginBottom: "20px", color: "#38bdf8" }}>
                <Flame size={16} /> Momentum Radar
              </SectionTitle>

              <AssetTable>
                <thead>
                  <tr>
                    <Th>Symbol</Th>
                    <Th style={{ textAlign: "right" }}>Price</Th>
                    <Th style={{ textAlign: "right" }}>Change</Th>
                  </tr>
                </thead>
                <tbody>
                  {hotAssets.map((asset, idx) => (
                    <ClickableTr key={idx} onClick={() => router.push(`/dashboard/${asset.symbol}`)}>
                      <Td>
                        <div style={{ fontWeight: "700", color: "#ffffff" }}>{asset.symbol}</div>
                        <div style={{ fontSize: "11px", color: "#8c8c9a" }}>{asset.name}</div>
                      </Td>
                      <Td style={{ textAlign: "right", fontFamily: "monospace", fontWeight: "600" }}>{asset.price}</Td>
                      <Td style={{ textAlign: "right", color: asset.isUp ? "#10b981" : "#f43f5e", fontFamily: "monospace", fontWeight: "700" }}>
                        {asset.change}
                      </Td>
                    </ClickableTr>
                  ))}
                </tbody>
              </AssetTable>
            </GlassPanel>
          </PerformanceGrid>
        </ContentContainer>
      </MainPanel>
    </DashboardWrapper>
  );
}

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const beaconPulse = keyframes`
  0% { transform: scale(0.9); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.5; }
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
  color: #d4af37;
  background: rgba(212, 175, 55, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.15);
  padding: 5px 12px;
  border-radius: 30px;
  width: fit-content;
`;

const PulseDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #d4af37;
  box-shadow: 0 0 8px #d4af37;
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
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 576px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 42px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.02);
    box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.2);
  }

  &::placeholder {
    color: #4a4a58;
  }
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
  padding: 10px 20px;
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

// Curated collections
const SectionTitle = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #e5c158;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 4px;
`;

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const CollectionCard = styled.div`
  background: linear-gradient(135deg, rgba(18, 18, 22, 0.85) 0%, rgba(8, 8, 10, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-top: 2px solid ${({ $color }) => $color || "#d4af37"};
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ $color }) => $color || "#d4af37"};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || "#d4af37"};
`;

const PopularityBadge = styled.span`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #8c8c9a;
  letter-spacing: 0.05em;
`;

const CollectionTitle = styled.h4`
  font-family: var(--font-syne), sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
`;

const CollectionDescription = styled.p`
  font-size: 13px;
  color: #8c8c9a;
  line-height: 1.5;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const MiniTag = styled.span`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-family: monospace;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: rgba(212, 175, 55, 0.3);
    background: rgba(212, 175, 55, 0.05);
  }
`;

// Heatmap / Sector performance grid
const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const GlassPanel = styled.div`
  background: rgba(18, 18, 22, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(20px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
`;

const SectorRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.05);
    padding-left: 24px;
  }
`;

const SectorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SectorName = styled.span`
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
`;

const SectorChange = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isUp }) => $isUp ? "#10b981" : "#f43f5e"};
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ $isUp }) => $isUp ? "rgba(16, 185, 129, 0.06)" : "rgba(244, 63, 94, 0.06)"};
  border: 1px solid ${({ $isUp }) => $isUp ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"};
  padding: 4px 10px;
  border-radius: 8px;
`;

const SectorBarContainer = styled.div`
  width: 140px;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;

  @media (max-width: 576px) {
    display: none;
  }
`;

const SectorBarFill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width || "50%"};
  background: ${({ $isUp }) => $isUp ? "linear-gradient(90deg, #10b981 0%, #059669 100%)" : "linear-gradient(90deg, #f43f5e 0%, #be123c 100%)"};
  border-radius: 10px;
`;

// Hot assets table
const AssetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
`;

const Th = styled.th`
  padding: 14px 16px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.08em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
`;

const ClickableTr = styled.tr`
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.015);
  }
`;
