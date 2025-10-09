import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";
import { organizationSchema, breadcrumbSchema } from "@/lib/structuredData";

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Us - Innbox Modular Prefab"
        description="Learn about Innbox Modular Prefab, a leading manufacturer of prefabricated buildings based in Hyderabad, India with expertise in modular construction."
        keywords="about innbox, prefab manufacturer, modular construction company, India manufacturer, Hyderabad"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            organizationSchema,
            breadcrumbSchema([
              { name: "Home", url: "https://innboxprefab.com/" },
              { name: "About", url: "https://innboxprefab.com/about" }
            ])
          ]
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] bg-gradient-hero flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/src/assets/hero-container-building.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Innbox Modular Prefab</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Leading the prefabricated construction industry in India with innovation and quality
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Innbox Modular Prefab is a premier manufacturer of prefabricated buildings and modular construction solutions 
              based in Hyderabad, India. We have established ourselves as a trusted partner for 
              construction projects of all scales across India and beyond.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice 
              for businesses and organizations across various sectors. From portable cabins to complete modular 
              buildings, we deliver solutions that combine durability, functionality, and aesthetic appeal.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide innovative, sustainable, and cost-effective prefabricated construction solutions 
                  that exceed customer expectations while maintaining the highest standards of quality and safety.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the leading global provider of modular construction solutions, recognized for our 
                  commitment to innovation, sustainability, and customer success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: "Quality Excellence",
                description: "Uncompromising commitment to the highest quality standards"
              },
              {
                icon: Users,
                title: "Customer Focus",
                description: "Dedicated to understanding and exceeding customer needs"
              },
              {
                icon: Target,
                title: "Innovation",
                description: "Continuously improving through cutting-edge solutions"
              },
              {
                icon: Eye,
                title: "Integrity",
                description: "Operating with transparency, honesty, and accountability"
              }
            ].map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <value.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15+", label: "Years Experience" },
              { number: "500+", label: "Projects Completed" },
              { number: "100+", label: "Happy Clients" },
              { number: "50+", label: "Team Members" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
