"use client";

import React from "react";
import styled from "styled-components";
import { TrendingUp } from "lucide-react";

export default function Logo() {
  return (
    <BrandLogoWrapper>
      <LogoGlyph>
        <TrendingUp size={18} />
      </LogoGlyph>
      <LogoText>TRADE<span>SET</span></LogoText>
    </BrandLogoWrapper>
  );
}

const BrandLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const LogoGlyph = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135px, #d4af37 0%, #aa8453 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 800;
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.25);
`;

const LogoText = styled.span`
  font-family: var(--font-syne), sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #ffffff;
  span {
    background: linear-gradient(90deg, #d4af37 0%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
