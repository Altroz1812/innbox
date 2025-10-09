// JSON-LD Structured Data generators

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Innbox Modular Prefab",
  "url": "https://innboxprefab.com",
  "logo": "https://innboxprefab.com/innbox-logo.png",
  "description": "Leading manufacturer of quality prefabricated container buildings and modular structures based in Hyderabad, India.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "streetAddress": "Survey No-416, Dundigal Orr Service Road",
    "postalCode": "500043"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-630-216-5600",
    "contactType": "Customer Service",
    "email": "info@innboxmodular.com",
    "availableLanguage": ["English", "Hindi", "Telugu"]
  },
  "sameAs": [
    "https://www.facebook.com/innboxmodularprefab",
    "https://x.com/InnboxP?s=08",
    "https://www.youtube.com/@innboxmodularprefab2"
  ]
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const productSchema = (product: {
  name: string;
  description: string;
  image: string;
  category: string;
  slug: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "brand": {
    "@type": "Brand",
    "name": "Innbox Modular Prefab"
  },
  "category": product.category,
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "priceCurrency": "USD",
      "price": "Contact for Quote"
    }
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Innbox Modular Prefab",
    "url": "https://innboxprefab.com"
  }
});

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Innbox Modular Prefab",
  "image": "https://innboxprefab.com/innbox-logo.png",
  "@id": "https://innboxprefab.com",
  "url": "https://innboxprefab.com",
  "telephone": "+91-630-216-5600",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressLocality": "Hyderabad",
    "addressRegion": "Telangana",
    "streetAddress": "Survey No-416, Dundigal Orr Service Road",
    "postalCode": "500043"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 17.5426,
    "longitude": 78.4011
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "14:00"
    }
  ]
};

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
