import { PhoneCatalog } from "@/components/phone-catalog";
import { ROM_PROFILES } from "@/data/roms";
import { SNAPDRAGON_FLAGSHIP_BY_YEAR } from "@/data/phones";

const FLAGSHIP_YEARS = Object.entries(SNAPDRAGON_FLAGSHIP_BY_YEAR)
  .map(([year, chips]) => ({ year: Number(year), chips }))
  .sort((a, b) => b.year - a.year)
  .slice(0, 6);

export default function Home() {
  return (
    <div className="chip-grid min-h-full flex-1">
      <header className="relative overflow-hidden">
        <div className="hero-sheen absolute inset-0" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, oklch(0.75 0.12 185 / 0.35), transparent 40%), radial-gradient(circle at 80% 60%, oklch(0.7 0.1 230 / 0.25), transparent 35%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8">
          <p className="animate-fade-soft mb-4 text-sm font-medium tracking-[0.2em] text-teal-100/80 uppercase">
            Philippine gray-market &amp; open-line buyer guide
          </p>
          <h1 className="animate-rise font-[family-name:var(--font-display)] text-5xl leading-[0.95] font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            ChipPresyo
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-base text-teal-50/85 sm:text-lg [animation-delay:120ms]">
            Flagship Snapdragon phones by year and chip, plus every Pixel and
            iPhone — with live PHP market prices and the ROM story that decides
            whether GCash and Google actually work.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:220ms]">
            <a
              href="#catalog"
              className="inline-flex h-11 items-center rounded-lg bg-teal-100 px-5 text-sm font-semibold text-teal-950 transition hover:bg-white"
            >
              Browse catalog
            </a>
            <a
              href="#rom-guide"
              className="inline-flex h-11 items-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ROM guide
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-14" aria-labelledby="chip-map-heading">
          <h2
            id="chip-map-heading"
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-950 sm:text-3xl"
          >
            Flagship Snapdragon map
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-teal-950/65 sm:text-base">
            Each calendar year Qualcomm ships a new flagship silicon. Android
            ultra-phones below are tagged to that chip; Pixels and iPhones sit
            in the same year buckets with Tensor or Apple silicon called out.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FLAGSHIP_YEARS.map(({ year, chips }, i) => (
              <li
                key={year}
                className="animate-rise rounded-xl border border-teal-900/10 bg-white/70 px-4 py-3 backdrop-blur-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <a href={`#year-${year}`} className="block transition hover:opacity-80">
                  <span className="text-xs font-semibold tracking-wider text-teal-800/60 uppercase">
                    {year}
                  </span>
                  <span className="mt-1 block font-[family-name:var(--font-display)] text-lg text-teal-950">
                    {chips.join(" · ")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="rom-guide" className="mb-14 scroll-mt-20">
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-950 sm:text-3xl">
            Why ROM type matters
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-teal-950/65 sm:text-base">
            China ROM twins are often cheaper on Shopee / Facebook Marketplace,
            but they ship without Google. Tap any ROM badge in the table for
            advantages and disadvantages.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.values(ROM_PROFILES).map((profile) => (
              <article
                key={profile.id}
                className="rounded-xl border border-teal-900/10 bg-white/75 p-4"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg text-teal-950">
                  {profile.shortLabel}
                </h3>
                <p className="mt-2 text-sm text-teal-950/70">{profile.summary}</p>
                <div className="mt-3 grid gap-3 text-xs sm:text-sm">
                  <div>
                    <p className="font-semibold text-emerald-800">Pros</p>
                    <ul className="mt-1 space-y-1 text-teal-950/75">
                      {profile.advantages.slice(0, 2).map((a) => (
                        <li key={a}>· {a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-rose-800">Cons</p>
                    <ul className="mt-1 space-y-1 text-teal-950/75">
                      {profile.disadvantages.slice(0, 2).map((d) => (
                        <li key={d}>· {d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="catalog" className="scroll-mt-20">
          <div className="mb-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-950 sm:text-3xl">
              Phone catalog
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-teal-950/65 sm:text-base">
              Source prices are typical launch / street MSRP for the base
              storage config. The PHP column refreshes from live exchange rates
              (USD, CNY, EUR, and more) so the peso figure moves with the
              market.
            </p>
          </div>
          <PhoneCatalog />
        </section>
      </main>

      <footer className="border-t border-teal-900/10 bg-white/60 py-8 text-center text-sm text-teal-950/55">
        <p>
          ChipPresyo · educational catalog — verify seller ROM screenshots and
          PH warranty before you buy.
        </p>
      </footer>
    </div>
  );
}