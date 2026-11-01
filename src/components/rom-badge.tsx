"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ROM_PROFILES, type RomKind } from "@/data/roms";
import { cn } from "@/lib/utils";

const TONE: Record<RomKind, string> = {
  google:
    "border-emerald-600/30 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
  china: "border-amber-600/30 bg-amber-50 text-amber-950 hover:bg-amber-100",
  global_oem: "border-sky-600/30 bg-sky-50 text-sky-950 hover:bg-sky-100",
  one_ui: "border-blue-700/30 bg-blue-50 text-blue-950 hover:bg-blue-100",
  ios: "border-zinc-500/30 bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  custom: "border-rose-600/30 bg-rose-50 text-rose-950 hover:bg-rose-100",
};

export function RomBadge({
  kind,
  detail,
}: {
  kind: RomKind;
  detail: string;
}) {
  const profile = ROM_PROFILES[kind];

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "inline-flex h-6 max-w-full cursor-pointer items-center rounded-md border px-2 text-xs font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40",
          TONE[kind],
        )}
      >
        {profile.shortLabel}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{profile.label}</DialogTitle>
          <DialogDescription>{profile.summary}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">This unit: </span>
          {detail}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-emerald-800">
              Advantages
            </h4>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              {profile.advantages.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-rose-800">
              Disadvantages
            </h4>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              {profile.disadvantages.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-rose-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}