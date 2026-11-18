# 011112.com — Zero → Launch → Scale

Free startup tools, guides and launch plans built around the **0‑1111‑2 Method** (Idea → Validate → Build → Launch → Earn → Scale).

- **Hosting:** GitHub Pages, main branch, root (`CNAME` → 011112.com)
- **Monetisation:** Google AdSense (Auto ads + optional manual slots in `assets/js/config.js`), lead generation, sponsorships, reader support
- **Auto-refresh:** `.github/workflows/refresh.yml` runs daily, rotates the tip of the day and sitemap `lastmod`

## Structure
```
index.html, method.html, tools.html, guides.html, videos.html, get-your-plan.html
contests.html, careers.html, support.html, advertise.html
about.html, contact.html, privacy.html, terms.html, disclaimer.html, 404.html
tools/   9 interactive calculators & generators
guides/  8 long-form guides
assets/  css, js (config, main, tools), img
_src/    build.py (page builder), refresh.py (daily job), pages/, guides/ (sources)
```

## Editing
Edit fragments in `_src/pages` or `_src/guides`, then run:
```
python3 _src/build.py
```

## Configuration (`assets/js/config.js`)
- `AD_SLOTS` — paste AdSense ad-unit slot IDs to enable in-content units (Auto ads work without them).
- `PAY_LINKS` — optional hosted payment links per donation tier; when empty, donors receive a secure link by reply.

See `RESEARCH.md` for the concept research and `BUILD-PROMPTS.md` for the phase-wise build prompts.

© 2026 011112.com. "011112" is used as a domain name only; no affiliation with any third-party mark using the same sequence.
