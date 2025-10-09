import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import project3 from "@/assets/project-3.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-primary/10 rounded-lg -z-10" />
            <img src={project3} alt="About Innbox Modular Prefab" className="rounded-lg shadow-xl w-full" />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About <span className="text-primary">Innbox Modular Prefab</span>
            </h2>
            <div className="w-16 h-1 bg-primary mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-6">
              Innbox Modular Prefab is a leading manufacturer of prefabricated buildings based in Hyderabad, India. We
              continue to progress rapidly in the sector with our latest investments and innovations. With our expert
              staff, we provide solutions to our customers with high quality, fast delivery, and affordable cost. Our
              team specializes in prefabricated buildings and flat pack containers, serving clients across India and
              beyond.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary hover:bg-primary/90">
                About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
