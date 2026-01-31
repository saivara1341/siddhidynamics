import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { VisionSection } from '@/components/sections/VisionSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { IncubationSection } from '@/components/sections/IncubationSection';
import { SubmitSection } from '@/components/sections/SubmitSection';
import { FooterSection } from '@/components/sections/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <VisionSection />
        <ProjectsSection />
        <IncubationSection />
        <SubmitSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
