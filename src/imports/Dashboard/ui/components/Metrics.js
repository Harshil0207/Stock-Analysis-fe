"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { Wallet, Activity, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(229, 193, 88, 0.1); }
  50% { box-shadow: 0 0 25px rgba(229, 193, 88, 0.25); }
  100% { box-shadow: 0 0 10px rgba(229, 193, 88, 0.1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  animation: ${slideUp} 0.5s ease-out forwards;
`;

const Card = styled.article`
  background: rgba(13, 17, 28, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(229, 193, 88, 0.25);
  }
`;

const PortfolioCard = styled(Card)`
  background: radial-gradient(circle at top right, rgba(229, 193, 88, 0.08) 0%, rgba(13, 17, 28, 0.9) 70%);
  animation: ${pulseGlow} 6s infinite alternate ease-in-out;
  border-color: rgba(229, 193, 88, 0.15);
`;

const CardTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BalanceAmount = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  font-family: monospace;
`;

const GainsBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $isUp }) => ($isUp ? "#10b981" : "#f43f5e")};
  background: ${({ $isUp }) => ($isUp ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)")};
  border: 1px solid ${({ $isUp }) => ($isUp ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)")};
  padding: 4px 10px;
  border-radius: 8px;
`;

export default function Metrics() {
  return (
    <MetricsGrid>
      <PortfolioCard>
        <CardTitle><Wallet size={16} /> Total Portfolio Value</CardTitle>
        <BalanceAmount>₹1,24,86,500.00</BalanceAmount>
        <GainsBadge $isUp={true}><ArrowUpRight size={14} /> +12.4% today</GainsBadge>
      </PortfolioCard>

      <Card>
        <CardTitle><Activity size={16} /> Available Buying Power</CardTitle>
        <BalanceAmount>₹35,24,000.00</BalanceAmount>
        <GainsBadge $isUp={true}><CheckCircle2 size={14} /> Account Fully Liquid</GainsBadge>
      </Card>

      <Card>
        <CardTitle><Sparkles size={16} /> Signature Yield (APY)</CardTitle>
        <BalanceAmount>8.45%</BalanceAmount>
        <GainsBadge $isUp={true}><ArrowUpRight size={14} /> Platinum Tier Elite</GainsBadge>
      </Card>
    </MetricsGrid>
  );
}
