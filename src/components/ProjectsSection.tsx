import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProjectImages, type ProjectImage } from "@/lib/projects";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";
import laborAccommodation from "@/assets/labor-accommodation.jpg";

const fallbackProjects = [
  { image: project1, title: "Multi-Unit Construction Site" },
  { image: project2, title: "Modern Office Complex" },
  { image: laborAccommodation, title: "Labor Accommodation" },
  { image: project4, title: "Residential Development" },
  { image: project5, title: "Labor Camp Facility" },
  { image: project6, title: "Commercial Business Park" },
];

const ProjectsSection = () => {
  const [projects, setProjects] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjectImages();
        setProjects(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const displayProjects = projects.length > 0
    ? projects.map(p => ({ image: p.image_url, title: p.title }))
    : fallbackProjects;

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
            Our references reflect the strong and diverse portfolio of Max Prefabs, which has 
            realized successful projects in various sectors internationally.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-lg shadow-md">
                <Skeleton className="aspect-[4/3] w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayProjects.map((project, index) => (
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
        )}

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
