#!/usr/bin/env python3
"""Static site builder for 011112.com.
Reads page fragments from _src/pages and _src/guides (each starts with a <!--META {json} --> line),
wraps them in the shared layout and writes plain HTML to the repo root. Run: python3 _src/build.py"""
import json, re, pathlib, datetime, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "_src"
DOMAIN = "https://011112.com"
ADS = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>'
TODAY = datetime.date.today().isoformat()

NAV = [
    ("home", "/", "Home"),
    ("method", "/method.html", "The 0‑1111‑2 Method"),
    ("tools", "/tools.html", "Free Tools", [
        ("/tools/idea-score.html", "💡 Startup Idea Score"),
        ("/tools/business-name-generator.html", "🏷️ Business Name Generator"),
        ("/tools/startup-cost-calculator.html", "🧮 Startup Cost Calculator"),
        ("/tools/runway-calculator.html", "⏳ Runway & Burn Calculator"),
        ("/tools/break-even-calculator.html", "⚖️ Break-even Calculator"),
        ("/tools/mrr-calculator.html", "📈 MRR & LTV Projector"),
        ("/tools/valuation-calculator.html", "💎 Valuation Estimator"),
        ("/tools/launch-checklist.html", "✅ Launch Checklist"),
        ("/tools/launch-calendar.html", "📅 Commerce Launch Calendar"),
    ]),
    ("guides", "/guides.html", "Guides"),
    ("videos", "/videos.html", "Videos"),
    ("community", "/contests.html", "Community", [
        ("/contests.html", "🏆 Launch Contests"),
        ("/careers.html", "🧑‍💻 Careers & Talent"),
        ("/support.html", "❤️ Support Us"),
        ("/advertise.html", "📣 Advertise & Sponsor"),
    ]),
    ("about", "/about.html", "About"),
]

def nav_html(active):
    out = []
    for item in NAV:
        key, href, label = item[0], item[1], item[2]
        cur = ' aria-current="page"' if key == active else ""
        if len(item) == 4:
            sub = "".join(f'<li><a href="{h}">{l}</a></li>' for h, l in item[3])
            out.append(f'<li class="has-drop"><a href="{href}"{cur}>{label} ▾</a><ul class="drop">{sub}</ul></li>')
        else:
            out.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    return "".join(out)

def layout(meta, body):
    title = meta["title"]
    full_title = title if "011112" in title else f"{title} | 011112.com"
    desc = meta["desc"]
    path = meta["path"]
    url = DOMAIN + ("/" if path == "/index.html" else path)
    schema = meta.get("schema", [])
    if isinstance(schema, dict): schema = [schema]
    crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"}]}
    if path != "/index.html":
        crumbs["itemListElement"].append({"@type": "ListItem", "position": 2, "name": title, "item": url})
    schema = schema + [crumbs]
    ld = "\n".join(f'<script type="application/ld+json">{json.dumps(s, ensure_ascii=False)}</script>' for s in schema)
    tool = meta.get("tool", "")
    tool_js = '<script src="/assets/js/tools.js" defer></script>' if tool else ""
    body_attr = f' data-tool="{tool}"' if tool else ""
    og_type = "article" if meta.get("article") else "website"
    return f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(full_title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
<meta name="robots" content="{'noindex,follow' if meta.get('noindex') else 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="#0a0c16">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="011112.com">
<meta property="og:title" content="{html.escape(full_title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOMAIN}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/icon-192.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
{ADS}
{ld}
</head>
<body{body_attr}>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><a href="https://web.works/contact" target="_blank" rel="noopener">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership</a></div>
<header class="site-header">
  <nav class="container nav" aria-label="Main">
    <a class="brand" href="/" aria-label="011112.com home"><span class="logo">0→2</span><span>011112<small>Zero → Launch → Scale</small></span></a>
    <ul class="menu">{nav_html(meta.get("nav", ""))}</ul>
    <div class="nav-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle light/dark theme">◐</button>
      <a class="btn btn-primary btn-sm" href="/get-your-plan.html">Get Free Launch Plan</a>
      <button class="icon-btn burger" aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </nav>
</header>
<main id="main">
{body}
</main>
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/"><span class="logo">0→2</span><span>011112<small>Zero → Launch → Scale</small></span></a>
        <p class="muted mt2">Free tools, guides and a simple method to take an idea from zero to a launched, earning business — then double it.</p>
        <form class="inline-form" data-form="newsletter" data-success="🎉 You're in! Watch your inbox for the 0‑1111‑2 Launch Kit.">
          <input type="email" name="email" placeholder="Your email" required aria-label="Email for newsletter">
          <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="btn btn-primary btn-sm" type="submit">Join</button>
          <div class="form-msg" role="status"></div>
        </form>
      </div>
      <div><h4>Free Tools</h4><ul>
        <li><a href="/tools/idea-score.html">Idea Score</a></li><li><a href="/tools/business-name-generator.html">Name Generator</a></li>
        <li><a href="/tools/startup-cost-calculator.html">Startup Costs</a></li><li><a href="/tools/runway-calculator.html">Runway</a></li>
        <li><a href="/tools/mrr-calculator.html">MRR &amp; LTV</a></li><li><a href="/tools.html">All tools →</a></li></ul></div>
      <div><h4>Learn</h4><ul>
        <li><a href="/method.html">The 0‑1111‑2 Method</a></li><li><a href="/guides.html">Guides</a></li>
        <li><a href="/videos.html">Video Library</a></li><li><a href="/tools/launch-calendar.html">Launch Calendar</a></li>
        <li><a href="/get-your-plan.html">Free Launch Plan</a></li></ul></div>
      <div><h4>Community</h4><ul>
        <li><a href="/contests.html">Contests &amp; Prizes</a></li><li><a href="/careers.html">Careers</a></li>
        <li><a href="/support.html">Support / Donate</a></li><li><a href="/advertise.html">Advertise</a></li>
        <li><a href="https://web.works/contact" target="_blank" rel="noopener">Buy / Partner</a></li></ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="/about.html">About</a></li><li><a href="/contact.html">Contact</a></li>
        <li><a href="/privacy.html">Privacy Policy</a></li><li><a href="/terms.html">Terms of Use</a></li>
        <li><a href="/disclaimer.html">Disclaimer &amp; Trademark</a></li><li><a href="/sitemap.xml">Sitemap</a></li></ul></div>
    </div>
    <div class="legal">
      <p>© <span data-year>2026</span> 011112.com. All original content, tools and design are protected by copyright. “011112” is used here as a domain name and numeric identifier only; this site is not affiliated with, endorsed by, or sponsored by any company, product or trademark that uses the same number sequence. Third-party names, books, logos and videos belong to their respective owners. Content is educational and is not financial, legal or tax advice. <a href="/disclaimer.html">Full disclosure</a>.</p>
    </div>
  </div>
</footer>
<div class="cookie" role="dialog" aria-label="Cookie notice">
  We use cookies for essential functions, analytics and to show ads from Google AdSense (which may personalise ads). See our <a href="/privacy.html">Privacy Policy</a>.
  <div class="btns"><button class="btn btn-primary btn-sm" data-cookie="all">Accept</button><button class="btn btn-ghost btn-sm" data-cookie="essential">Essential only</button></div>
</div>
<div class="modal" id="leadModal" role="dialog" aria-modal="true" aria-labelledby="lmTitle">
  <div class="box">
    <button class="x" aria-label="Close">×</button>
    <span class="kicker">Free · 7-day email course</span>
    <h3 id="lmTitle">Get the 0‑1111‑2 Launch Kit</h3>
    <p class="muted">Checklists, templates and the exact launch sequence — free in your inbox.</p>
    <form data-form="lead-magnet" data-success="✅ Check your inbox — your Launch Kit is on its way.">
      <div class="field"><input type="text" name="name" placeholder="First name" required aria-label="First name"></div>
      <div class="field"><input type="email" name="email" placeholder="Email address" required aria-label="Email"></div>
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to receive emails and accept the <a href="/privacy.html">Privacy Policy</a>.</label>
      <button class="btn btn-primary btn-block mt2" type="submit">Send me the kit</button>
      <div class="form-msg" role="status"></div>
    </form>
  </div>
</div>
<button class="icon-btn to-top" aria-label="Back to top">↑</button>
<script src="/assets/js/config.js"></script>
<script src="/assets/js/main.js" defer></script>
{tool_js}
</body>
</html>
"""

def tool_lead(name, hidden_id=""):
    hid = f'<input type="hidden" name="result" id="{hidden_id}">' if hidden_id else ""
    return f"""<div class="lead-box mt2">
  <div class="grid g2" style="align-items:center">
    <div><span class="kicker">Free expert review</span><h3>Turn this result into a launch plan</h3>
    <p class="muted">Send your result and we'll reply with a personalised 0‑1111‑2 plan: what to fix first, what to build, where to launch and how to price. Free, no obligation.</p></div>
    <form data-form="tool-lead:{name}" data-success="✅ Sent! We'll review your result and reply within 1–2 business days.">
      {hid}
      <div class="row"><div class="field"><label>Name</label><input name="name" required autocomplete="name"></div>
      <div class="field"><label>Email</label><input type="email" name="email" required autocomplete="email"></div></div>
      <div class="field"><label>Anything we should know? (optional)</label><input name="notes" placeholder="Your idea, market or goal"></div>
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="check"><input type="checkbox" name="consent" value="yes" required> I agree to be contacted and accept the <a href="/privacy.html">Privacy Policy</a>.</label>
      <button class="btn btn-primary btn-block mt2" type="submit">Get my free plan →</button>
      <div class="form-msg" role="status"></div>
    </form>
  </div></div>"""

RELATED = """<h2 class="mt2" style="font-size:1.4rem">More free tools</h2><div class="grid g4">
<a class="card" href="/tools/idea-score.html"><h3>💡 Idea Score</h3></a><a class="card" href="/tools/startup-cost-calculator.html"><h3>🧮 Startup Costs</h3></a>
<a class="card" href="/tools/runway-calculator.html"><h3>⏳ Runway</h3></a><a class="card" href="/tools/mrr-calculator.html"><h3>📈 MRR &amp; LTV</h3></a></div>"""

def expand(body):
    body = re.sub(r"\{\{TOOL_LEAD:([\w-]+)(?::([\w-]+))?\}\}", lambda m: tool_lead(m.group(1), m.group(2) or ""), body)
    return body.replace("{{RELATED}}", RELATED)

def guide_shell(meta, body):
    return f"""<div class="page-hero"><div class="container">
  <div class="crumbs"><a href="/">Home</a> / <a href="/guides.html">Guides</a> / {html.escape(meta['short'])}</div>
  <span class="tag">{meta['stage']}</span>
  <h1>{html.escape(meta['title'])}</h1>
  <p>{html.escape(meta['desc'])}</p>
</div></div>
<section><div class="container layout-side">
<article class="prose">
  <p class="meta">By the 011112.com Editorial Team · Updated {meta.get('updated_label','November 2026')} · {meta.get('read','7')} min read</p>
  {body}
  <div class="ad-zone" data-slot="inArticle"></div>
  <hr style="border-color:var(--line);margin:2rem 0">
  <p class="muted" style="font-size:.88rem">Educational content only — not financial, legal or tax advice. See our <a href="/disclaimer.html">disclaimer</a>.</p>
  {tool_lead('guide-' + meta['path'].split('/')[-1].replace('.html',''))}
</article>
<aside class="sidebar"><div class="card">
  <h4>Put it into practice</h4>
  <p class="muted">{meta['cta_text']}</p>
  <a class="btn btn-primary btn-block" href="{meta['cta_href']}">{meta['cta_label']}</a>
  <a class="btn btn-ghost btn-block mt2" href="/get-your-plan.html">Get a free launch plan</a>
  <button class="btn btn-ghost btn-block mt2" data-share>Share this guide</button>
  <div class="ad-zone" data-slot="sidebar"></div>
</div></aside>
</div></section>"""

def read(p):
    t = p.read_text(encoding="utf-8")
    m = re.match(r"<!--META\s*(\{.*?\})\s*-->\s*", t, re.S)
    if not m: raise SystemExit(f"Missing META in {p}")
    return json.loads(m.group(1)), expand(t[m.end():])

def main():
    pages = []
    for folder in ("pages", "guides"):
        for p in sorted((SRC / folder).glob("*.html")):
            meta, body = read(p)
            if meta.get("guide"):
                meta["article"] = True
                body = guide_shell(meta, body)
            if meta.get("article"):
                meta.setdefault("schema", [{
                    "@context": "https://schema.org", "@type": "Article", "headline": meta["title"],
                    "description": meta["desc"], "datePublished": meta.get("date", "2026-11-18"),
                    "dateModified": meta.get("updated", meta.get("date", "2026-11-18")),
                    "author": {"@type": "Organization", "name": "011112.com Editorial Team", "url": DOMAIN + "/about.html"},
                    "publisher": {"@type": "Organization", "name": "011112.com", "logo": {"@type": "ImageObject", "url": DOMAIN + "/assets/img/icon-512.png"}},
                    "mainEntityOfPage": DOMAIN + meta["path"]}])
            out = ROOT / meta["path"].lstrip("/")
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(layout(meta, body), encoding="utf-8")
            pages.append(meta)
    # sitemap
    urls = []
    for m in pages:
        if m.get("noindex"): continue
        loc = DOMAIN + ("/" if m["path"] == "/index.html" else m["path"])
        pri = "1.0" if m["path"] == "/index.html" else ("0.9" if m.get("tool") or m["path"] in ("/get-your-plan.html", "/tools.html") else "0.7")
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{TODAY}</lastmod><priority>{pri}</priority></url>")
    (ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(urls) + "\n</urlset>\n", encoding="utf-8")
    print(f"Built {len(pages)} pages")

if __name__ == "__main__":
    main()
