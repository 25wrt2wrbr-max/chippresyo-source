"use client";

import { useCallback, useEffect, useState } from "react";
import type { RatesPayload } from "@/lib/rates";
import { FALLBACK_PHP_PER_UNIT } from "@/lib/rates";

const REFRESH_MS = 15 * 60 * 1000;

export function useRates() {
  const [rates, setRates] = useState<RatesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rates", { cache: "no-store" });
      if (!res.ok) throw new Error(`Rates HTTP ${res.status}`);
      const data = (await res.json()) as RatesPayload;
      setRates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rates");
      setRates({
        base: "PHP",
        phpPerUnit: FALLBACK_PHP_PER_UNIT,
        fetchedAt: new Date().toISOString(),
        source: "static-fallback",
        fallback: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { rates, loading, error, refresh };
}