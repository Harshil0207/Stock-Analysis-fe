"use client";

import React, { use, useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Calendar,
  Globe,
  Landmark,
  Newspaper,
  Activity,
  TrendingUp,
  Percent,
  Coins,
} from "lucide-react";
import Sidebar from "../../../imports/Dashboard/ui/components/Sidebar.js";
import Header from "../../../imports/Dashboard/ui/components/Header.js";
import OrderForm from "../../../imports/Dashboard/ui/components/OrderForm.js";
import { useToast } from "../../../lib/toast.js";
import {
  fetchStockQuote,
  fetchCompanyNews,
  fetchCompanyProfile,
  fetchStockLineChart,
} from "../../../imports/Dashboard/api/stocks.js";

export default function StockDetailPage({ params }) {
  const resolvedParams = use(params);
  const symbol = resolvedParams.symbol.toUpperCase();
  const toast = useToast();

  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [news, setNews] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState("tv"); // default to TV chart

  const isIndian =
    symbol.endsWith(".NS") || symbol === "NIFTY50" || symbol === "BANKNIFTY";
  const currencySymbol = isIndian ? "₹" : "$";

  const formatMarketCap = (val) => {
    if (!val) return "N/A";
    if (isIndian) {
      return `₹${(val / 10000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;
    } else {
      if (val >= 1000000000) {
        return `$${(val / 1000000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} B`;
      }
      return `$${(val / 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`;
    }
  };

  let formattedTVSymbol = symbol;
  if (symbol.endsWith(".NS")) {
    formattedTVSymbol = `NSE:${symbol.replace(".NS", "")}`;
  } else if (symbol.endsWith(".BO")) {
    formattedTVSymbol = `BSE:${symbol.replace(".BO", "")}`;
  } else if (symbol === "NIFTY50") {
    formattedTVSymbol = "NSE:NIFTY";
  } else if (symbol === "BANKNIFTY") {
    formattedTVSymbol = "NSE:BANKNIFTY";
  }

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      try {
        const [qData, pData, nData, cData] = await Promise.all([
          fetchStockQuote(symbol),
          fetchCompanyProfile(symbol),
          fetchCompanyNews(symbol),
          fetchStockLineChart(symbol),
        ]);

        if (active) {
          if (qData) setQuote(qData);
          if (pData) setProfile(pData);
          if (nData) setNews(nData.slice(0, 4));
          if (cData) setChartData(cData);
        }
      } catch (err) {
        console.error("Failed to load details:", err);
      }
    };

    loadDetails();
    const interval = setInterval(async () => {
      try {
        const qData = await fetchStockQuote(symbol);
        const cData = await fetchStockLineChart(symbol);
        if (active) {
          if (qData) setQuote(qData);
          if (cData) setChartData(cData);
        }
      } catch (e) {}
    }, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [symbol]);

  useEffect(() => {
    if (activeTab !== "tv") return;

    let script;
    const initWidget = () => {
      if (
        typeof window !== "undefined" &&
        window.TradingView &&
        document.getElementById("tradingview-chart-container")
      ) {
        new window.TradingView.widget({
          width: "100%",
          height: 380,
          symbol: formattedTVSymbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: "tradingview-chart-container",
        });
      }
    };

    if (typeof window !== "undefined") {
      if (!window.TradingView) {
        script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);
      } else {
        // Allow container to mount before rendering widget
        setTimeout(initWidget, 50);
      }
    }

    return () => {
      if (script && document.head.contains(script)) {
        try {
          document.head.removeChild(script);
        } catch (e) {}
      }
    };
  }, [activeTab, symbol, formattedTVSymbol]);

  const handleOrderExecuted = (order) => {
    const isUp = order.type === "BUY";
    toast.success(
      `${order.quantity} share${order.quantity > 1 ? "s" : ""} of ${order.symbol} @ ₹${Number(order.price).toFixed(2)}`,
      order.type === "BUY" ? "Buy Order Executed" : "Sell Order Executed"
    );
  };

  // SVG Chart path calculation helper
  const renderSvgPath = () => {
    if (!chartData || chartData.length < 2) return { line: "", area: "" };

    const width = 800;
    const height = 240;
    const padding = 20;

    const minVal = Math.min(...chartData);
    const maxVal = Math.max(...chartData);
    const valRange = maxVal - minVal || 1;

    const points = chartData.map((val, idx) => {
      const x =
        padding + (idx / (chartData.length - 1)) * (width - 2 * padding);
      const y =
        height - padding - ((val - minVal) / valRange) * (height - 2 * padding);
      return { x, y };
    });

    const linePath = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return { line: linePath, area: areaPath, points };
  };

  const svgPaths = renderSvgPath();
  const mockWatchlist = [
    { symbol, name: profile?.name || symbol, price: quote?.c || 100 },
  ];

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <BackRow>
          <BackLink href="/dashboard">
            <ArrowLeft size={16} />
            Back to Terminal Dashboard
          </BackLink>
        </BackRow>

        <HeaderGroup>
          <TitleInfo>
            <StockSymbol>{symbol}</StockSymbol>
            <StockName>{profile?.name || "Premium Market Asset"}</StockName>
          </TitleInfo>

          {quote && (
            <PriceInfo>
              <StockPrice>
                {currencySymbol}
                {quote.c.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </StockPrice>
              <ChangeBadge $isUp={quote.dp >= 0}>
                {quote.dp >= 0 ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {quote.dp >= 0 ? "+" : ""}
                {quote.dp.toFixed(2)}%
              </ChangeBadge>
            </PriceInfo>
          )}
        </HeaderGroup>

        {/* Real-time V1 Backend Powered Chart & TradingView */}
        <ChartCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <CardTitle
              style={{
                marginBottom: 0,
                paddingBottom: 0,
                borderBottom: "none",
              }}
            >
              <Activity size={18} style={{ color: "#e5c158" }} />
              Asset Analytics Terminal
            </CardTitle>

            <div
              style={{
                display: "flex",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                padding: "3px",
              }}
            >
              <button
                onClick={() => setActiveTab("tv")}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "700",
                  background:
                    activeTab === "tv"
                      ? "rgba(229, 193, 88, 0.12)"
                      : "transparent",
                  color: activeTab === "tv" ? "#e5c158" : "#94a3b8",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                TradingView
              </button>
              <button
                onClick={() => setActiveTab("tick")}
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "700",
                  background:
                    activeTab === "tick"
                      ? "rgba(229, 193, 88, 0.12)"
                      : "transparent",
                  color: activeTab === "tick" ? "#e5c158" : "#94a3b8",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Tick Chart (V1 API)
              </button>
            </div>
          </div>

          {activeTab === "tv" ? (
            <div
              id="tradingview-chart-container"
              style={{
                width: "100%",
                height: "380px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "240px",
                marginTop: "12px",
              }}
            >
              {chartData && chartData.length > 0 ? (
                <svg
                  viewBox="0 0 800 240"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="rgba(229, 193, 88, 0.25)" />
                      <stop offset="100%" stopColor="rgba(229, 193, 88, 0)" />
                    </linearGradient>
                    <linearGradient
                      id="strokeGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#aa8453" />
                      <stop offset="50%" stopColor="#e5c158" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  {/* Area under line */}
                  <path d={svgPaths.area} fill="url(#chartGradient)" />
                  {/* Sparkline Stroke */}
                  <path
                    d={svgPaths.line}
                    fill="none"
                    stroke="url(#strokeGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Coordinate node points */}
                  {svgPaths.points &&
                    svgPaths.points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        fill="#07090e"
                        stroke="#e5c158"
                        strokeWidth="2"
                      />
                    ))}
                </svg>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#94a3b8",
                  }}
                >
                  Rendering chart pathway...
                </div>
              )}
            </div>
          )}
        </ChartCard>

        <DetailGrid>
          <LeftCol>
            <Card>
              <CardTitle>
                <Landmark size={18} />
                Asset Information
              </CardTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoIconWrapper>
                    <Briefcase size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>Sector / Category</InfoLabel>
                    <InfoValue>
                      {profile?.finnhubIndustry || profile?.industry || "Financial Markets Index"}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <Landmark size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>Exchange</InfoLabel>
                    <InfoValue>
                      {profile?.exchange || "National Stock Exchange"}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <Calendar size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>IPO Date</InfoLabel>
                    <InfoValue>{profile?.ipo || "N/A"}</InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <Globe size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>Website</InfoLabel>
                    <InfoValue>
                      {profile?.weburl ? (
                        <a
                          href={profile.weburl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#e5c158", textDecoration: "none" }}
                        >
                          {profile.weburl
                            .replace("https://", "")
                            .replace("www.", "")}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <TrendingUp size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>Market Capitalization</InfoLabel>
                    <InfoValue>
                      {formatMarketCap(profile?.marketCap)}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <Activity size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>P/E Ratio</InfoLabel>
                    <InfoValue>
                      {profile?.peRatio ? `${profile.peRatio.toFixed(2)}x` : "N/A"}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <Percent size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>Dividend Yield</InfoLabel>
                    <InfoValue>
                      {profile?.dividendYield ? `${profile.dividendYield.toFixed(2)}%` : "N/A"}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <Coins size={16} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>Volume</InfoLabel>
                    <InfoValue>
                      {profile?.volume ? profile.volume.toLocaleString() : "N/A"}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <ArrowUpRight size={16} style={{ color: "#10b981" }} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>52-Week High</InfoLabel>
                    <InfoValue style={{ color: "#10b981" }}>
                      {profile?.high52 ? `${currencySymbol}${profile.high52.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
                    </InfoValue>
                  </InfoText>
                </InfoItem>

                <InfoItem>
                  <InfoIconWrapper>
                    <ArrowDownRight size={16} style={{ color: "#f43f5e" }} />
                  </InfoIconWrapper>
                  <InfoText>
                    <InfoLabel>52-Week Low</InfoLabel>
                    <InfoValue style={{ color: "#f43f5e" }}>
                      {profile?.low52 ? `${currencySymbol}${profile.low52.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
                    </InfoValue>
                  </InfoText>
                </InfoItem>
              </InfoGrid>
            </Card>

            <Card>
              <CardTitle>
                <Newspaper size={18} />
                Live Developments
              </CardTitle>
              {news.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "13px" }}>
                  No recent developments found for this asset.
                </p>
              ) : (
                <NewsList>
                  {news.map((item) => (
                    <NewsItem
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <NewsSourceRow>
                        <span>{item.source}</span>
                      </NewsSourceRow>
                      <NewsHeadline>{item.headline}</NewsHeadline>
                      <NewsSummary>{item.summary}</NewsSummary>
                    </NewsItem>
                  ))}
                </NewsList>
              )}
            </Card>
          </LeftCol>

          <RightCol>
            <OrderForm
              watchlist={mockWatchlist}
              selectedStock={symbol}
              setSelectedStock={() => {}}
              onOrderExecuted={handleOrderExecuted}
            />
          </RightCol>
        </DetailGrid>
      </MainPanel>
    </DashboardWrapper>
  );
}

const DashboardWrapper = styled.section`
  min-height: 100vh;
  background-color: #07090e;
  color: #f1f5f9;
  font-family: var(--font-outfit), sans-serif;
  display: flex;
  overflow: hidden;
`;

const MainPanel = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 32px;
  background:
    radial-gradient(
      circle at 5% 5%,
      rgba(212, 175, 55, 0.04) 0%,
      transparent 35%
    ),
    radial-gradient(
      circle at 95% 85%,
      rgba(16, 185, 129, 0.03) 0%,
      transparent 45%
    );

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const BackRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #e5c158;
  }
`;

const HeaderGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const TitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StockSymbol = styled.h1`
  font-family: var(--font-syne), sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
`;

const StockName = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: #94a3b8;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const StockPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  font-family: monospace;
`;

const ChangeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $isUp }) => ($isUp ? "#10b981" : "#f43f5e")};
  background: ${({ $isUp }) =>
    $isUp ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)"};
  border: 1px solid
    ${({ $isUp }) =>
      $isUp ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)"};
  padding: 4px 10px;
  border-radius: 8px;
`;

const ChartCard = styled.div`
  background: rgba(13, 17, 28, 0.7);
  border: 1px solid rgba(212, 175, 55, 0.12);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1.2fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Card = styled.div`
  background: rgba(13, 17, 28, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
`;

const CardTitle = styled.h3`
  font-family: var(--font-syne), sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e5c158;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoIconWrapper = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(229, 193, 88, 0.05);
  border: 1px solid rgba(229, 193, 88, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5c158;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const NewsItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  text-decoration: none;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:hover {
    opacity: 0.85;
  }
`;

const NewsSourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5c158;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const NewsHeadline = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
`;
