import { IntroGate } from "@/components/intro/IntroGate";
import { ScrollVideoHero } from "@/components/hero/ScrollVideoHero";
import { MainServices } from "@/components/sections/MainServices";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <IntroGate>
      {/* Scroll-scrubbed hero banner is desktop-only per request; on phones
          the page opens straight into the services and project sections. */}
      <div className="hidden md:block">
        <ScrollVideoHero />
      </div>
      <MainServices />
      <FeaturedProjects />
      <FinalCta />
    </IntroGate>
  );
}
