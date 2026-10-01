"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { executeBuy, executeSell } from "../../../Account/api/portfolio.js";
import { useToast } from "../../../../lib/toast.js";

/* ─── Animations ─── */
const fadeIn = keyframes`from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

/* ─── Styled ─── */
const Card = styled.article`
  background: rgba(10, 10, 12, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(16px);
  margin-bottom: 32px;
  transition: border-color 0.3s ease;
  &:hover { border-color: rgba(212, 175, 55, 0.15); }
`;

const TabRow = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const Tab = styled.button`
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, $type }) =>
    $active ? ($type === "buy" ? "#10b981" : "#f43f5e") : "transparent"};
  color: ${({ $active, $type }) =>
    $active ? ($type === "buy" ? "#10b981" : "#f43f5e") : "#64748b"};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 12px 0;
  margin-bottom: -1px;
  transition: all 0.25s ease;
  &:hover { color: #ffffff; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 20px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #d4af37;
`;

const Input = styled.input`
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.2s ease;
  outline: none;
  &:focus { border-color: #d4af37; }
  &:disabled { opacity: 0.5; }
`;

const Select = styled.select`
  padding: 12px 14px;
  background: rgba(10, 10, 12, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  outline: none;
  &:focus { border-color: #d4af37; }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const TotalValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  font-family: monospace;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: ${({ $type }) =>
    $type === "buy"
      ? "linear-gradient(135deg, #059669, #10b981)"
      : "linear-gradient(135deg, #dc2626, #f43f5e)"};
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: ${({ $type }) =>
    $type === "buy"
      ? "0 4px 20px rgba(16, 185, 129, 0.2)"
      : "0 4px 20px rgba(244, 63, 94, 0.2)"};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ $type }) =>
      $type === "buy"
        ? "0 8px 30px rgba(16, 185, 129, 0.35)"
        : "0 8px 30px rgba(244, 63, 94, 0.35)"};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  display: inline-block;
`;

/* ─── Component ─── */
export default function OrderForm({ watchlist = [], selectedStock, setSelectedStock, onOrderExecuted }) {
  const toast = useToast();
  const [orderType, setOrderType] = useState("buy");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Auto-fill price from watchlist
  useEffect(() => {
    const found = watchlist.find((s) => s.symbol === selectedStock);
    if (found && found.price) setLimitPrice(Number(found.price.toFixed(2)));
  }, [selectedStock, watchlist]);

  const isIndian = selectedStock?.endsWith(".NS") ||
    selectedStock === "NIFTY50" || selectedStock === "BANKNIFTY";
  const currency = isIndian ? "₹" : "$";
  const estimated = (quantity * limitPrice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock || quantity <= 0 || limitPrice <= 0) return;
    setLoading(true);

    try {
      const payload = { symbol: selectedStock, quantity: Number(quantity), price: Number(limitPrice) };
      const result = orderType === "buy"
        ? await executeBuy(payload)
        : await executeSell(payload);

      toast.success(
        `${quantity} share${quantity > 1 ? "s" : ""} of ${selectedStock} @ ${currency}${Number(limitPrice).toFixed(2)}`,
        orderType === "buy" ? "Buy Order Executed" : "Sell Order Executed"
      );

      // Dispatch global event so AccountPage refreshes balance + holdings instantly
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tradeset:order-executed", {
          detail: { symbol: selectedStock, type: orderType, quantity, price: limitPrice }
        }));
      }

      // Notify parent to update transactions list
      if (onOrderExecuted) {
        onOrderExecuted({
          symbol: selectedStock,
          type: orderType.toUpperCase(),
          quantity,
          price: limitPrice,
          orderId: result?.orderId,
          remainingBalance: result?.remainingBalance,
        });
      }
    } catch (err) {
      toast.error(err.message || "Order failed. Please try again.", "Order Rejected");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <TabRow>
        <Tab $active={orderType === "buy"} $type="buy" onClick={() => setOrderType("buy")}>
          BUY SHARES
        </Tab>
        <Tab $active={orderType === "sell"} $type="sell" onClick={() => setOrderType("sell")}>
          SELL SHARES
        </Tab>
      </TabRow>

      <form onSubmit={handleSubmit}>
        <Grid>
          <Group>
            <Label>Asset Symbol</Label>
            <Select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              disabled={loading}
            >
              {watchlist.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} — {s.name}
                </option>
              ))}
            </Select>
          </Group>

          <Group>
            <Label>Quantity (shares)</Label>
            <Input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              disabled={loading}
            />
          </Group>

          <Group>
            <Label>Limit Price ({currency})</Label>
            <Input
              type="number"
              step="0.01"
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              required
              disabled={loading}
            />
          </Group>
        </Grid>

        <TotalRow>
          <TotalLabel>Estimated Total</TotalLabel>
          <TotalValue>
            {currency}{estimated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </TotalValue>
        </TotalRow>

        <SubmitBtn type="submit" $type={orderType} disabled={loading}>
          {loading ? (
          <><Spinner /> Processing...</>
        ) : (
          `${orderType === "buy" ? "BUY" : "SELL"} — ${currency}${estimated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )}
        </SubmitBtn>
      </form>
    </Card>
  );
}
