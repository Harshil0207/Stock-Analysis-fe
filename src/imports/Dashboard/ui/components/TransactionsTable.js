"use client";

import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Card = styled.article`
  background: rgba(10, 10, 12, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    border-color: rgba(212, 175, 55, 0.15);
  }
`;

const TransactionsCard = styled(Card)`
  overflow-x: auto;
`;

const CardTitle = styled.h4`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8c8c9a;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #8c8c9a;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
`;

const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${({ $status }) => 
    $status === "Completed" ? "rgba(16, 185, 129, 0.06)" : $status === "Pending" ? "rgba(245, 158, 11, 0.06)" : "rgba(244, 63, 94, 0.06)"};
  color: ${({ $status }) => 
    $status === "Completed" ? "#10b981" : $status === "Pending" ? "#f59e0b" : "#f43f5e"};
  border: 1px solid ${({ $status }) => 
    $status === "Completed" ? "rgba(16, 185, 129, 0.15)" : $status === "Pending" ? "rgba(245, 158, 11, 0.15)" : "rgba(244, 63, 94, 0.15)"};
`;

const ClickableTr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

export default function TransactionsTable({ transactions }) {
  const router = useRouter();

  return (
    <TransactionsCard>
      <CardTitle>Recent Orders &amp; Filings</CardTitle>
      <Table>
        <thead>
          <tr>
            <Th>Order ID</Th>
            <Th>Asset</Th>
            <Th>Type</Th>
            <Th>Quantity</Th>
            <Th>Execution Price</Th>
            <Th>Timestamp</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <ClickableTr key={tx.id} onClick={() => router.push(`/dashboard/${tx.symbol}`)}>
              <Td style={{ fontFamily: "monospace", color: "#8c8c9a" }}>{tx.id}</Td>
              <Td style={{ fontWeight: 600 }}>{tx.symbol}</Td>
              <Td style={{ color: tx.type === "BUY" ? "#10b981" : "#f43f5e", fontWeight: 700 }}>{tx.type}</Td>
              <Td>{tx.quantity}</Td>
              <Td>{tx.price}</Td>
              <Td style={{ color: "#8c8c9a" }}>{tx.date}</Td>
              <Td><StatusTag $status={tx.status}>{tx.status}</StatusTag></Td>
            </ClickableTr>
          ))}
        </tbody>
      </Table>
    </TransactionsCard>
  );
}
