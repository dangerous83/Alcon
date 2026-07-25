import { ScrollVideoHero } from "@/components/hero/ScrollVideoHero";
import { PositioningStatement } from "@/components/sections/PositioningStatement";
import { MainServices } from "@/components/sections/MainServices";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { CreativeProcess } from "@/components/sections/CreativeProcess";
import { Capabilities } from "@/components/sections/Capabilities";
import { Credibility } from "@/components/sections/Credibility";
import { CollaborationAdvantage } from "@/components/sections/CollaborationAdvantage";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <ScrollVideoHero />
      <PositioningStatement />
      <MainServices />
      <FeaturedProjects />
      <CreativeProcess />
      <Capabilities />
      <Credibility />
      <CollaborationAdvantage />
      <FinalCta />
    </>
  );
}
