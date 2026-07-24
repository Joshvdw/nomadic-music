import { EB_Garamond, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL, LINKS } from "@/lib/site";
import LenisProvider from "@/components/LenisProvider";
import RevealManager from "@/components/RevealManager";
import DevGuides from "@/components/DevGuides";
import { Analytics } from "@vercel/analytics/next";

const serif = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  title: "Nomadic | Electronic Music Producer & DJ",
  description:
    "Experience otherworldly sounds — tribal bass, organic downtempo and psy-dub. Music, live sets and bookings, the official hub for all things Nomadic.",
  keywords: [
    "Nomadic",
    "electronic producer",
    "psy-dub",
    "tribal techno",
    "downtempo",
    "DJ",
    "New Zealand",
    "Golden Bay",
    "bookings",
    "EPK",
  ],
  openGraph: {
    title: "Nomadic | Electronic Music Producer & DJ",
    description:
      "Experience otherworldly sounds — tribal bass, organic downtempo and psy-dub. Music, live sets and bookings, the official hub for all things Nomadic.",
    url: SITE_URL,
    siteName: "Nomadic Music",
    // og:image comes from the generated app/opengraph-image.js (hero scene +
    // Nomadic title block); twitter card mirrors it via app/twitter-image.js
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nomadic | Electronic Music Producer & DJ",
    description:
      "Experience otherworldly sounds — tribal bass, organic downtempo and psy-dub. Music, live sets and bookings, the official hub for all things Nomadic.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#080705",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Nomadic",
  alternateName: "Nomadic Music",
  url: SITE_URL,
  description:
    "Nomadic is a wandering producer and DJ from New Zealand, reimagining ancient sounds as otherworldly electronic music — tribal bass, organic downtempo and psy-dub.",
  image: `${SITE_URL}/images/og.jpg`,
  genre: ["Psy-dub", "Tribal bass", "Organic Downtempo", "Electronica"],
  foundingLocation: {
    "@type": "Place",
    name: "Golden Bay, New Zealand",
  },
  member: {
    "@type": "Person",
    name: "Joshua van der Waay",
    roleName: "Producer, DJ",
  },
  sameAs: [LINKS.spotify, LINKS.soundcloud, LINKS.bandcamp, LINKS.instagram],
};

// Security-suite browser extensions (Bitdefender etc.) stamp attributes like
// bis_skin_checked onto the served HTML before React hydrates, tripping
// hydration-mismatch warnings that aren't ours. Strip them at end-of-body
// parse, then keep stripping re-stamps via a filtered MutationObserver until
// hydration has safely completed (observer disconnects after 6s).
const stripExtensionAttrs = `(function(){try{
var strip=function(){var a=document.querySelectorAll("*");for(var i=0;i<a.length;i++){var t=a[i].attributes;for(var j=t.length-1;j>=0;j--){var n=t[j].name;if(n.indexOf("bis_")===0||n.indexOf("__processed")===0)a[i].removeAttribute(n)}}};
strip();
var mo=new MutationObserver(function(m){for(var i=0;i<m.length;i++){var r=m[i];if(r.type==="attributes"&&r.target.removeAttribute)r.target.removeAttribute(r.attributeName)}});
mo.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:["bis_skin_checked","bis_register","bis_size","bis_id"]});
setTimeout(function(){mo.disconnect()},6000);
}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Analytics />
        <LenisProvider>{children}</LenisProvider>
        <div className="grain" aria-hidden="true" />
        <RevealManager />
        <DevGuides />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: stripExtensionAttrs }} />
      </body>
    </html>
  );
}
