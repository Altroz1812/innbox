import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Skeleton } from "@/components/ui/skeleton";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Quality from "./pages/Quality";
import Auth from "./pages/Auth";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";

// Lazy load admin pages (code splitting)
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminInquiries = lazy(() => import("./pages/admin/Inquiries"));
const AdminQuotes = lazy(() => import("./pages/admin/Quotes"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute default
    },
  },
});

// Loading fallback for lazy loaded components
const AdminLoading = () => (
  <div className="min-h-screen p-8">
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:slug" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sitemap.xml" element={<Sitemap />} />
          
          {/* Admin Routes - Lazy Loaded */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<AdminLoading />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<AdminLoading />}>
                <AdminProducts />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery" element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<AdminLoading />}>
                <AdminGallery />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/admin/inquiries" element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<AdminLoading />}>
                <AdminInquiries />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/admin/quotes" element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<AdminLoading />}>
                <AdminQuotes />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<AdminLoading />}>
                <AdminSettings />
              </Suspense>
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
