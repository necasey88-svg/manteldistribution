"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/cart-context";

interface DealerCartContextValue {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "qty">, qty?: number) => void;
  updateQty: (lineKey: string, qty: number) => void;
  removeLine: (lineKey: string) => void;
  clear: () => void;
  subtotalCents: number;
  itemCount: number;
}

const DealerCartContext = createContext<DealerCartContextValue | null>(null);
const STORAGE_KEY = "hearthline.dealer-po-cart.v1";

export function DealerCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount, intentionally deferred to avoid SSR/client mismatch
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addLine = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => (l.lineKey ?? l.slug) === line.lineKey);
      if (existing) {
        return prev.map((l) =>
          (l.lineKey ?? l.slug) === line.lineKey ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { ...line, qty }];
    });
  }, []);

  const updateQty = useCallback((lineKey: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => (l.lineKey ?? l.slug) !== lineKey)
        : prev.map((l) => ((l.lineKey ?? l.slug) === lineKey ? { ...l, qty } : l))
    );
  }, []);

  const removeLine = useCallback((lineKey: string) => {
    setLines((prev) => prev.filter((l) => (l.lineKey ?? l.slug) !== lineKey));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const subtotalCents = useMemo(
    () => lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0),
    [lines]
  );
  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines]
  );

  const value: DealerCartContextValue = {
    lines,
    addLine,
    updateQty,
    removeLine,
    clear,
    subtotalCents,
    itemCount,
  };

  return (
    <DealerCartContext.Provider value={value}>
      {children}
    </DealerCartContext.Provider>
  );
}

export function useDealerCart() {
  const ctx = useContext(DealerCartContext);
  if (!ctx) throw new Error("useDealerCart must be used within a DealerCartProvider");
  return ctx;
}
