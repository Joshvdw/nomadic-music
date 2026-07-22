"use client";

import { useEffect, useState } from "react";
import { decodeEmail } from "./email";

// Reveals the address only after mount, so it's absent from the SSR HTML a
// non-JS crawler would scrape. Returns "" until hydration — callers should
// guard their mailto href on it (an empty string → no live mailto in source).
export default function useEmail() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    // Intentional post-mount set: keeps the address out of the SSR HTML so
    // non-JS crawlers can't scrape it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(decodeEmail());
  }, []);
  return email;
}
