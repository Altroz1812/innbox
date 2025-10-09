import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-container-building.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

const slides = [
  {
    tag: "FLEXIBLE AND PORTABLE",
    title: "Demountable, Flat pack, Modular",
    highlight: "Container",
    subtitle: "Solutions",
    description: "Our demountable, flat pack, modular containers are the ideal solution for fast and practical construction. Discover the demountable containers for your needs.",
    image: heroImage,
  },
  {
    tag: "CUSTOMIZABLE AND DURABLE",
    title: "",
    highlight: "Prefabricated Building",
    subtitle: "Solutions",
    description: "Our prefabricated buildings offer solutions suitable for every project with customizable designs and long life spans.",
    image: project1,
  },
  {
    tag: "COMFORT AND AESTHETICS",
    title: "Modern",
    highlight: "Container House",
    subtitle: "Models",
    description: "Our container houses offer comfortable and aesthetic structures that reflect the modern lifestyle. Check out our container house options.",
    image: project2,
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 grid md:grid-cols-2">
            {/* Left Content */}
            <div className="relative z-10 bg-gradient-to-r from-gray-800/95 to-gray-800/80 flex items-center">
              <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-xl">
                  <p className="text-xs md:text-sm font-semibold tracking-wider text-primary-foreground/80 mb-3 uppercase">
                    {slide.tag}
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                    {slide.title}{" "}
                    <span className="text-primary">{slide.highlight}</span>{" "}
                    {slide.subtitle}
                  </h1>
                  <p className="text-sm md:text-base text-primary-foreground/90 mb-6 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-h-[44px]" asChild>
                      <Link to="/contact">GET OFFER NOW</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground min-h-[44px]"
                      asChild
                    >
                      <Link to="/products">MORE INFO</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div
              className="hidden md:block bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-primary-foreground/20 hover:bg-primary-foreground/40 p-3 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-primary-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-primary-foreground/20 hover:bg-primary-foreground/40 p-3 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-primary-foreground" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-primary" : "w-2 bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
