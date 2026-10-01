"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { 
  Newspaper, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  ExternalLink,
  Search,
  Clock,
  BookOpen,
  Filter,
  ArrowRight,
  TrendingDown,
  Info,
  Layers,
  Percent
} from "lucide-react";
import Sidebar from "../../../Dashboard/ui/components/Sidebar.js";
import Header from "../../../Dashboard/ui/components/Header.js";
import TradingViewTickerTape from "../../../Dashboard/ui/components/TradingViewTickerTape.js";
import { fetchGeneralNews, fetchLatestNews, fetchTrendingNews } from "../../api/news.js";

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
              radial-gradient(circle at 95% 95%, rgba(16, 185, 129, 0.03) 0%, transparent 50%);
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

// Sentiment analysis banner
const SentimentBanner = styled.div`
  background: rgba(18, 18, 22, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  backdrop-filter: blur(15px);
`;

const SentimentLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`;

const IndicatorBadge = styled.span`
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.25);
  background: rgba(212, 175, 55, 0.05);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const SentimentMeterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const MeterBar = styled.div`
  height: 8px;
  background: rgba(244, 63, 94, 0.15);
  border-radius: 10px;
  flex: 1;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.02);
`;

const MeterFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 82%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
`;

const MeterLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 11px;
  font-weight: 700;
  font-family: monospace;
`;

const SentimentRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
  text-transform: uppercase;
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

// Editorial Hero magazine element
const HeroEditorialCard = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: linear-gradient(135deg, rgba(15, 15, 18, 0.9) 0%, rgba(8, 8, 10, 0.95) 100%);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 
    0 30px 70px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 380px;

  &:hover {
    border-color: rgba(212, 175, 55, 0.35);
    box-shadow: 0 40px 90px rgba(212, 175, 55, 0.06);
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const HeroImageArea = styled.div`
  background-image: url("/images/news-hero.png");
  background-size: cover;
  background-position: center;
  position: relative;
  min-height: 250px;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to right, transparent 50%, rgba(10, 10, 12, 0.95) 100%),
                linear-gradient(to bottom, transparent 60%, rgba(10, 10, 12, 0.8) 100%);
  }

  @media (max-width: 992px) {
    &::before {
      background: linear-gradient(to bottom, transparent 40%, rgba(10, 10, 12, 0.95) 100%);
    }
  }
`;

const HeroBadge = styled.span`
  position: absolute;
  top: 24px;
  left: 24px;
  background: rgba(212, 175, 55, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #000;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
`;

const HeroTextArea = styled.div`
  padding: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  background-color: rgba(10, 10, 12, 0.45);
  backdrop-filter: blur(5px);

  @media (max-width: 576px) {
    padding: 24px;
  }
`;

const HeroImpactGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

const ImpactBadge = styled.span`
  background: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.25);
  color: #f43f5e;
  padding: 3px 8px;
  border-radius: 6px;
`;

const HeroHeadline = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  line-height: 1.3;
  letter-spacing: -0.01em;

  span {
    color: #d4af37;
  }
`;

const HeroSummary = styled.p`
  color: #a8a29e;
  font-size: 14.5px;
  line-height: 1.6;
`;

const HeroFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 20px;
  margin-top: 10px;
  font-size: 12px;
`;

const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

// News Cards layout
const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BlockTitle = styled.h4`
  font-family: var(--font-syne), sans-serif;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #e5c158;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

const NewsCard = styled.article`
  background: rgba(18, 18, 22, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-left: 3px solid #d4af37;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  &:hover {
    background: rgba(18, 18, 22, 0.65);
    border-color: rgba(212, 175, 55, 0.25);
    border-left-color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
`;

const SourceTag = styled.span`
  color: #aa8453;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const MetaDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7c7c8a;
`;

const CardHeadline = styled.h5`
  font-family: var(--font-syne), sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.45;
  transition: color 0.2s ease;

  ${NewsCard}:hover & {
    color: #d4af37;
  }
`;

const CardSummary = styled.p`
  font-size: 13.5px;
  color: #9898a6;
  line-height: 1.55;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;

const ReadLink = styled.a`
  font-size: 11.5px;
  font-weight: 700;
  color: #d4af37;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: all 0.2s ease;

  &:hover {
    gap: 8px;
    color: #fff;
  }
`;

// Sidebar widgets
const LuxuryWidget = styled.div`
  background: rgba(18, 18, 22, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 28px;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WidgetTitle = styled.h4`
  font-family: var(--font-syne), sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 16px;
`;

const TrendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TrendingRow = styled.div`
  display: flex;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const TrendIconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $isDown }) => $isDown ? "rgba(244, 63, 94, 0.06)" : "rgba(16, 185, 129, 0.06)"};
  border: 1px solid ${({ $isDown }) => $isDown ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)"};
  color: ${({ $isDown }) => $isDown ? "#f43f5e" : "#10b981"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TrendTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TrendSource = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #8c8c9a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TrendHeadline = styled.h6`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
`;

// Skeleton Loading components
const SkeletonText = styled.div`
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
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// Empty states
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

export default function NewsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [generalNews, setGeneralNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "macro", "equities", "sovereign"

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const [g, l, t] = await Promise.all([
        fetchGeneralNews(),
        fetchLatestNews(),
        fetchTrendingNews()
      ]);
      setGeneralNews(g || []);
      setLatestNews(l || []);
      setTrendingNews(t || []);
    } catch (err) {
      setError(err.message || "Failed to establish secure news pipelines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Filter logic based on tab selection + search input
  const getFilteredNews = (newsArray) => {
    let result = newsArray;

    // Filter by tab keywords
    if (activeTab === "macro") {
      result = result.filter(item => 
        /inflation|rate|fed|economy|market|treasury|bond|gdp|central bank/i.test(item.headline + " " + item.summary)
      );
    } else if (activeTab === "equities") {
      result = result.filter(item => 
        /share|stock|equity|earnings|profit|revenue|ceo|dividend|quarter/i.test(item.headline + " " + item.summary)
      );
    } else if (activeTab === "sovereign") {
      result = result.filter(item => 
        /sovereign|government|china|india|us|germany|policy|regulation|sanction/i.test(item.headline + " " + item.summary)
      );
    }

    // Filter by search keyword
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.headline && item.headline.toLowerCase().includes(term)) ||
        (item.summary && item.summary.toLowerCase().includes(term)) ||
        (item.source && item.source.toLowerCase().includes(term))
      );
    }

    return result;
  };

  const filteredGeneral = getFilteredNews(generalNews);
  const filteredTrending = getFilteredNews(trendingNews);
  const filteredLatest = getFilteredNews(latestNews);

  const featuredStory = filteredGeneral.length > 0 ? filteredGeneral[0] : null;
  const standardFeed = featuredStory ? filteredGeneral.slice(1) : filteredGeneral;

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <TradingViewTickerTape />

        <ContentContainer>
          {/* Header Row */}
          <PageHeaderRow>
            <TitleBlock>
              <LivePulseContainer>
                <PulseDot />
                Live Market Broadcasts Active
              </LivePulseContainer>
              <Title>Sovereign <span>Intelligence</span></Title>
              <Subtitle>Institutional macroeconomic reporting, technical consensus indicators, and analyst transcripts.</Subtitle>
            </TitleBlock>

            <ControlGroup>
              <SearchBox>
                <SearchInput 
                  type="text" 
                  placeholder="Filter market wire..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              </SearchBox>

              <SyncButton onClick={loadNews} disabled={loading}>
                <RefreshCw size={14} className={loading ? "spin" : ""} />
                Sync Wire
              </SyncButton>
            </ControlGroup>
          </PageHeaderRow>

          {/* Sentiment Analysis Bar */}
          <SentimentBanner>
            <SentimentLeft>
              <Info size={16} style={{ color: "#d4af37" }} />
              <span>Technical Consensus Rating:</span>
              <IndicatorBadge>Bullish Sentiment</IndicatorBadge>
            </SentimentLeft>

            <SentimentMeterWrapper>
              <MeterLabels>
                <span style={{ color: "#f43f5e" }}>BEARISH (18%)</span>
                <span style={{ color: "#10b981" }}>BULLISH (82%)</span>
              </MeterLabels>
              <MeterBar>
                <MeterFill />
              </MeterBar>
            </SentimentMeterWrapper>

            <SentimentRating>
              <TrendingUp size={16} />
              Strong Buy Recommendation
            </SentimentRating>
          </SentimentBanner>

          {/* Navigation Category Tabs */}
          <TabContainer>
            <TabButton $active={activeTab === "all"} onClick={() => setActiveTab("all")}>All Transmissions</TabButton>
            <TabButton $active={activeTab === "macro"} onClick={() => setActiveTab("macro")}>Macroeconomic Wire</TabButton>
            <TabButton $active={activeTab === "equities"} onClick={() => setActiveTab("equities")}>Corporate Equities</TabButton>
            <TabButton $active={activeTab === "sovereign"} onClick={() => setActiveTab("sovereign")}>Sovereign Policies</TabButton>
          </TabContainer>

          {/* Loading or Main Content */}
          {loading ? (
            <ColumnGrid>
              <SectionBlock>
                <SkeletonBlock style={{ height: "300px" }}>
                  <SkeletonText width="20%" height="24px" />
                  <SkeletonText width="80%" height="32px" />
                  <SkeletonText width="95%" height="80px" />
                </SkeletonBlock>
                <SkeletonBlock>
                  <SkeletonText width="15%" />
                  <SkeletonText width="75%" height="24px" />
                  <SkeletonText width="90%" height="50px" />
                </SkeletonBlock>
              </SectionBlock>

              <SectionBlock>
                <SkeletonBlock>
                  <SkeletonText width="40%" height="20px" />
                  <SkeletonText width="95%" />
                  <SkeletonText width="90%" />
                </SkeletonBlock>
              </SectionBlock>
            </ColumnGrid>
          ) : error ? (
            <CenterState>
              <ErrorIcon>
                <AlertTriangle size={24} />
              </ErrorIcon>
              <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "18px", color: "#fff" }}>Secure Connection Interrupted</h4>
              <p style={{ maxWidth: "450px", fontSize: "14px" }}>{error}</p>
              <SyncButton onClick={loadNews} style={{ background: "rgba(244, 63, 94, 0.12)", color: "#f43f5e", boxShadow: "none" }}>
                Re-establish Connection
              </SyncButton>
            </CenterState>
          ) : (
            <>
              {/* Featured Cover Story */}
              {featuredStory && (
                <HeroEditorialCard>
                  <HeroImageArea>
                    <HeroBadge>Sovereign Bulletin</HeroBadge>
                  </HeroImageArea>

                  <HeroTextArea>
                    <HeroImpactGroup>
                      <ImpactBadge>High Impact Rating</ImpactBadge>
                      <span style={{ color: "#8c8c9a" }}>• {featuredStory.source || "FINANCIAL WIRE"}</span>
                    </HeroImpactGroup>

                    <HeroHeadline>
                      {featuredStory.headline}
                    </HeroHeadline>

                    <HeroSummary>
                      {featuredStory.summary}
                    </HeroSummary>

                    <HeroFooter>
                      {featuredStory.datetime && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7c7c8a" }}>
                          <Clock size={12} />
                          Synchronized {new Date(featuredStory.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}

                      {featuredStory.url && (
                        <ReadLink href={featuredStory.url} target="_blank" rel="noreferrer">
                          Access Intelligence <ArrowRight size={12} />
                        </ReadLink>
                      )}
                    </HeroFooter>
                  </HeroTextArea>
                </HeroEditorialCard>
              )}

              {/* Multi-Column Grid */}
              <ColumnGrid>
                {/* General bulletins column */}
                <SectionBlock>
                  <BlockTitle>
                    <Globe size={16} /> Live Wire Transmission Feed
                  </BlockTitle>

                  {standardFeed.length === 0 && !featuredStory ? (
                    <CenterState style={{ padding: "60px 0" }}>
                      <Newspaper size={32} style={{ color: "#d4af37", opacity: 0.5 }} />
                      <h5 style={{ color: "#fff", fontSize: "15px" }}>No Bulletins Found</h5>
                      <p style={{ fontSize: "13px" }}>No items matching the selected filters are currently registered in the feed.</p>
                    </CenterState>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {standardFeed.map((item, idx) => (
                        <NewsCard key={item.id || idx}>
                          <CardMeta>
                            <SourceTag>{item.source || "MARKET DESK"}</SourceTag>
                            {item.datetime && (
                              <MetaDate>
                                <Clock size={11} />
                                {new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </MetaDate>
                            )}
                          </CardMeta>
                          <CardHeadline>{item.headline}</CardHeadline>
                          <CardSummary>{item.summary}</CardSummary>
                          <CardFooter>
                            {item.url && (
                              <ReadLink href={item.url} target="_blank" rel="noreferrer">
                                Open Article <ExternalLink size={11} />
                              </ReadLink>
                            )}
                          </CardFooter>
                        </NewsCard>
                      ))}
                    </div>
                  )}
                </SectionBlock>

                {/* Sidebar widget updates column */}
                <SectionBlock>
                  {/* Trending Widget */}
                  <LuxuryWidget>
                    <WidgetTitle>
                      <TrendingUp size={16} style={{ color: "#10b981" }} /> Real-time Hot Topics
                    </WidgetTitle>

                    {filteredTrending.length === 0 ? (
                      <p style={{ fontSize: "12px", color: "#7c7c8a", textAlign: "center", padding: "12px 0" }}>No matching alerts found.</p>
                    ) : (
                      <TrendingList>
                        {filteredTrending.map((item, idx) => (
                          <TrendingRow key={item.id || idx}>
                            <TrendIconBox $isDown={idx % 3 === 0}>
                              {idx % 3 === 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            </TrendIconBox>

                            <TrendTextGroup>
                              <TrendSource>
                                {item.source || "TRENDING"} • {item.datetime && new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </TrendSource>
                              <TrendHeadline>{item.headline}</TrendHeadline>
                            </TrendTextGroup>
                          </TrendingRow>
                        ))}
                      </TrendingList>
                    )}
                  </LuxuryWidget>

                  {/* Intraday Briefings Widget */}
                  <LuxuryWidget>
                    <WidgetTitle>
                      <Activity size={16} style={{ color: "#38bdf8" }} /> Analyst Bulletins
                    </WidgetTitle>

                    {filteredLatest.length === 0 ? (
                      <p style={{ fontSize: "12px", color: "#7c7c8a", textAlign: "center", padding: "12px 0" }}>No active briefing wire.</p>
                    ) : (
                      <TrendingList>
                        {filteredLatest.map((item, idx) => (
                          <TrendingRow key={item.id || idx}>
                            <TrendIconBox $isDown={false} style={{ color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.2)", background: "rgba(56, 189, 248, 0.05)" }}>
                              <Layers size={14} />
                            </TrendIconBox>

                            <TrendTextGroup>
                              <TrendSource>
                                {item.source || "ANALYST"} • {item.datetime && new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </TrendSource>
                              <TrendHeadline>{item.headline}</TrendHeadline>
                            </TrendTextGroup>
                          </TrendingRow>
                        ))}
                      </TrendingList>
                    )}
                  </LuxuryWidget>
                </SectionBlock>
              </ColumnGrid>
            </>
          )}
        </ContentContainer>
      </MainPanel>
    </DashboardWrapper>
  );
}
