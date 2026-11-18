#!/usr/bin/env python3
"""Daily auto-refresh for 011112.com (run by .github/workflows/refresh.yml).
Rotates the founder tip of the day in data/daily.json and stamps sitemap.xml <lastmod>
so search engines see fresh activity. Committing these changes to main triggers a GitHub Pages rebuild."""
import datetime, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIPS = [
    "Talk to ten potential customers before you write a line of code.",
    "Write your problem in the customer's words — then use those words on your landing page.",
    "Count commitments, not compliments: a pre-order beats a hundred likes.",
    "Cut your MVP until you can ship it in 30 days.",
    "Pick one launch channel and win it before adding a second.",
    "Offer an annual plan — cash upfront extends runway.",
    "Interview every customer who cancels. Churn is free research.",
    "Raise prices for new customers before you raise more money.",
    "Know your runway in months without looking it up.",
    "LTV:CAC of 3:1 is a healthy target; payback under 12 months keeps cash calm.",
    "Plan launches six weeks out — 11.11 and Black Friday reward the prepared.",
    "Automate the task you've done manually three times this week.",
    "Document your playbook before you hire for it.",
    "A short, memorable domain saves marketing money every single day.",
    "Default alive beats default dead — model three growth scenarios.",
    "Double what works before you invent something new. That's the 2 in 011112.",
    "Ship, then talk to users, then ship again. Repeat.",
    "Your first 100 customers come from doing things that don't scale.",
    "Run a trademark search before you fall in love with a name.",
    "Measure activated users, not sign-ups.",
    "One clear call to action per page converts better than five.",
]

def main():
    today = datetime.date.today()
    tip = TIPS[today.toordinal() % len(TIPS)]
    data_dir = ROOT / "data"; data_dir.mkdir(exist_ok=True)
    (data_dir / "daily.json").write_text(json.dumps({"date": today.strftime("%b %d, %Y"), "tip": tip, "generated": today.isoformat()}, indent=2) + "\n", encoding="utf-8")
    sm = ROOT / "sitemap.xml"
    if sm.exists():
        sm.write_text(re.sub(r"<lastmod>[^<]+</lastmod>", f"<lastmod>{today.isoformat()}</lastmod>", sm.read_text(encoding="utf-8")), encoding="utf-8")
    print("Refreshed:", tip)

if __name__ == "__main__":
    main()
