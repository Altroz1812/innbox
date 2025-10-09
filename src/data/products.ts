export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  relatedProducts?: string[];
}

export const productCategories = [
  {
    name: "Prefabricated Buildings",
    slug: "prefabricated-buildings",
    subcategories: [
      { name: "Site Offices", slug: "site-offices" },
      { name: "Labour Accommodation", slug: "labour-accommodation" },
      { name: "Hospital Buildings", slug: "hospital-buildings" },
    ],
  },
  {
    name: "Containers",
    slug: "containers",
    subcategories: [
      { name: "Container Houses", slug: "container-houses" },
      { name: "Storage Containers", slug: "storage-containers" },
    ],
  },
  {
    name: "Portable Cabins",
    slug: "portable-cabins",
    subcategories: [],
  },
  {
    name: "Security Solutions",
    slug: "security-solutions",
    subcategories: [
      { name: "Security Cabins", slug: "security-cabins" },
      { name: "Guard Houses", slug: "guard-houses" },
    ],
  },
];

export const products: Product[] = [
  {
    id: "site-office-standard",
    name: "Standard Site Office",
    slug: "standard-site-office",
    category: "Prefabricated Buildings",
    categorySlug: "prefabricated-buildings",
    image: "/src/assets/site-office.jpg",
    shortDescription: "Durable and customizable site offices for construction projects",
    description: "Our standard site offices are designed for construction sites, offering comfortable workspace with excellent insulation and durability. Perfect for project management teams.",
    features: [
      "Weather-resistant exterior",
      "Thermal and sound insulation",
      "Electrical wiring and outlets",
      "Windows with security bars",
      "Quick installation",
      "Customizable interior layout",
    ],
    specifications: [
      { label: "Dimensions", value: "6m x 2.4m x 2.8m" },
      { label: "Material", value: "Steel frame with sandwich panels" },
      { label: "Insulation", value: "50mm EPS/Rockwool" },
      { label: "Floor", value: "18mm plywood with vinyl flooring" },
      { label: "Windows", value: "PVC sliding windows" },
      { label: "Door", value: "Steel security door" },
    ],
    relatedProducts: ["portable-cabin-deluxe", "labour-camp-standard"],
  },
  {
    id: "container-house-modern",
    name: "Modern Container House",
    slug: "modern-container-house",
    category: "Containers",
    categorySlug: "containers",
    image: "/src/assets/container-house.jpg",
    shortDescription: "Contemporary living spaces built from shipping containers",
    description: "Transform shipping containers into modern, eco-friendly homes. Our container houses combine sustainability with contemporary design.",
    features: [
      "Eco-friendly construction",
      "Rapid deployment",
      "Full insulation package",
      "Modern interior finish",
      "Plumbing and electrical ready",
      "Expandable design",
    ],
    specifications: [
      { label: "Dimensions", value: "12m x 3m x 2.8m" },
      { label: "Container Type", value: "40ft High Cube" },
      { label: "Insulation", value: "75mm spray foam" },
      { label: "Interior", value: "Gypsum board with paint" },
      { label: "Flooring", value: "Laminate flooring" },
      { label: "Windows", value: "Double glazed aluminum" },
    ],
    relatedProducts: ["site-office-standard", "portable-cabin-deluxe"],
  },
  {
    id: "portable-cabin-deluxe",
    name: "Deluxe Portable Cabin",
    slug: "deluxe-portable-cabin",
    category: "Portable Cabins",
    categorySlug: "portable-cabins",
    image: "/src/assets/portable-cabin.jpg",
    shortDescription: "Premium portable cabins for temporary or permanent use",
    description: "High-quality portable cabins suitable for offices, accommodation, or storage. Easy to transport and install anywhere.",
    features: [
      "Lightweight structure",
      "Easy transportation",
      "Weather-proof design",
      "Multiple size options",
      "Quick assembly",
      "Low maintenance",
    ],
    specifications: [
      { label: "Dimensions", value: "3m x 2.4m x 2.6m" },
      { label: "Frame", value: "Galvanized steel" },
      { label: "Walls", value: "50mm sandwich panel" },
      { label: "Weight", value: "Approx. 1200kg" },
      { label: "Capacity", value: "Up to 4 persons" },
      { label: "Setup Time", value: "4-6 hours" },
    ],
    relatedProducts: ["site-office-standard", "security-cabin-basic"],
  },
  {
    id: "labour-camp-standard",
    name: "Labour Accommodation Unit",
    slug: "labour-accommodation",
    category: "Prefabricated Buildings",
    categorySlug: "prefabricated-buildings",
    image: "/src/assets/labor-accommodation.jpg",
    shortDescription: "Comfortable accommodation units for workforce housing",
    description: "Provide comfortable living quarters for your workforce with our labour accommodation units. Designed for durability and comfort.",
    features: [
      "Multiple bed configurations",
      "Attached bathroom facilities",
      "Air conditioning ready",
      "Fire safety compliance",
      "Ventilation system",
      "Privacy partitions",
    ],
    specifications: [
      { label: "Dimensions", value: "9m x 3m x 2.8m" },
      { label: "Capacity", value: "6-8 persons" },
      { label: "Beds", value: "Bunk beds with mattresses" },
      { label: "Bathroom", value: "Attached WC and shower" },
      { label: "Storage", value: "Individual lockers" },
      { label: "Compliance", value: "Labour law standards" },
    ],
    relatedProducts: ["site-office-standard", "portable-cabin-deluxe"],
  },
  {
    id: "security-cabin-basic",
    name: "Security Guard Cabin",
    slug: "security-cabin",
    category: "Security Solutions",
    categorySlug: "security-solutions",
    image: "/src/assets/security-cabin.jpg",
    shortDescription: "Compact security cabins for entrance gates and checkpoints",
    description: "Essential security infrastructure for access control. Compact design with excellent visibility and weather protection.",
    features: [
      "360-degree visibility",
      "Compact footprint",
      "Weather-resistant",
      "Electrical fittings",
      "Lockable storage",
      "Easy relocation",
    ],
    specifications: [
      { label: "Dimensions", value: "2m x 2m x 2.4m" },
      { label: "Material", value: "Steel frame with panels" },
      { label: "Windows", value: "Sliding glass on 3 sides" },
      { label: "Door", value: "Single steel door" },
      { label: "Lighting", value: "LED ceiling light" },
      { label: "Weight", value: "Approx. 600kg" },
    ],
    relatedProducts: ["portable-cabin-deluxe"],
  },
  {
    id: "hospital-building",
    name: "Modular Hospital Building",
    slug: "hospital-building",
    category: "Prefabricated Buildings",
    categorySlug: "prefabricated-buildings",
    image: "/src/assets/project-4.jpg",
    shortDescription: "Medical-grade prefabricated healthcare facilities",
    description: "Purpose-built modular healthcare facilities meeting medical standards. Ideal for clinics, testing centers, and temporary hospitals.",
    features: [
      "Medical-grade materials",
      "Hygienic wall finishes",
      "Integrated ventilation",
      "Partition flexibility",
      "Electrical & plumbing ready",
      "Easy sanitization",
    ],
    specifications: [
      { label: "Dimensions", value: "12m x 6m x 3m" },
      { label: "Walls", value: "Antibacterial panels" },
      { label: "Flooring", value: "Medical-grade vinyl" },
      { label: "Ceiling", value: "Washable ceiling panels" },
      { label: "Compliance", value: "Healthcare standards" },
      { label: "HVAC", value: "Central AC provision" },
    ],
    relatedProducts: ["site-office-standard"],
  },
];

export const getProductsByCategory = (categorySlug: string) => {
  return products.filter((product) => product.categorySlug === categorySlug);
};

export const getProductBySlug = (slug: string) => {
  return products.find((product) => product.slug === slug);
};

export const getRelatedProducts = (productId: string) => {
  const product = products.find((p) => p.id === productId);
  if (!product?.relatedProducts) return [];
  return products.filter((p) => product.relatedProducts?.includes(p.id));
};
