"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Layers, Compass, PieChart, Wallet, Settings, LogOut, TrendingUp, User, BarChart2, Newspaper } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { fetchUserProfile, logoutApi } from "../../../Auth/api/auth.js";



const SidebarContainer = styled.aside`
  width: 260px;
  background: ${({ theme }) => theme.mode === "light" ? "rgba(241, 245, 249, 0.98)" : "rgba(10, 10, 12, 0.95)"};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 24px;
  z-index: 10;
  backdrop-filter: blur(15px);

  @media (max-width: 1024px) {
    display: none;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135px, #d4af37 0%, #aa8453 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: bold;
`;

const LogoText = styled.span`
  font-family: var(--font-syne), sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.heading};
  span {
    color: #d4af37;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const NavLink = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: ${({ $active }) => ($active ? "rgba(212, 175, 55, 0.08)" : "transparent")};
  border: 1px solid ${({ $active }) => ($active ? "rgba(212, 175, 55, 0.15)" : "transparent")};
  border-radius: 12px;
  color: ${({ $active }) => ($active ? "#d4af37" : "#a8a29e")};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.02);
  }
`;

const UserProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4af37;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.heading};
`;

const UserRole = styled.span`
  font-size: 11px;
  color: #8c8c9a;
  letter-spacing: 0.05em;
  text-transform: uppercase;
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


export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const u = await fetchUserProfile();
        setUser(u);
      } catch (err) {
        setUser(null);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.warn("Logout failed:", e);
    }
    setUser(null);
    router.push("/auth");
  };

  return (
    <SidebarContainer>
      <div>
        <LogoSection>
          <LogoIcon><TrendingUp size={16} /></LogoIcon>
          <LogoText>TRADE<span>SET</span></LogoText>
        </LogoSection>

        <NavList>
          <NavLink 
            $active={pathname === "/dashboard"} 
            onClick={() => router.push("/dashboard")}
          >
            <Layers size={18} /> Terminal
          </NavLink>
          
          <NavLink 
            $active={pathname === "/dashboard/explore"} 
            onClick={() => router.push("/dashboard/explore")}
          >
            <Compass size={18} /> Explore
          </NavLink>
          
          <NavLink 
            $active={pathname === "/dashboard/portfolio"} 
            onClick={() => router.push("/dashboard/portfolio")}
          >
            <PieChart size={18} /> Portfolio
          </NavLink>

          <NavLink 
            $active={pathname === "/dashboard/analysis"} 
            onClick={() => router.push("/dashboard/analysis")}
          >
            <BarChart2 size={18} /> Analysis
          </NavLink>

          <NavLink 
            $active={pathname === "/dashboard/news"} 
            onClick={() => router.push("/dashboard/news")}
          >
            <Newspaper size={18} /> News
          </NavLink>
          
          <NavLink 
            $active={pathname === "/dashboard/settings"} 
            onClick={() => router.push("/dashboard/settings")}
          >
            <Settings size={18} /> Settings
          </NavLink>

          <NavLink 
            $active={pathname === "/dashboard/account"} 
            onClick={() => router.push("/dashboard/account")}
          >
            <User size={18} /> Account
          </NavLink>

          <NavLink 
            $active={pathname === "/dashboard/transactions"} 
            onClick={() => router.push("/dashboard/transactions")}
          >
            <Wallet size={18} /> Transactions
          </NavLink>
        </NavList>
      </div>

      <UserProfileCard>
        <Avatar>{user ? `${user.firstName[0]}${user.lastName[0] || ""}`.toUpperCase() : "G"}</Avatar>
        <UserInfo>
          <Username>{user ? `${user.firstName} ${user.lastName}` : "Guest Operator"}</Username>
          <UserRole>{user ? `${user.role} TIER` : "SANDBOX MODE"}</UserRole>
        </UserInfo>
        {user && (
          <IconButton onClick={handleLogout} style={{ marginLeft: "auto", border: "none", background: "none" }} title="Logout">
            <LogOut size={16} />
          </IconButton>
        )}
      </UserProfileCard>
    </SidebarContainer>
  );
}
