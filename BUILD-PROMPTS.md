# 011112.com — Phase-wise Build Prompts

Concept: **011112 = 0 → 1111 → 2** — "Zero → Launch → Scale". A free launchpad for founders, solo builders and AI side-hustlers: 9 browser-based tools, the 0‑1111‑2 Method, guides, videos, contests, careers, donations and a high-converting free launch-plan funnel. Static HTML/CSS/JS on GitHub Pages (main branch), monetised by Google AdSense `ca-pub-6620975821265271`.

Global rules for every phase:
- Static site only (no server). Plain HTML/CSS/vanilla JS. Mobile-first, accessible (WCAG AA), dark/light theme.
- Every page `<head>` includes:
  `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
- Every page top bar: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" → links to `https://web.works/contact` (URL only inside the href, never as visible text).
- All forms deliver to the single owner inbox via a form relay whose address is assembled in JS from an obfuscated token — the email address must never appear in HTML, visible text or plain source.
- No use of "011112" as a claimed trademark; add trademark/copyright disclosure in footer and on /disclaimer.html.
- Original content only; no income guarantees; label all ads/sponsored content.

---

## Phase 1 — Research & positioning
> Research the significance of "011112" across commerce, business, AI, economy and people (binary 0/1, "zero to one", 11.11 Singles' Day, 1 = solo founder, 2 = scale). Review 25+ leading founder/startup/AI-tool sites (Product Hunt, Indie Hackers, Failory, Startup Stash, BetaList, Starter Story, Exploding Topics, Foundr, SBA, SCORE, Wellfound, F6S, Gust, First Round Review, NFX, MicroConf, There's An AI For That, Futurepedia, Namelix, Shopify Tools, Entrepreneur, HubSpot for Startups, IdeaBrowser, a16z, Startups.com, YC). Output RESEARCH.md with a meaning table, monetisation rationale (high-CPC business/finance/AI intent), competitor feature table and the chosen concept: the 0‑1111‑2 Method.

## Phase 2 — Design system & layout shell
> Create `assets/css/style.css`: ink background (#0a0c16), electric lime (#c8ff3d), violet (#8b6cff), cyan accents; Space Grotesk headings, Inter body, JetBrains Mono for digits. Components: sticky glass header with dropdowns + mobile burger, gradient top interest bar, hero with binary-rain canvas and six digit tiles (0 1 1 1 1 2) labelled Idea/Validate/Build/Launch/Earn/Scale, cards, stats, tags, buttons, forms, chips, multi-step progress bar, result panels, meters, canvas charts, video facades, tiers, allocation bar, FAQ accordions, countdowns, CTA band, footer (5 columns), cookie bar, exit-intent modal, toast, back-to-top, reveal animations, print styles, light theme overrides. Build `_src/build.py` that wraps page fragments (with a JSON META comment) in a shared layout: SEO meta, canonical, OG/Twitter, JSON-LD (WebSite, Organization, Breadcrumb, Article, FAQ, WebApplication), AdSense script, top bar, nav, footer, modal, scripts; generate sitemap.xml.

## Phase 3 — Core JavaScript
> `assets/js/config.js` (AdSense client, obfuscated form token, optional AD_SLOTS, optional PAY_LINKS, partner URL). `assets/js/main.js`: theme persistence, mobile menu, scroll reveal, cookie consent, manual ad-unit injection only when slot IDs exist, partner links, lite YouTube facades (youtube-nocookie, load on click), AJAX form relay (honeypot, validation, subject tagging, success/error states, no email exposure), multi-step forms, query-string prefill, donation tier buttons (payment link if configured, else pledge form), exit-intent lead magnet (once per session), copy/share, binary rain, countdowns (fixed date + month-end contest), daily tip loader. All storage wrapped in try/catch.

## Phase 4 — Free tools (traffic engine)
> `assets/js/tools.js` + 9 pages under /tools/, each with H1, the interactive tool, an explanatory article (300+ words, formulas shown), an inline "turn this result into a launch plan" lead form carrying the result in a hidden field, related tools and an ad zone:
> 1) Startup Idea Score (10 sliders → 0–100, verdict, 3 weakest factors) 2) Business Name Generator (4 styles, TLD, max length, favourites, domain check links) 3) Startup Cost Calculator (5 model presets, currency, runway months, buffer) 4) Runway & Burn (growth-adjusted month-by-month, default-alive, break-even month, 36-month chart) 5) Break-even (units, revenue, margin, profit target) 6) MRR & LTV (24-month projection table + chart, LTV, LTV:CAC, payback) 7) Valuation Estimator (model multiples adjusted for growth, margin, churn; disclaimer) 8) Launch Checklist (48 tasks by stage, saved progress, print) 9) Commerce Launch Calendar (auto-computed 11.11, Black Friday, Cyber Monday, Giving Tuesday, Mother's/Father's Day etc., countdown to next, 6-week prep dates). Add /tools.html hub grouped by stage.

## Phase 5 — Content for AdSense approval & SEO
> Write original, helpful content: /method.html (the six stages with activities, metric and exit test each) and 8 guides (validate an idea in 7 days, startup costs, runway & burn, SaaS pricing, AI side hustles, business name & domain, launch-day playbook, 11.11 for small businesses), each 700–1,200 words with tables, internal links to tools, Article schema, byline "011112.com Editorial Team", educational disclaimer and lead box. Add /guides.html index and /videos.html with verified YouTube embeds (YC Startup School: ideas, talking to users, MVP, pitching; Stanford "How to Start a Startup" L1; Simon Sinek TEDx) plus a video-suggestion form.

## Phase 6 — Lead generation funnel (highest priority conversion)
> Home hero dual CTA + quick 4-field lead box; dedicated /get-your-plan.html 3-step form (stage, business type, idea → needs chips incl. website, premium domain, AI automation, marketing, pricing, funding, hiring + budget, timeline, 90-day goal → contact details, country, optional phone/WhatsApp, strategy-call opt-in, consent). Tool-level lead boxes, exit-intent "0‑1111‑2 Launch Kit" modal, footer newsletter, sticky header CTA "Get Free Launch Plan". Trust badges, FAQ, 1–2 day reply promise.

## Phase 7 — Community & revenue pages
> /support.html: donation tiers ($5 Coffee, $25 Builder, $100 Launch Partner, $500 Founding Patron, custom; one-time/monthly), published allocation (operations 35%, tools & content 20%, contests & prizes 15%, promotion & marketing 15%, hiring talent 15%), pledge form that returns a secure payment link (or direct PAY_LINKS), not-tax-deductible notice.
> /contests.html: monthly 0→1 Launch Contest (3 categories), prizes incl. sponsor prizes, live month-end countdown, weighted judging table, entry form, prize-sponsor form, official rules (no purchase necessary, 18+, void where prohibited, skill-based).
> /careers.html: 6 remote roles + talent network application form. /advertise.html: 8 sponsorship packages, media-kit form, advertising standards.

## Phase 8 — Trust, legal & compliance
> /about.html (number story, audience, editorial policy, funding, independence), /contact.html (topic form + business link), /privacy.html (forms relay, local storage, AdSense & third-party vendor cookie language with Google opt-out links, certified CMP for EEA/UK, YouTube embeds, rights under GDPR/PIPEDA/Law 25/CCPA/DPDP, children), /terms.html, /disclaimer.html (trademark disclosure for "011112", third-party names incl. *Zero to One*, YouTube ownership, copyright notice, ad/affiliate disclosure, no professional advice), 404.html (noindex). ads.txt: `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`. robots.txt, sitemap.xml, manifest, favicon/icons, 1200×630 OG image.

## Phase 9 — Deploy, automate, verify
> Push to `github.com/WEBWORKSA1/011112-com` (main). Settings → Pages → Deploy from a branch → main / (root). Add CNAME `011112.com` and DNS (A records 185.199.108-111.153 + `www` CNAME → webworksa1.github.io), enforce HTTPS. Add `.github/workflows/refresh.yml` (daily cron: rotate tip of the day in data/daily.json, stamp sitemap lastmod, commit → Pages rebuild). Verify: every page has the AdSense script and top bar, all internal links resolve, no email address in any file, forms post successfully, tools compute, Lighthouse mobile ≥ 90. Then submit the site in AdSense, enable Auto ads + Google-certified CMP (Privacy & messaging), and submit sitemap in Search Console.

## Phase 10 — Growth & expansion (post-launch)
> Add a tool per month (pitch-deck scorer, pricing-page grader, CAC calculator, cap-table simulator), one guide per week, YouTube Shorts per tool, newsletter, monthly contest winners page, supporters wall, sponsor slots, multilingual versions (Hindi, French, Spanish), and an 11.11 / Black Friday seasonal takeover.
