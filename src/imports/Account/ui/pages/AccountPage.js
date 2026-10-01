"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { User, Shield, CreditCard, Award, Activity, CheckCircle, ExternalLink, Wallet, ArrowUpCircle, ArrowDownCircle, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";
import Sidebar from "../../../Dashboard/ui/components/Sidebar.js";
import Header from "../../../Dashboard/ui/components/Header.js";
import { fetchWalletBalance, depositMoney, withdrawMoney, fetchDemoBalance, depositDemoMoney, withdrawDemoMoney } from "../../api/wallet.js";
import { fetchPortfolioSummary, fetchPortfolioHoldings } from "../../api/portfolio.js";

const DashboardWrapper = styled.section`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: var(--font-outfit), sans-serif;
  display: flex;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainPanel = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 32px;
  background: ${({ theme }) => theme.mode === "light" 
    ? "radial-gradient(circle at 5% 5%, rgba(229, 193, 88, 0.02) 0%, transparent 35%)"
    : "radial-gradient(circle at 5% 5%, rgba(229, 193, 88, 0.04) 0%, transparent 35%), radial-gradient(circle at 95% 85%, rgba(16, 185, 129, 0.03) 0%, transparent 45%)"
  };
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 24px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(16px);
  box-shadow: ${({ theme }) => theme.mode === "light" 
    ? "0 8px 30px rgba(0, 0, 0, 0.04)"
    : "0 12px 40px rgba(0, 0, 0, 0.5)"
  };
  transition: all 0.3s ease;
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
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.heading};
  font-family: monospace;
`;

const Badge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ $variant }) => $variant === "real" ? "#10b981" : "#e5c158"};
  background: ${({ $variant }) => $variant === "real" ? "rgba(16, 185, 129, 0.08)" : "rgba(229, 193, 88, 0.08)"};
  border: 1px solid ${({ $variant }) => $variant === "real" ? "rgba(16, 185, 129, 0.2)" : "rgba(229, 193, 88, 0.2)"};
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const AccountOverviewCard = styled(Card)`
  grid-column: span 2;
  @media (max-width: 1024px) {
    grid-column: span 1;
  }
`;

const OverviewTitle = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text};
  letter-spacing: 0.08em;
  margin-bottom: 8px;
`;

const OverviewAmount = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: ${({ theme }) => theme.heading};
  font-family: monospace;
  margin-bottom: 24px;
`;

const SegmentedToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
`;

const ToggleOption = styled.button`
  flex: 1;
  background: ${({ $active }) => ($active ? "rgba(229, 193, 88, 0.12)" : "transparent")};
  color: ${({ $active }) => ($active ? "#e5c158" : "#94a3b8")};
  border: 1px solid ${({ $active }) => ($active ? "rgba(229, 193, 88, 0.2)" : "transparent")};
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $variant }) => $variant === "deposit" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"};
  color: ${({ $variant }) => $variant === "deposit" ? "#10b981" : "#f43f5e"};
  border: 1px solid ${({ $variant }) => $variant === "deposit" ? "rgba(16, 185, 129, 0.25)" : "rgba(244, 63, 94, 0.25)"};

  &:hover:not(:disabled) {
    background: ${({ $variant }) => $variant === "deposit" ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: #ffffff;
  font-family: monospace;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: rgba(229, 193, 88, 0.5);
  }
`;

const SelectorField = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(13, 17, 28, 0.95);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: rgba(229, 193, 88, 0.5);
  }
`;

const StatusMessage = styled.div`
  margin-top: 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $isError }) => ($isError ? "#f43f5e" : "#10b981")};
`;

export default function AccountPage() {
  const [accountMode, setAccountMode] = useState("demo"); // "demo" or "real"
  const [demoBalance, setDemoBalance] = useState(0.00);
  const [realSummary, setRealSummary] = useState({
    cashBalance: 0.00,
    equityValue: 0.00,
    netWorth: 0.00
  });
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState(""); // empty by default
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [holdings, setHoldings] = useState([]);
  const [holdingsLoading, setHoldingsLoading] = useState(false);

  const loadHoldings = async () => {
    setHoldingsLoading(true);
    try {
      const data = await fetchPortfolioHoldings();
      setHoldings(data || []);
    } catch (e) {
      // silently ignore if not authenticated
    } finally {
      setHoldingsLoading(false);
    }
  };

  const loadBalances = async () => {
    setAuthRequired(false);
    try {
      // Sync real portfolio summary
      const summary = await fetchPortfolioSummary();
      setRealSummary(summary);
      
      // Sync demo account balance from the database
      const dbDemoBalance = await fetchDemoBalance();
      setDemoBalance(dbDemoBalance);
    } catch (e) {
      console.warn("Failed to load balances from backend:", e.message);
      setAuthRequired(true);
    }
  };

  useEffect(() => {
    loadBalances();
    loadHoldings();
    const id = setInterval(loadHoldings, 15000);

    // Instantly refresh when any order is executed (from OrderForm on any page)
    const handleOrderEvent = () => {
      loadBalances();
      loadHoldings();
    };
    window.addEventListener("tradeset:order-executed", handleOrderEvent);

    return () => {
      clearInterval(id);
      window.removeEventListener("tradeset:order-executed", handleOrderEvent);
    };
  }, [accountMode]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setStatus({ message: "Please enter a valid deposit amount.", isError: true });
      return;
    }

    if (accountMode === "real" && !selectedBank) {
      setStatus({ message: "Bank Account validation required for Real Account transactions!", isError: true });
      return;
    }

    setLoading(true);
    setStatus(null);

    if (accountMode === "demo") {
      try {
        const nextBal = await depositDemoMoney(amount);
        setDemoBalance(nextBal);
        setAmount("");
        setStatus({ message: `Successfully deposited ₹${parseFloat(amount).toLocaleString()} to your Demo Account!`, isError: false });
      } catch (err) {
        setStatus({ message: err.message || "Demo deposit failed.", isError: true });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const nextBal = await depositMoney(amount);
        setRealSummary((prev) => ({
          ...prev,
          cashBalance: nextBal,
          netWorth: prev.equityValue + nextBal
        }));
        setAmount("");
        setStatus({ message: `Successfully deposited ₹${parseFloat(amount).toLocaleString()} from your linked bank account!`, isError: false });
      } catch (err) {
        setStatus({ message: err.message || "Deposit transaction rejected.", isError: true });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setStatus({ message: "Please enter a valid withdrawal amount.", isError: true });
      return;
    }

    const currentBalance = accountMode === "demo" ? demoBalance : realSummary.cashBalance;
    if (parseFloat(amount) > currentBalance) {
      setStatus({ message: "Insufficient ledger balance for this withdrawal.", isError: true });
      return;
    }

    if (accountMode === "real" && !selectedBank) {
      setStatus({ message: "Bank Account validation required for Real Account transactions!", isError: true });
      return;
    }

    setLoading(true);
    setStatus(null);

    if (accountMode === "demo") {
      try {
        const nextBal = await withdrawDemoMoney(amount);
        setDemoBalance(nextBal);
        setAmount("");
        setStatus({ message: `Successfully withdrew ₹${parseFloat(amount).toLocaleString()} from your Demo Account!`, isError: false });
      } catch (err) {
        setStatus({ message: err.message || "Demo withdrawal failed.", isError: true });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const nextBal = await withdrawMoney(amount);
        setRealSummary((prev) => ({
          ...prev,
          cashBalance: nextBal,
          netWorth: prev.equityValue + nextBal
        }));
        setAmount("");
        setStatus({ message: `Successfully withdrew ₹${parseFloat(amount).toLocaleString()} to your linked bank account!`, isError: false });
      } catch (err) {
        setStatus({ message: err.message || "Withdrawal transaction rejected.", isError: true });
      } finally {
        setLoading(false);
      }
    }
  };

  const activeBalance = accountMode === "demo" ? demoBalance : realSummary.cashBalance;
  const activeEquity = accountMode === "demo" ? 0.00 : realSummary.equityValue;
  const activeGain = accountMode === "demo" ? 0.00 : (realSummary.totalGain || 0.00);
  const portfolioValue = accountMode === "demo" ? demoBalance : realSummary.netWorth;

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <Grid>
          <AccountOverviewCard>
            <CardTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Award size={18} />
                Vault Asset Portfolio Overview ({accountMode === "demo" ? "Sandbox" : "Live Real Account"})
              </span>
              <button
                onClick={() => { loadBalances(); loadHoldings(); }}
                style={{ background: "none", border: "1px solid rgba(229,193,88,0.2)", borderRadius: "8px", padding: "5px 12px", color: "#e5c158", cursor: "pointer", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", textTransform: "none", letterSpacing: 0 }}
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </CardTitle>
            <OverviewTitle>Total Portfolio Net Worth</OverviewTitle>
            <OverviewAmount>₹{portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</OverviewAmount>

            <DetailItem>
              <DetailLabel>Indian Equity Value</DetailLabel>
              <DetailValue>₹{activeEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Liquid Cash Balance</DetailLabel>
              <DetailValue>₹{activeBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Total Unrealized Gain</DetailLabel>
              <DetailValue style={{ color: activeGain >= 0 ? "#10b981" : "#f43f5e", fontFamily: "monospace" }}>
                ₹{activeGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </DetailValue>
            </DetailItem>
          </AccountOverviewCard>

          {/* Interactive Settlement Ledger Portal with Toggle */}
          <Card>
            <CardTitle>
              <Wallet size={18} />
              Settlement Ledger Portal
            </CardTitle>

            <SegmentedToggle>
              <ToggleOption $active={accountMode === "demo"} onClick={() => { setAccountMode("demo"); setStatus(null); }}>
                Demo Account
              </ToggleOption>
              <ToggleOption $active={accountMode === "real"} onClick={() => { setAccountMode("real"); setStatus(null); }}>
                Real Account
              </ToggleOption>
            </SegmentedToggle>

            {accountMode === "real" && authRequired ? (
              <div style={{ textAlign: "center", padding: "20px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "13px", color: "#f43f5e", fontWeight: "600" }}>
                  Authentication Required
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Please sign in to your TradeSet profile to connect real bank settlements.
                </p>
                <Link href="/" style={{
                  background: "rgba(229, 193, 88, 0.1)",
                  color: "#e5c158",
                  border: "1px solid rgba(229, 193, 88, 0.25)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  textDecoration: "none",
                  fontWeight: "700"
                }}>
                  Go to Login
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {accountMode === "demo" 
                    ? "Sandbox simulator: Deposit or withdraw demo funds. No real bank verification required."
                    : "Live Settlement: Deposit or withdraw capital. Verification with linked bank account is required."
                  }
                </p>

                {accountMode === "real" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "11px", textTransform: "uppercase", color: "#e5c158", fontWeight: "700" }}>
                      Select Bank Account *
                    </label>
                    <SelectorField value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                      <option value="">-- Choose Linked Bank Account --</option>
                      <option value="hdfc">HDFC Bank Savings (*******1298)</option>
                    </SelectorField>
                  </div>
                )}

                <InputField 
                  type="number" 
                  placeholder="Enter transaction amount (INR)" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                />

                <ActionRow>
                  <ActionButton $variant="deposit" onClick={handleDeposit} disabled={loading}>
                    <ArrowUpCircle size={16} />
                    Deposit
                  </ActionButton>
                  <ActionButton $variant="withdraw" onClick={handleWithdraw} disabled={loading}>
                    <ArrowDownCircle size={16} />
                    Withdraw
                  </ActionButton>
                </ActionRow>

                {status && (
                  <StatusMessage $isError={status.isError}>
                    {status.message}
                  </StatusMessage>
                )}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle>
              <Award size={18} />
              Authority tier
            </CardTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#e5c158" }}>Platinum VIP Tier</div>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
                As an elite Platinum operator, your account qualifies for priority Finnhub API routes, 0.00% execution commission fees, and 24/7 dedicated support.
              </p>
              <Badge $variant={accountMode === "real" ? "real" : "demo"}>
                {accountMode === "real" ? "Live Account" : "Sandbox Account"}
              </Badge>
            </div>
          </Card>

          <Card>
            <CardTitle>
              <CreditCard size={18} />
              Settlement Bank Account
            </CardTitle>
            <DetailItem>
              <DetailLabel>Bank Name</DetailLabel>
              <DetailValue style={{ fontFamily: "inherit" }}>HDFC Bank Ltd</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Account Number</DetailLabel>
              <DetailValue>*******1298</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Account Type</DetailLabel>
              <DetailValue style={{ fontFamily: "inherit" }}>Savings Account</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>IFSC Code</DetailLabel>
              <DetailValue>HDFC0000240</DetailValue>
            </DetailItem>
          </Card>

          <Card>
            <CardTitle>
              <Activity size={18} />
              Operator Audit Trail
            </CardTitle>
            <DetailItem>
              <DetailLabel>Session Origin</DetailLabel>
              <DetailValue>::1 (localhost)</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Estimated Location</DetailLabel>
              <DetailValue style={{ fontFamily: "inherit" }}>Mumbai, India</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Last Login Time</DetailLabel>
              <DetailValue>Today, 15:44 IST</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Device Browser</DetailLabel>
              <DetailValue style={{ fontFamily: "inherit" }}>Chrome (Linux)</DetailValue>
            </DetailItem>
          </Card>
        </Grid>

        {/* ─── Live Holdings Table ─── */}
        <div style={{ marginTop: "8px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <h3 style={{ fontFamily: "var(--font-syne), sans-serif", fontSize: "15px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e5c158", display: "flex", alignItems: "center", gap: "10px" }}>
              <Layers size={17} /> Live Holdings (Real Account)
            </h3>
            <button onClick={loadHoldings} disabled={holdingsLoading} style={{ background: "none", border: "1px solid rgba(229,193,88,0.2)", borderRadius: "8px", padding: "6px 12px", color: "#e5c158", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <RefreshCw size={12} style={{ animation: holdingsLoading ? "spin 1s linear infinite" : "none" }} /> Refresh
            </button>
          </div>

          <div style={{ background: "rgba(13,17,28,0.7)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}>
            {holdings.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
                {holdingsLoading ? "Loading holdings..." : "No open positions. Buy shares from the dashboard to see them here."}
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Symbol", "Qty", "Avg Buy Price", "Current Price", "Total Cost", "Current Value", "Unrealized P&L", "Return %"].map(h => (
                      <th key={h} style={{ padding: "14px 18px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: "#64748b" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => {
                    const gain = h.totalGain || 0;
                    const pct = h.gainPercent || 0;
                    const isUp = gain >= 0;
                    return (
                      <tr key={h.id || i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "16px 18px", fontWeight: "700", color: "#e5c158", fontFamily: "monospace", fontSize: "13px" }}>{h.symbol}</td>
                        <td style={{ padding: "16px 18px", color: "#cbd5e1", fontFamily: "monospace" }}>{h.quantity}</td>
                        <td style={{ padding: "16px 18px", fontFamily: "monospace", color: "#94a3b8" }}>₹{parseFloat(h.avgPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style={{ padding: "16px 18px", fontFamily: "monospace", color: "#ffffff" }}>₹{parseFloat(h.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style={{ padding: "16px 18px", fontFamily: "monospace", color: "#94a3b8" }}>₹{parseFloat(h.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style={{ padding: "16px 18px", fontFamily: "monospace", color: "#ffffff", fontWeight: "600" }}>₹{parseFloat(h.currentValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style={{ padding: "16px 18px", fontFamily: "monospace", fontWeight: "700", color: isUp ? "#10b981" : "#f43f5e" }}>
                          {isUp ? "+" : "-"}₹{Math.abs(gain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: "16px 18px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", padding: "3px 9px", borderRadius: "6px", background: isUp ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)", color: isUp ? "#10b981" : "#f43f5e", border: `1px solid ${isUp ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}` }}>
                            {isUp ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </MainPanel>
    </DashboardWrapper>
  );
}
