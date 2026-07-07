import Menu from "@/components/Menu";
import SocialsSidebar from "@/components/SocialsSidebar";
import Hero from "@/components/sections/Hero";
import Biography from "@/components/sections/Biography";
import Streaming from "@/components/sections/Streaming";
import Collabs from "@/components/sections/Collabs";
import CollabCta from "@/components/sections/CollabCta";
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
        <Hero />
        <Biography />
        <Streaming />
        <Live />
        <Gallery />
        <Services />
        <Collabs />
        <CollabCta />
        <Contact />
      </main>
    </>
  );
}
