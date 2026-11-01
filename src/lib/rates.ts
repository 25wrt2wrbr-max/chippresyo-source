import type { CurrencyCode } from "@/data/phones";

export type RatesPayload = {
  base: "PHP";
  /** How many PHP per 1 unit of currency */
  phpPerUnit: Record<CurrencyCode, number>;
  fetchedAt: string;
  source: string;
  fallback: boolean;
};

/** Static fallback if live FX APIs are unreachable (approx mid-2025–2026 levels). */
export const FALLBACK_PHP_PER_UNIT: Record<CurrencyCode, number> = {
  PHP: 1,
  USD: 58.5,
  CNY: 8.1,
  EUR: 63.5,
  GBP: 74.0,
  JPY: 0.39,
};

export function convertToPhp(
  amount: number,
  currency: CurrencyCode,
  phpPerUnit: Record<CurrencyCode, number>,
): number {
  return amount * (phpPerUnit[currency] ?? FALLBACK_PHP_PER_UNIT[currency]);
}

export function formatPhp(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatSourcePrice(
  amount: number,
  currency: CurrencyCode,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 0,
  }).format(amount);
}