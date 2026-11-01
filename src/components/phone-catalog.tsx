"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RomBadge } from "@/components/rom-badge";
import { PHONES, type PhoneEntry } from "@/data/phones";
import { ROM_PROFILES, type RomKind } from "@/data/roms";
import { useRates } from "@/hooks/use-rates";
import {
  convertToPhp,
  formatPhp,
  formatSourcePrice,
  type RatesPayload,
} from "@/lib/rates";

type CategoryFilter = "all" | "android_flagship" | "pixel" | "iphone";
type RomFilter = "all" | RomKind;

function phonePhp(phone: PhoneEntry, rates: RatesPayload | null): number | null {
  if (!rates) return null;
  return convertToPhp(phone.priceAmount, phone.priceCurrency, rates.phpPerUnit);
}

function groupPhones(phones: PhoneEntry[]) {
  const byYear = new Map<number, Map<string, PhoneEntry[]>>();

  for (const phone of phones) {
    const cpuKey = phone.snapdragonFlagship ?? phone.cpu;
    if (!byYear.has(phone.releaseYear)) {
      byYear.set(phone.releaseYear, new Map());
    }
    const byCpu = byYear.get(phone.releaseYear)!;
    if (!byCpu.has(cpuKey)) byCpu.set(cpuKey, []);
    byCpu.get(cpuKey)!.push(phone);
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, cpuMap]) => {
      const cpuGroups = [...cpuMap.entries()].sort((a, b) => {
        const aSnap = a[1][0]?.snapdragonFlagship ? 0 : 1;
        const bSnap = b[1][0]?.snapdragonFlagship ? 0 : 1;
        if (aSnap !== bSnap) return aSnap - bSnap;
        return a[0].localeCompare(b[0]);
      });
      return { year, cpuGroups };
    });
}

export function PhoneCatalog() {
  const { rates, loading, error, refresh } = useRates();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [rom, setRom] = useState<RomFilter>("all");
  const deferredQuery = useDeferredValue(query);

  const years = useMemo(
    () =>
      [...new Set(PHONES.map((p) => p.releaseYear))].sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return PHONES.filter((p) => {
      if (year !== "all" && p.releaseYear !== Number(year)) return false;
      if (category !== "all" && p.category !== category) return false;
      if (rom !== "all" && p.rom !== rom) return false;
      if (!q) return true;
      const hay = `${p.brand} ${p.model} ${p.cpu} ${p.romDetail} ${p.snapdragonFlagship ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [deferredQuery, year, category, rom]);

  const groups = useMemo(() => groupPhones(filtered), [filtered]);

  const rateStamp = rates
    ? new Date(rates.fetchedAt).toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-teal-900/10 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-teal-900/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand, model, or CPU…"
              className="h-10 border-teal-900/15 bg-white pl-9"
              aria-label="Search phones"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect
              label="Year"
              value={year}
              onChange={setYear}
              options={[
                { value: "all", label: "All years" },
                ...years.map((y) => ({ value: String(y), label: String(y) })),
              ]}
            />
            <FilterSelect
              label="Line"
              value={category}
              onChange={(v) => setCategory(v as CategoryFilter)}
              options={[
                { value: "all", label: "All lines" },
                { value: "android_flagship", label: "Snapdragon Android" },
                { value: "pixel", label: "Google Pixel" },
                { value: "iphone", label: "iPhone" },
              ]}
            />
            <FilterSelect
              label="ROM"
              value={rom}
              onChange={(v) => setRom(v as RomFilter)}
              options={[
                { value: "all", label: "All ROMs" },
                ...Object.values(ROM_PROFILES).map((p) => ({
                  value: p.id,
                  label: p.shortLabel,
                })),
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-teal-900/10 pt-3 text-sm text-teal-950/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing <span className="font-semibold text-teal-950">{filtered.length}</span>{" "}
            phones · Market prices converted to PHP with live FX
            {rates?.fallback ? " (fallback rates)" : ""}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm">
              {loading && !rates
                ? "Fetching exchange rates…"
                : rateStamp
                  ? `Rates as of ${rateStamp} (Asia/Manila) · ${rates?.source}`
                  : "Rates unavailable"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refresh()}
              disabled={loading}
              className="border-teal-900/20"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
        {error ? (
          <p className="text-sm text-amber-800">
            Live FX hiccup ({error}). Showing fallback rates until refresh succeeds.
          </p>
        ) : null}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-teal-900/20 bg-white/50 px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl text-teal-950">
            No phones match these filters
          </p>
          <p className="mt-2 text-sm text-teal-950/60">
            Clear search or widen year / ROM / line filters.
          </p>
        </div>
      ) : (
        groups.map(({ year: y, cpuGroups }) => (
          <section key={y} className="space-y-4 scroll-mt-24" id={`year-${y}`}>
            <div className="flex items-end justify-between gap-3 border-b border-teal-900/15 pb-2">
              <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-teal-950 sm:text-4xl">
                {y}
              </h2>
              <p className="pb-1 text-xs text-teal-900/55 sm:text-sm">
                Grouped by CPU · {cpuGroups.reduce((n, [, list]) => n + list.length, 0)}{" "}
                models
              </p>
            </div>

            {cpuGroups.map(([cpu, phones]) => (
              <div
                key={`${y}-${cpu}`}
                className="overflow-hidden rounded-xl border border-teal-900/10 bg-white/80 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-900/10 bg-gradient-to-r from-teal-950 to-teal-800 px-4 py-3 text-teal-50">
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight sm:text-xl">
                    {cpu}
                  </h3>
                  <span className="text-xs text-teal-100/80">
                    {phones.some((p) => p.snapdragonFlagship)
                      ? "Snapdragon flagship band"
                      : phones[0]?.cpuFamily === "apple"
                        ? "Apple silicon"
                        : phones[0]?.cpuFamily === "tensor"
                          ? "Google Tensor"
                          : "CPU group"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="min-w-[180px]">Phone</TableHead>
                        <TableHead className="min-w-[140px]">CPU</TableHead>
                        <TableHead className="min-w-[120px]">ROM</TableHead>
                        <TableHead className="min-w-[160px]">ROM detail</TableHead>
                        <TableHead className="min-w-[120px] text-right">
                          Source price
                        </TableHead>
                        <TableHead className="min-w-[130px] text-right">
                          Market price (PHP)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {phones
                        .slice()
                        .sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model))
                        .map((phone) => {
                          const php = phonePhp(phone, rates);
                          return (
                            <TableRow key={phone.id}>
                              <TableCell>
                                <div className="font-medium text-teal-950">
                                  {phone.brand} {phone.model}
                                </div>
                                {phone.notes ? (
                                  <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                                    {phone.notes}
                                  </p>
                                ) : null}
                              </TableCell>
                              <TableCell className="text-sm">{phone.cpu}</TableCell>
                              <TableCell>
                                <RomBadge kind={phone.rom} detail={phone.romDetail} />
                              </TableCell>
                              <TableCell className="max-w-[220px] text-sm text-muted-foreground">
                                {phone.romDetail}
                              </TableCell>
                              <TableCell className="text-right text-sm tabular-nums">
                                <div>{formatSourcePrice(phone.priceAmount, phone.priceCurrency)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {phone.priceNote}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-semibold tabular-nums text-teal-950">
                                {php == null ? (
                                  <span className="font-normal text-muted-foreground">…</span>
                                ) : (
                                  formatPhp(php)
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </section>
        ))
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-teal-900/70">
      {label}
      <Select value={value} onValueChange={(v) => onChange(v ?? "all")}>
        <SelectTrigger className="h-10 min-w-[150px] border-teal-900/15 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}