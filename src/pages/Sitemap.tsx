import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/products';

const Sitemap = () => {
  const [xml, setXml] = useState('');

  useEffect(() => {
    const generateSitemap = async () => {
      const products = await fetchProducts();
      const baseUrl = 'https://innboxprefab.com';
      const currentDate = new Date().toISOString();

      const staticPages = [
        { loc: '/', priority: '1.0', changefreq: 'daily' },
        { loc: '/about', priority: '0.8', changefreq: 'monthly' },
        { loc: '/products', priority: '0.9', changefreq: 'weekly' },
        { loc: '/projects', priority: '0.8', changefreq: 'weekly' },
        { loc: '/contact', priority: '0.9', changefreq: 'monthly' },
        { loc: '/quality', priority: '0.7', changefreq: 'monthly' },
        { loc: '/blog', priority: '0.7', changefreq: 'weekly' },
      ];

      const productPages = products.map(product => ({
        loc: `/products/${product.category_slug}/${product.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
      }));

      const allPages = [...staticPages, ...productPages];

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      setXml(sitemapXml);
    };

    generateSitemap();
  }, []);

  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', padding: '20px' }}>
      {xml || 'Generating sitemap...'}
    </pre>
  );
};

export default Sitemap;
