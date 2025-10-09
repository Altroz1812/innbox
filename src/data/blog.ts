export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogCategories = [
  "All",
  "Industry News",
  "Product Updates",
  "Case Studies",
  "Construction Tips",
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Modular Construction in 2025",
    slug: "future-of-modular-construction-2025",
    excerpt: "Explore the latest trends and innovations shaping the prefabricated construction industry.",
    content: `
      <p>The modular construction industry is experiencing unprecedented growth, driven by technological advancements and increasing demand for sustainable building solutions.</p>
      
      <h2>Key Trends Shaping the Industry</h2>
      <p>From advanced manufacturing techniques to smart building integration, discover what's driving the future of construction.</p>
      
      <h3>1. Sustainability Focus</h3>
      <p>Environmental considerations are now at the forefront of construction decisions. Modular buildings offer significant advantages in waste reduction and energy efficiency.</p>
      
      <h3>2. Digital Integration</h3>
      <p>BIM technology and IoT sensors are revolutionizing how we design, manufacture, and maintain prefabricated structures.</p>
      
      <h3>3. Speed to Market</h3>
      <p>With construction timelines reduced by up to 50%, modular solutions are becoming the preferred choice for time-sensitive projects.</p>
      
      <p>As the industry evolves, Innbox Modular Prefab remains committed to innovation and quality, ensuring our clients benefit from the latest advancements in modular construction technology.</p>
    `,
    image: "/src/assets/project-1.jpg",
    author: "John Smith",
    date: "2025-01-15",
    category: "Industry News",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "5 Benefits of Container Houses for Modern Living",
    slug: "benefits-container-houses",
    excerpt: "Why shipping container homes are revolutionizing residential construction.",
    content: `
      <p>Container houses have emerged as a innovative solution for modern housing needs, combining affordability, sustainability, and design flexibility.</p>
      
      <h2>Top 5 Advantages</h2>
      
      <h3>1. Cost-Effective Construction</h3>
      <p>Container homes can cost 20-30% less than traditional construction, making homeownership more accessible.</p>
      
      <h3>2. Rapid Build Time</h3>
      <p>Most container houses can be completed in 3-4 months compared to 6-12 months for conventional homes.</p>
      
      <h3>3. Eco-Friendly Solution</h3>
      <p>Repurposing shipping containers reduces waste and provides a second life to industrial materials.</p>
      
      <h3>4. Structural Strength</h3>
      <p>Designed to withstand extreme conditions during ocean transport, containers offer exceptional durability.</p>
      
      <h3>5. Design Flexibility</h3>
      <p>Modern container architecture allows for creative, customizable living spaces that reflect individual style.</p>
    `,
    image: "/src/assets/container-house.jpg",
    author: "Sarah Johnson",
    date: "2025-01-10",
    category: "Case Studies",
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "Site Office Setup Guide for Construction Projects",
    slug: "site-office-setup-guide",
    excerpt: "Essential tips for establishing efficient temporary offices on construction sites.",
    content: `
      <p>A well-organized site office is crucial for successful project management. Here's your comprehensive guide to setting up an effective temporary workspace.</p>
      
      <h2>Planning Your Site Office</h2>
      <p>Location selection and layout planning are critical first steps in establishing your construction site office.</p>
      
      <h3>Location Considerations</h3>
      <ul>
        <li>Accessibility for staff and visitors</li>
        <li>Proximity to construction activities</li>
        <li>Security and visibility</li>
        <li>Utility connections</li>
      </ul>
      
      <h3>Essential Features</h3>
      <p>Modern site offices should include proper lighting, climate control, secure storage, and reliable connectivity.</p>
      
      <h3>Safety Compliance</h3>
      <p>Ensure your site office meets all local safety regulations and provides adequate emergency exits and fire safety equipment.</p>
      
      <p>Innbox Modular Prefab offers turnkey site office solutions with all necessary features for efficient project management.</p>
    `,
    image: "/src/assets/site-office.jpg",
    author: "Mike Chen",
    date: "2025-01-05",
    category: "Construction Tips",
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Labour Camp Standards: Ensuring Worker Welfare",
    slug: "labour-camp-standards",
    excerpt: "Best practices for providing quality accommodation for construction workforce.",
    content: `
      <p>Providing adequate accommodation for workers is not just a legal requirement—it's a moral obligation that impacts productivity and worker satisfaction.</p>
      
      <h2>Regulatory Compliance</h2>
      <p>Understanding and meeting local labour accommodation standards is essential for any construction project.</p>
      
      <h3>Space Requirements</h3>
      <p>Minimum space per person, proper ventilation, and adequate facilities are fundamental requirements.</p>
      
      <h3>Health and Safety</h3>
      <p>Fire safety measures, sanitation facilities, and emergency protocols must be in place.</p>
      
      <h3>Comfort and Dignity</h3>
      <p>Beyond basic requirements, providing comfortable living conditions demonstrates respect for your workforce and improves retention.</p>
      
      <h2>Innbox Modular Prefab Labour Accommodation Solutions</h2>
      <p>Our labour camps exceed regulatory standards while providing cost-effective, comfortable living spaces for workers.</p>
    `,
    image: "/src/assets/labor-accommodation.jpg",
    author: "Ahmed Hassan",
    date: "2024-12-28",
    category: "Industry News",
    readTime: "5 min read",
  },
  {
    id: "5",
    title: "New Product Launch: Enhanced Security Cabin Range",
    slug: "new-security-cabin-range",
    excerpt: "Introducing our latest line of advanced security cabin solutions.",
    content: `
      <p>We're excited to announce the launch of our enhanced security cabin range, featuring improved visibility, durability, and comfort.</p>
      
      <h2>What's New</h2>
      
      <h3>360-Degree Visibility</h3>
      <p>Upgraded window design provides complete visibility for enhanced security monitoring.</p>
      
      <h3>Climate Control</h3>
      <p>Integrated AC provision ensures comfortable working conditions year-round.</p>
      
      <h3>Smart Features</h3>
      <p>Optional technology integration including CCTV mounts, network connectivity, and access control systems.</p>
      
      <h3>Rapid Deployment</h3>
      <p>Quick-install design allows setup in under 2 hours.</p>
      
      <p>Contact our sales team to learn more about customization options and pricing for our new security cabin range.</p>
    `,
    image: "/src/assets/security-cabin.jpg",
    author: "Lisa Wang",
    date: "2024-12-20",
    category: "Product Updates",
    readTime: "3 min read",
  },
  {
    id: "6",
    title: "Sustainable Construction: Our Environmental Commitment",
    slug: "sustainable-construction-commitment",
    excerpt: "How Innbox Modular Prefab is leading the way in eco-friendly building solutions.",
    content: `
      <p>Sustainability is at the core of everything we do. Learn about our commitment to environmental responsibility in modular construction.</p>
      
      <h2>Our Green Initiatives</h2>
      
      <h3>Material Selection</h3>
      <p>We prioritize recyclable materials and sustainable sourcing in all our products.</p>
      
      <h3>Energy Efficiency</h3>
      <p>Superior insulation and design optimization reduce energy consumption by up to 40%.</p>
      
      <h3>Waste Reduction</h3>
      <p>Factory-controlled production minimizes construction waste compared to traditional building methods.</p>
      
      <h3>Lifecycle Thinking</h3>
      <p>Our buildings are designed for longevity, adaptability, and eventual recyclability.</p>
      
      <h2>Certifications and Standards</h2>
      <p>Innbox Modular Prefab maintains ISO certifications and adheres to international environmental standards.</p>
    `,
    image: "/src/assets/project-5.jpg",
    author: "Emma Brown",
    date: "2024-12-15",
    category: "Industry News",
    readTime: "7 min read",
  },
];

export const getPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getPostsByCategory = (category: string) => {
  if (category === "All") return blogPosts;
  return blogPosts.filter((post) => post.category === category);
};

export const getRelatedPosts = (currentPostId: string, limit = 3) => {
  const currentPost = blogPosts.find((post) => post.id === currentPostId);
  if (!currentPost) return [];
  
  return blogPosts
    .filter((post) => post.id !== currentPostId && post.category === currentPost.category)
    .slice(0, limit);
};
