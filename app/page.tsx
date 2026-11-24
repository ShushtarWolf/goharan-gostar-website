import { ScrollStory } from "@/components/ScrollStory";
import {
  CTA,
  CompanyIntro,
  FromStructure,
  Hero,
  MedicalApplication,
  PipetteTipFilter,
  PneumaticSilencer,
  StructurePerformance,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <ScrollStory />
      <main>
        <Hero />
        <CompanyIntro />
        <FromStructure />
        <PneumaticSilencer />
        <PipetteTipFilter />
        <MedicalApplication />
        <StructurePerformance />
        <CTA />
      </main>
    </>
  );
}
