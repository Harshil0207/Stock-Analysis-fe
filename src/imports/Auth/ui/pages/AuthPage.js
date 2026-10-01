"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { Sparkles } from "lucide-react";
import StockTicker from "../components/StockTicker.js";
import CandlestickChart from "../components/CandlestickChart.js";
import Logo from "../components/Logo.js";
import AuthForm from "../components/AuthForm.js";

export default function AuthPage({ initialMode = "login" }) {
  return (
    <PageContainer>
      <AuroraBgOne />
      <AuroraBgTwo />
      <StockTicker />
      <NavigationBar>
        <Logo />
        <Badge>Institutional Vault</Badge>
      </NavigationBar>

      <MainLayoutGrid>
        <PitchSection>
          <PremiumIndicator>
            <Sparkles size={14} /> Execution Suite
          </PremiumIndicator>
          <PitchTitle>
            The premium gateway to <span>global</span> markets.
          </PitchTitle>
          <PitchDesc>
            Experience algorithmic order speeds, secure digital vaults, and
            precision equity matching systems engineered for sovereign capital.
          </PitchDesc>
          <CandlestickChart />
        </PitchSection>
        <FormPane>
          <AuthForm initialMode={initialMode} />
        </FormPane>
      </MainLayoutGrid>
    </PageContainer>
  );
}
const auroraGlow = keyframes`
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.15); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
`;

const auroraGlowTwo = keyframes`
  0% { transform: translate(0px, 0px) scale(1.1); }
  50% { transform: translate(-40px, 40px) scale(0.95); }
  100% { transform: translate(0px, 0px) scale(1.1); }
`;

const PageContainer = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #030304;
  font-family: var(--font-outfit), sans-serif;
  color: #a8a29e;
  overflow: hidden;
  position: relative;
`;

const AuroraBgOne = styled.div`
  position: absolute;
  top: -10%;
  left: 10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(
    circle,
    rgba(170, 132, 83, 0.08) 0%,
    transparent 65%
  );
  filter: blur(80px);
  animation: ${auroraGlow} 25s infinite alternate ease-in-out;
  pointer-events: none;
`;

const AuroraBgTwo = styled.div`
  position: absolute;
  bottom: -15%;
  right: 5%;
  width: 45vw;
  height: 45vw;
  background: radial-gradient(
    circle,
    rgba(16, 185, 129, 0.04) 0%,
    transparent 70%
  );
  filter: blur(100px);
  animation: ${auroraGlowTwo} 20s infinite alternate ease-in-out;
  pointer-events: none;
`;

const NavigationBar = styled.nav`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 4px 10px;
  border-radius: 20px;
`;

const MainLayoutGrid = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  padding: 0 40px 60px 40px;
  align-items: center;
  position: relative;
  z-index: 5;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 0 24px 40px 24px;
  }
`;

const PitchSection = styled.article`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 1024px) {
    text-align: center;
    align-items: center;
    margin-bottom: 20px;
  }
`;

const PremiumIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.05);
  padding: 6px 16px;
  border-radius: 30px;
  width: fit-content;
`;

const PitchTitle = styled.h2`
  font-family: var(--font-syne), sans-serif;
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  color: #fff;
  letter-spacing: -0.02em;

  span {
    background: linear-gradient(90deg, #d4af37 0%, #aa8453 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 1200px) {
    font-size: 52px;
  }
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const PitchDesc = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #8c8c9a;
  max-width: 580px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FormPane = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
