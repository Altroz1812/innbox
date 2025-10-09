import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object;
  canonical?: string;
}

const SEO = ({
  title = 'Innbox Modular Prefab - Premium Prefabricated Buildings & Modular Construction',
  description = 'Leading manufacturer of quality prefabricated container buildings, modular structures, portable cabins, and container houses based in Hyderabad, India.',
  keywords = 'prefabricated buildings, modular construction, container houses, portable cabins, site offices, prefab structures, India manufacturer, Hyderabad',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  structuredData,
  canonical,
}: SEOProps) => {
  const siteUrl = 'https://innboxprefab.com';
  const fullTitle = title.includes('Innbox') ? title : `${title} | Innbox Modular Prefab`;
  const canonicalUrl = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Innbox Modular Prefab" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Innbox Modular Prefab" />
      
      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#1a1a1a" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
