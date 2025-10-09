import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, CheckCircle, FileCheck, Users, Wrench } from "lucide-react";

const Quality = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-hero flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/src/assets/project-3.jpg')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Assurance</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Committed to excellence in every aspect of our work
          </p>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Quality Promise</h2>
            <p className="text-lg text-muted-foreground">
              At MaxPrefabs, quality is not just a goal—it's our foundation. We maintain rigorous quality 
              control processes throughout design, manufacturing, and installation to ensure every product 
              meets the highest standards of durability, safety, and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "ISO Certified",
                description: "ISO 9001:2015 certified quality management systems ensuring consistent excellence"
              },
              {
                icon: Award,
                title: "Industry Recognition",
                description: "Multiple awards for innovation and quality in modular construction"
              },
              {
                icon: CheckCircle,
                title: "Rigorous Testing",
                description: "Every product undergoes comprehensive testing before delivery"
              },
              {
                icon: FileCheck,
                title: "Documentation",
                description: "Complete documentation and certification for all products and materials"
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Highly trained professionals committed to quality at every stage"
              },
              {
                icon: Wrench,
                title: "After-Sales Support",
                description: "Ongoing support and maintenance to ensure long-term performance"
              }
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <item.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Quality Control Process</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Design Review",
                description: "Engineering analysis and material selection"
              },
              {
                step: "02",
                title: "Production Control",
                description: "Factory inspection at every manufacturing stage"
              },
              {
                step: "03",
                title: "Final Inspection",
                description: "Comprehensive testing before dispatch"
              },
              {
                step: "04",
                title: "Installation QC",
                description: "On-site verification and customer acceptance"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-primary mb-4">{item.step}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Certifications & Compliance</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">ISO 9001:2015 - Quality Management</h3>
                  <p className="text-muted-foreground">
                    Our quality management system is certified to international standards, ensuring 
                    consistent processes and continuous improvement.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">ISO 14001 - Environmental Management</h3>
                  <p className="text-muted-foreground">
                    Commitment to environmental responsibility through certified environmental management practices.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">CE Marking Compliance</h3>
                  <p className="text-muted-foreground">
                    All products meet European safety, health, and environmental protection standards.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">Fire Safety Certification</h3>
                  <p className="text-muted-foreground">
                    Materials and assemblies tested and certified for fire resistance and safety.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Warranty Commitment</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            We stand behind our products with comprehensive warranties covering materials, 
            workmanship, and structural integrity. Your satisfaction is our guarantee.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <div className="text-4xl font-bold mb-2">5 Years</div>
              <div className="opacity-90">Structural Warranty</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2 Years</div>
              <div className="opacity-90">Materials & Finishes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="opacity-90">Support Service</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Quality;
