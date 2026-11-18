/* 011112.com site configuration.
   - FORM_KEY: obfuscated, reversed token for the form relay. Never print it to the page.
   - AD_SLOTS: add AdSense ad-unit slot IDs here once created; empty = Auto ads only.
   - PAY_LINKS: optional hosted payment links (e.g. Stripe Payment Links / Buy Me a Coffee).
     When empty, donation buttons open the pledge form and a secure link is sent by reply. */
window.SITE_CONFIG = {
  ADSENSE_CLIENT: "ca-pub-6620975821265271",
  FORM_KEY: "=02bj5CbpFWbnBUMhN3ay92diV2d",
  AD_SLOTS: { inArticle: "", sidebar: "", footer: "" },
  PAY_LINKS: { coffee: "", builder: "", partner: "", patron: "", custom: "" },
  PARTNER_URL: "https://web.works/contact"
};
