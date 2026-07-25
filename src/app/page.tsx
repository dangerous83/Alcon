import { IntroGate } from "@/components/intro/IntroGate";
import { ScrollVideoHero } from "@/components/hero/ScrollVideoHero";
import { MainServices } from "@/components/sections/MainServices";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { CreativeProcess } from "@/components/sections/CreativeProcess";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <IntroGate>
      <ScrollVideoHero />
      <MainServices />
      <FeaturedProjects />
      <CreativeProcess />
      <FinalCta />
    </IntroGate>
  );
}
