import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Image, Mail, FileText, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Stat {
  current: number;
  previous: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    projects: 0,
    inquiries: 0,
    quotes: 0,
  });
  const [trends, setTrends] = useState<{ [key: string]: number }>({});
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    // Calculate date ranges
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch current counts
    const [productsRes, projectsRes, inquiriesRes, quotesRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('project_images').select('id', { count: 'exact', head: true }),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }),
      supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      products: productsRes.count || 0,
      projects: projectsRes.count || 0,
      inquiries: inquiriesRes.count || 0,
      quotes: quotesRes.count || 0,
    });

    // Fetch trends (last 7 days vs previous 7 days)
    const [inquiriesLastWeek, inquiriesPrevWeek, quotesLastWeek, quotesPrevWeek] = await Promise.all([
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).gte('created_at', fourteenDaysAgo.toISOString()).lt('created_at', sevenDaysAgo.toISOString()),
      supabase.from('quote_requests').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('quote_requests').select('id', { count: 'exact', head: true }).gte('created_at', fourteenDaysAgo.toISOString()).lt('created_at', sevenDaysAgo.toISOString()),
    ]);

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    setTrends({
      inquiries: calculateTrend(inquiriesLastWeek.count || 0, inquiriesPrevWeek.count || 0),
      quotes: calculateTrend(quotesLastWeek.count || 0, quotesPrevWeek.count || 0),
    });

    // Fetch recent submissions
    const [recentInqData, recentQuotesData] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('quote_requests').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    setRecentInquiries(recentInqData.data || []);
    setRecentQuotes(recentQuotesData.data || []);

    // Fetch top viewed products
    const { data: viewsData } = await supabase
      .from('product_views')
      .select('product_id, products(id, name)')
      .gte('viewed_at', sevenDaysAgo.toISOString());

    if (viewsData) {
      const productViewCounts = viewsData.reduce((acc: any, view: any) => {
        const productId = view.product_id;
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
      }, {});

      const topProductsArray = Object.entries(productViewCounts)
        .map(([id, count]) => {
          const product = viewsData.find((v: any) => v.product_id === id)?.products;
          return { id, name: product?.name || 'Unknown', views: count };
        })
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 5);

      setTopProducts(topProductsArray);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending':
        return 'bg-blue-500';
      case 'contacted':
      case 'quoted':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-gray-500';
      case 'converted':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    if (value === 0) return null;
    const isPositive = value > 0;
    return (
      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products}</div>
                <p className="text-xs text-muted-foreground">Total products</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/gallery">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.projects}</div>
                <p className="text-xs text-muted-foreground">Gallery images</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/inquiries">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stats.inquiries}</div>
                  <TrendIndicator value={trends.inquiries} />
                </div>
                <p className="text-xs text-muted-foreground">Contact submissions</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/quotes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quotes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{stats.quotes}</div>
                  <TrendIndicator value={trends.quotes} />
                </div>
                <p className="text-xs text-muted-foreground">Quote requests</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Top Viewed Products */}
        {topProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Most Viewed Products (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topProducts.map((product: any, index) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-muted-foreground w-6">{index + 1}</div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                    <Badge variant="secondary">{product.views} views</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Inquiries & Quotes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Inquiries</CardTitle>
              <Link to="/admin/inquiries?status=new">
                <Button size="sm" variant="outline">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentInquiries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No inquiries yet</p>
              ) : (
                <div className="space-y-3">
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-start justify-between gap-4 pb-3 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{inquiry.email}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.inquiry_type}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quote Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Quote Requests</CardTitle>
              <Link to="/admin/quotes?status=pending">
                <Button size="sm" variant="outline">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentQuotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No quote requests yet</p>
              ) : (
                <div className="space-y-3">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-start justify-between gap-4 pb-3 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{quote.contact_name}</p>
                        <p className="text-sm text-muted-foreground truncate">{quote.email}</p>
                        <p className="text-xs text-muted-foreground">{quote.product_interest || 'General inquiry'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/inquiries?status=new" className="block">
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  View New Inquiries
                </Button>
              </Link>
              <Link to="/admin/quotes?status=pending" className="block">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Pending Quotes
                </Button>
              </Link>
              <Link to="/admin/products" className="block">
                <Button variant="outline" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
              <Link to="/admin/gallery" className="block">
                <Button variant="outline" className="w-full">
                  <Image className="mr-2 h-4 w-4" />
                  Upload Images
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
