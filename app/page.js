import Menu from "@/components/Menu";
import SocialsSidebar from "@/components/SocialsSidebar";
import Hero from "@/components/sections/Hero";
import OrbHero from "@/components/sections/OrbHero";
import Biography from "@/components/sections/Biography";
import Streaming from "@/components/sections/Streaming";
import Collabs from "@/components/sections/Collabs";
import Live from "@/components/sections/Live";
import Gallery from "@/components/sections/Gallery";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Menu />
      <SocialsSidebar />
      <main>
        {/* ===== ORIGINAL HERO — restore by uncommenting this and removing OrbHero below ===== */}
        {/* <Hero /> */}

        {/* ===== TEST HERO — interactive chrome orb (remove to revert) ===== */}
        <OrbHero />
        <Biography />
        <Streaming />
        <Live />
        <Gallery />
        <Services />
        <Collabs />
        <Contact />
      </main>
    </>
  );
}
