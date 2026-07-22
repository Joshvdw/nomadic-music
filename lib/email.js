// The contact address is stored base64-encoded so it never appears as a
// plaintext string in the server-rendered HTML or the client bundle. This
// defeats the email-harvesting bots that scrape `mailto:` links and bare
// `user@host` text. Humans get the real address at runtime; the form submits
// through /api/contact, where the address stays server-side entirely.
const ENCODED = "Y29udGFjdEBub21hZGljbXVzaWMubGl2ZQ==";

export function decodeEmail() {
  if (typeof atob === "function") return atob(ENCODED);
  return Buffer.from(ENCODED, "base64").toString("utf8");
}
