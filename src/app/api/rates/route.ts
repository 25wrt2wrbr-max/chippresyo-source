import { NextResponse } from "next/server";
import type { CurrencyCode } from "@/data/phones";
import {
  FALLBACK_PHP_PER_UNIT,
  type RatesPayload,
} from "@/lib/rates";

const CURRENCIES: CurrencyCode[] = ["USD", "CNY", "EUR", "GBP", "JPY", "PHP"];

async function fetchOpenErApi(): Promise<RatesPayload | null> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    result?: string;
    rates?: Record<string, number>;
    time_last_update_utc?: string;
  };
  if (data.result !== "success" || !data.rates?.PHP) return null;

  const usdToPhp = data.rates.PHP;
  const phpPerUnit: Record<CurrencyCode, number> = {
    PHP: 1,
    USD: usdToPhp,
    CNY: data.rates.CNY ? usdToPhp / data.rates.CNY : FALLBACK_PHP_PER_UNIT.CNY,
    EUR: data.rates.EUR ? usdToPhp / data.rates.EUR : FALLBACK_PHP_PER_UNIT.EUR,
    GBP: data.rates.GBP ? usdToPhp / data.rates.GBP : FALLBACK_PHP_PER_UNIT.GBP,
    JPY: data.rates.JPY ? usdToPhp / data.rates.JPY : FALLBACK_PHP_PER_UNIT.JPY,
  };

  return {
    base: "PHP",
    phpPerUnit,
    fetchedAt: data.time_last_update_utc ?? new Date().toISOString(),
    source: "open.er-api.com",
    fallback: false,
  };
}

async function fetchFawazApi(): Promise<RatesPayload | null> {
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/php.json",
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    date?: string;
    php?: Record<string, number>;
  };
  if (!data.php) return null;

  // php.json maps: 1 PHP = X foreign. Invert to PHP per 1 foreign.
  const phpPerUnit = {} as Record<CurrencyCode, number>;
  for (const code of CURRENCIES) {
    if (code === "PHP") {
      phpPerUnit.PHP = 1;
      continue;
    }
    const phpToForeign = data.php[code.toLowerCase()];
    phpPerUnit[code] = phpToForeign
      ? 1 / phpToForeign
      : FALLBACK_PHP_PER_UNIT[code];
  }

  return {
    base: "PHP",
    phpPerUnit,
    fetchedAt: data.date
      ? new Date(`${data.date}T00:00:00Z`).toISOString()
      : new Date().toISOString(),
    source: "fawazahmed0/currency-api",
    fallback: false,
  };
}

function fallbackPayload(): RatesPayload {
  return {
    base: "PHP",
    phpPerUnit: FALLBACK_PHP_PER_UNIT,
    fetchedAt: new Date().toISOString(),
    source: "static-fallback",
    fallback: true,
  };
}

export async function GET() {
  try {
    const live =
      (await fetchOpenErApi().catch(() => null)) ??
      (await fetchFawazApi().catch(() => null));
    const payload = live ?? fallbackPayload();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(fallbackPayload(), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}