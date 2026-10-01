"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import styled, { keyframes, css } from "styled-components";

/* ─── Context ─── */
const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/* ─── Types: "success" | "error" | "info" | "warning" ─── */

/* ─── Animations ─── */
const slideIn = keyframes`
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(120%); opacity: 0; }
`;

/* ─── Styled ─── */
const Container = styled.div`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

const VARIANTS = {
  success: {
    bg:     "rgba(5, 46, 22, 0.92)",
    border: "rgba(16, 185, 129, 0.4)",
    accent: "#10b981",
    icon:   "✓",
  },
  error: {
    bg:     "rgba(69, 10, 10, 0.92)",
    border: "rgba(244, 63, 94, 0.4)",
    accent: "#f43f5e",
    icon:   "✕",
  },
  warning: {
    bg:     "rgba(55, 32, 0, 0.92)",
    border: "rgba(245, 158, 11, 0.4)",
    accent: "#f59e0b",
    icon:   "⚠",
  },
  info: {
    bg:     "rgba(12, 32, 60, 0.92)",
    border: "rgba(99, 179, 237, 0.4)",
    accent: "#63b3ed",
    icon:   "ℹ",
  },
};

const ToastItem = styled.div`
  pointer-events: all;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-width: 300px;
  max-width: 420px;
  padding: 16px 18px;
  border-radius: 14px;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ $type }) => VARIANTS[$type]?.border};
  background: ${({ $type }) => VARIANTS[$type]?.bg};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: ${({ $leaving }) =>
    $leaving
      ? css`${slideOut} 0.35s cubic-bezier(0.4, 0, 1, 1) forwards`
      : css`${slideIn}  0.35s cubic-bezier(0, 0, 0.2, 1)`};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.01) translateX(-2px);
  }
`;

const IconBadge = styled.div`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${({ $type }) => `${VARIANTS[$type]?.accent}20`};
  border: 1px solid ${({ $type }) => `${VARIANTS[$type]?.accent}40`};
  color: ${({ $type }) => VARIANTS[$type]?.accent};
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Title = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  font-family: var(--font-outfit), sans-serif;
`;

const Message = styled.p`
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  font-family: var(--font-outfit), sans-serif;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.15s ease;
  &:hover { color: #ffffff; }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 0 0 14px 14px;
  background: ${({ $type }) => VARIANTS[$type]?.accent};
  width: ${({ $pct }) => $pct}%;
  transition: width 0.1s linear;
  opacity: 0.5;
`;

/* ─── Single Toast with progress ─── */
function Toast({ id, type = "info", title, message, duration = 4000, onRemove }) {
  const [leaving, setLeaving] = React.useState(false);
  const [pct, setPct] = React.useState(100);
  const start = useRef(Date.now());
  const remaining = useRef(duration);
  const raf = useRef(null);
  const timeout = useRef(null);

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    cancelAnimationFrame(raf.current);
    clearTimeout(timeout.current);
    setTimeout(() => onRemove(id), 350);
  }, [id, leaving, onRemove]);

  // Progress bar animation
  React.useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - start.current;
      const left = Math.max(0, remaining.current - elapsed);
      setPct((left / duration) * 100);
      if (left > 0) {
        raf.current = requestAnimationFrame(tick);
      } else {
        dismiss();
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={{ position: "relative" }} onClick={dismiss}>
      <ToastItem $type={type} $leaving={leaving}>
        <IconBadge $type={type}>{VARIANTS[type]?.icon}</IconBadge>
        <Body>
          {title && <Title>{title}</Title>}
          {message && <Message>{message}</Message>}
        </Body>
        <CloseBtn onClick={(e) => { e.stopPropagation(); dismiss(); }}>×</CloseBtn>
        <ProgressBar $type={type} $pct={pct} />
      </ToastItem>
    </div>
  );
}

/* ─── Provider ─── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  let counter = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * toast({ type, title, message, duration })
   * Shortcuts: toast.success(), toast.error(), toast.warning(), toast.info()
   */
  const toast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  toast.success = (message, title = "Success") => toast({ type: "success", title, message });
  toast.error   = (message, title = "Error")   => toast({ type: "error",   title, message });
  toast.warning = (message, title = "Warning") => toast({ type: "warning", title, message });
  toast.info    = (message, title = "Info")    => toast({ type: "info",    title, message });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Container>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onRemove={remove} />
        ))}
      </Container>
    </ToastContext.Provider>
  );
}
