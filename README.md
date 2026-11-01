# ChipPresyo

Catalog of flagship **Snapdragon** Android phones (by year and chip), **Google Pixel** models, and **iPhones** — with **live PHP market prices** and **ROM type** guidance (China ROM vs Google/Global vs custom).

Built for Philippine buyers comparing gray-market China ROM imports against Global/GMS units.

**Live:** [https://chippresyo.vercel.app](https://chippresyo.vercel.app)

## Features

- Phones grouped by **release year**, then by **CPU** (Snapdragon flagship band, Tensor, or Apple silicon)
- **Market price (PHP)** column converted in realtime from USD / CNY / EUR / GBP / JPY
- **ROM badges** with advantages & disadvantages (China ROM has no Google; custom ROMs are owner-flashed)
- Search + filters for year, product line, and ROM kind

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Deploy (Vercel)

```bash
npx vercel deploy --temporary --yes
```

Anonymous deploys get a public `*.tmp.now` URL that expires in about an hour. Claim the deployment from the printed `claimUrl` (or [vercel.com/claim-deployment](https://vercel.com/claim-deployment)) to keep it on your Vercel account. For a lasting production URL after login:

```bash
npx vercel login
npx vercel --prod
```

## Notes

- Source prices are approximate launch / street MSRP for base storage configs — not live retailer scrapes.
- Exchange rates come from `GET /api/rates` (open.er-api.com, with a secondary CDN source and a static fallback).
- Always confirm ROM type with the seller (settings screenshots) before paying for gray-market Android phones.
