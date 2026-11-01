export type RomKind =
  | "google"
  | "china"
  | "global_oem"
  | "one_ui"
  | "ios"
  | "custom";

export type RomProfile = {
  id: RomKind;
  label: string;
  shortLabel: string;
  summary: string;
  advantages: string[];
  disadvantages: string[];
};

export const ROM_PROFILES: Record<RomKind, RomProfile> = {
  google: {
    id: "google",
    label: "Google ROM (GMS / Pixel stock)",
    shortLabel: "Google ROM",
    summary:
      "Factory software with Google Mobile Services — Play Store, Play Protect, and timely security patches.",
    advantages: [
      "Full Google Play Store, Pay, Maps, and banking-app compatibility",
      "Fast security patches on Pixels; clean, bloat-light software",
      "Best app certification and Widevine L1 for streaming",
      "Easiest path to unofficial custom ROMs later (especially Pixels)",
    ],
    disadvantages: [
      "Usually the most expensive channel vs China-import twins",
      "OEM skins (when not Pixel) can still add bloat on top of GMS",
      "Some regions get slower feature drops than Pixel hardware",
    ],
  },
  china: {
    id: "china",
    label: "China ROM (no Google)",
    shortLabel: "China ROM",
    summary:
      "Domestic China firmware (HyperOS CN, ColorOS CN, OriginOS, MagicOS CN, etc.). Cheaper gray-market units — Google services are missing or sideloaded.",
    advantages: [
      "Often substantially cheaper than Global / Google ROM twins",
      "Early feature drops and China-only camera / AI toggles",
      "Deep system customization native to the OEM skin",
      "Good value if you live inside Chinese app ecosystems",
    ],
    disadvantages: [
      "No official Google Play / GMS — banking, Grab, GCash, and many PH apps may break",
      "Push notifications unreliable without workarounds (MicroG, GApps sideload)",
      "SafetyNet / Play Integrity often fails; Netflix Widevine can drop to L3",
      "OTA updates may brick dual-partition or dual-app hacks; warranty/support is gray-market only",
      "Some radios / bands / 5G SA behavior differ from global SKUs",
    ],
  },
  global_oem: {
    id: "global_oem",
    label: "Global OEM ROM (GMS)",
    shortLabel: "Global ROM",
    summary:
      "International OEM builds (HyperOS Global, ColorOS Global, OxygenOS, Xperia UI) shipping with Google Mobile Services.",
    advantages: [
      "Google apps and Play Integrity work out of the box",
      "Band support tuned for export markets including SEA",
      "Cheaper than Samsung / Pixel / Apple at the same chip tier",
      "Multi-language and multi-region OTA channels",
    ],
    disadvantages: [
      "Still carries OEM bloat / ads on some brands",
      "Update cadence slower than Pixel",
      "Gray-import Global units can still lack PH warranty",
      "Some China-first camera features never land on Global",
    ],
  },
  one_ui: {
    id: "one_ui",
    label: "Samsung One UI (GMS)",
    shortLabel: "One UI",
    summary:
      "Samsung’s Android skin with Google services, DeX, and long OS upgrade promises on flagships.",
    advantages: [
      "Industry-leading OS / security update commitments on Flagship & A-series",
      "Full GMS, Samsung Pay (where supported), Good Lock modularity",
      "Excellent accessory and repair ecosystem in the Philippines",
      "Knox security for enterprise and banking confidence",
    ],
    disadvantages: [
      "Heavier UI and preinstalled apps vs Pixel stock",
      "Flagship MSRP sits above most Snapdragon China brands",
      "Some Snapdragon vs Exynos SKU confusion by region",
    ],
  },
  ios: {
    id: "ios",
    label: "Apple iOS",
    shortLabel: "iOS",
    summary:
      "Apple’s closed OS — not Android. No China/Google ROM split in the Android sense; regional variants differ mainly by modem / dual-SIM.",
    advantages: [
      "Longest software support window in phones",
      "Strong PH banking / wallet / Face ID app compatibility",
      "Resale value holds better than most Android flagships",
      "Tight hardware–software camera and performance tuning",
    ],
    disadvantages: [
      "No sideloading freedom comparable to Android (outside EU rules)",
      "Repair / battery cost and parts pairing friction",
      "Storage upgrades are expensive; no microSD",
      "Not a Snapdragon device — different chip roadmap entirely",
    ],
  },
  custom: {
    id: "custom",
    label: "Custom ROM (community)",
    shortLabel: "Custom ROM",
    summary:
      "Aftermarket builds such as GrapheneOS, CalyxOS, LineageOS, or /e/OS — flashed by the owner, not sold that way in retail.",
    advantages: [
      "Privacy hardened builds (GrapheneOS) or de-Googled daily drivers",
      "Can revive phones OEM abandoned for updates",
      "Debloat, custom kernels, and feature control",
      "Often faster security patches than stalled OEM skins",
    ],
    disadvantages: [
      "Voids warranty; unlock/bootloader wipes Knox on Samsung permanently",
      "Banking apps, GCash, and Play Integrity frequently fail",
      "Camera quality can regress without OEM HALs",
      "Brick risk, dual-SIM / 5G quirks, and you own every bug",
      "Not a factory configuration — treat as a project phone",
    ],
  },
};