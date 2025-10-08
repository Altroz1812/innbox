import { Button } from "@/components/ui/button";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";
import laborAccommodation from "@/assets/labor-accommodation.jpg";

const projects = [
  { image: project1, title: "Multi-Unit Construction Site" },
  { image: project2, title: "Modern Office Complex" },
  { image: laborAccommodation, title: "Labor Accommodation" },
  { image: project4, title: "Residential Development" },
  { image: project5, title: "Labor Camp Facility" },
  { image: project6, title: "Commercial Business Park" },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground mb-3 uppercase">
            OUR PROJECTS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Finished Works
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our references reflect the strong and diverse portfolio of Innbox Prefab, which has 
            realized successful projects in various sectors internationally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-primary-foreground font-semibold p-6 text-lg">
                  {project.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            ALL PROJECTS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
