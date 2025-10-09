import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/AboutSection";
import ProductShowcase from "@/components/ProductShowcase";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { organizationSchema, localBusinessSchema } from "@/lib/structuredData";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema, localBusinessSchema]
        }}
      />
      <Navbar />
      <main>
        <HeroSlider />
        <AboutSection />
        <ProductShowcase />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
