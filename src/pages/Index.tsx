import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { StylesSection } from "@/components/sections/StylesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PricingSection } from "@/components/sections/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <StylesSection />
        <HowItWorksSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
