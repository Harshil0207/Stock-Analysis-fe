"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Filter, Search, Calendar, ShieldAlert } from "lucide-react";
import Sidebar from "../../../Dashboard/ui/components/Sidebar.js";
import Header from "../../../Dashboard/ui/components/Header.js";
import { fetchRealTransactions, fetchDemoTransactions } from "../../api/transactions.js";

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
  margin-top: 24px;
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

const SegmentedToggle = styled.div`
  display: inline-flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
`;

const ToggleOption = styled.button`
  padding: 10px 24px;
  background: ${({ $active }) => ($active ? "rgba(229, 193, 88, 0.12)" : "transparent")};
  color: ${({ $active }) => ($active ? "#e5c158" : "#94a3b8")};
  border: 1px solid ${({ $active }) => ($active ? "rgba(229, 193, 88, 0.2)" : "transparent")};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SelectField = styled.select`
  padding: 10px 16px;
  background: ${({ theme }) => theme.mode === "light" ? "#ffffff" : "#0d111c"};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.heading};
  font-size: 13px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #e5c158;
  }
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.mode === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.02)"};
  padding: 16px 24px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.08em;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Td = styled.td`
  padding: 18px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.heading};
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.01);
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  background: ${({ $type }) => 
    $type === "ADD" || $type === "STOCK_SELL" ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)"
  };
  color: ${({ $type }) => 
    $type === "ADD" || $type === "STOCK_SELL" ? "#10b981" : "#f43f5e"
  };
  border: 1px solid ${({ $type }) => 
    $type === "ADD" || $type === "STOCK_SELL" ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)"
  };
`;

const AmountText = styled.span`
  font-family: monospace;
  font-weight: 700;
  font-size: 14px;
  color: ${({ $positive }) => ($positive ? "#10b981" : "#f43f5e")};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export default function TransactionsPage() {
  const [accountMode, setAccountMode] = useState("demo"); // "demo" or "real"
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    setAuthRequired(false);
    try {
      let data = [];
      if (accountMode === "demo") {
        data = await fetchDemoTransactions();
      } else {
        data = await fetchRealTransactions();
      }
      setTransactions(data);
    } catch (e) {
      console.warn("Failed to fetch transactions:", e.message);
      if (accountMode === "real") {
        setAuthRequired(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [accountMode]);

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === "ALL") return true;
    if (filterType === "DEPOSIT") return tx.type === "ADD";
    if (filterType === "WITHDRAWAL") return tx.type === "WITHDRAW" || tx.type === "STOCK_BUY"; // negative flows
    return tx.type === filterType;
  });

  return (
    <DashboardWrapper>
      <Sidebar />

      <MainPanel>
        <Header />

        <Card>
          <CardTitle>
            <Wallet size={18} />
            Financial Audit Settlement Ledger
          </CardTitle>

          <SegmentedToggle>
            <ToggleOption $active={accountMode === "demo"} onClick={() => setAccountMode("demo")}>
              Demo Account
            </ToggleOption>
            <ToggleOption $active={accountMode === "real"} onClick={() => setAccountMode("real")}>
              Real Account
            </ToggleOption>
          </SegmentedToggle>

          {accountMode === "real" && authRequired ? (
            <EmptyState>
              <ShieldAlert size={48} style={{ color: "#f43f5e" }} />
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#ffffff" }}>Authentication Required</div>
              <p style={{ fontSize: "13px", maxWidth: "360px", lineHeight: "1.5" }}>
                Please link your active TradeSet profile to inspect real ledger settlement audit logs.
              </p>
            </EmptyState>
          ) : (
            <>
              <ControlsRow>
                <FilterWrapper>
                  <Filter size={16} style={{ color: "#e5c158" }} />
                  <span style={{ fontSize: "13px", fontWeight: "600" }}>Filter Ledger:</span>
                  <SelectField value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="ALL">All Transactions</option>
                    <option value="DEPOSIT">Deposits Only</option>
                    <option value="WITHDRAWAL">Withdrawals & Asset Cost</option>
                  </SelectField>
                </FilterWrapper>

                <button 
                  onClick={loadTransactions} 
                  disabled={loading}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#e5c158",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  Refresh Audit Trail
                </button>
              </ControlsRow>

              {loading ? (
                <EmptyState>
                  <RefreshCw size={32} className="animate-spin" style={{ color: "#e5c158" }} />
                  <span>Decrypting ledger database...</span>
                </EmptyState>
              ) : filteredTransactions.length === 0 ? (
                <EmptyState>
                  <Calendar size={32} />
                  <span>No ledger events matching parameters found.</span>
                </EmptyState>
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Ledger Reference ID</Th>
                        <Th>Timestamp</Th>
                        <Th>Activity Type</Th>
                        <Th>Transfer Amount (INR)</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => {
                        const amount = parseFloat(tx.amount);
                        const isPositive = amount > 0 || tx.type === "ADD";
                        const displayAmount = isPositive ? `+₹${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-₹${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

                        return (
                          <Tr key={tx.id}>
                            <Td style={{ fontFamily: "monospace", fontSize: "12px", color: "#94a3b8" }}>
                              TX-REF-{tx.id.toString().padStart(6, "0")}
                            </Td>
                            <Td style={{ fontSize: "13px" }}>
                              {new Date(tx.createdAt).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                              })}
                            </Td>
                            <Td>
                              <TypeBadge $type={tx.type}>
                                {tx.type === "ADD" ? "Deposit" : tx.type === "WITHDRAW" ? "Withdraw" : tx.type}
                              </TypeBadge>
                            </Td>
                            <Td>
                              <AmountText $positive={isPositive}>{displayAmount}</AmountText>
                            </Td>
                          </Tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </TableWrapper>
              )}
            </>
          )}
        </Card>
      </MainPanel>
    </DashboardWrapper>
  );
}
