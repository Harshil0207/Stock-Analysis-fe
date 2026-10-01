"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Search, Bell, RefreshCw, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchUserProfile, logoutApi } from "../../../Auth/api/auth.js";

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchIconBox = styled.div`
  position: absolute;
  left: 16px;
  color: #7c7c8a;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.01);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #a8a29e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }
`;

const SignInButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(90deg, #d4af37 0%, #aa8453 100%);
  border: none;
  border-radius: 10px;
  color: #000000;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.25);
  }
  &:active {
    transform: translateY(0);
  }
`;

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await fetchUserProfile();
        setUser(u);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
    setUser(null);
    router.push("/auth");
  };

  return (
    <HeaderRow>
      <SearchContainer>
        <SearchIconBox><Search size={18} /></SearchIconBox>
        <SearchInput type="text" placeholder="Search terminal instruments (e.g. NIFTY50, RELIANCE.NS)" />
      </SearchContainer>

      <ActionsContainer>
        <IconButton><Bell size={18} /></IconButton>
        <IconButton onClick={() => window.location.reload()}><RefreshCw size={18} /></IconButton>
        
        {!loading && (
          user ? (
            <IconButton onClick={handleLogout} title="Logout of Vault">
              <LogOut size={18} />
            </IconButton>
          ) : (
            <SignInButton onClick={() => router.push("/auth")}>
              <ShieldCheck size={16} />
              Sign In
            </SignInButton>
          )
        )}
      </ActionsContainer>
    </HeaderRow>
  );
}
