import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Image, Mail, FileText, Settings, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Inquiries', href: '/admin/inquiries', icon: Mail },
    { name: 'Quotes', href: '/admin/quotes', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex bg-muted/10">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col gap-4 border-r bg-card p-6">
        <div className="flex items-center gap-2 font-semibold mb-4">
          <span className="text-xl">Admin Console</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <NavLinks />
        </nav>
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between border-b bg-card p-4">
          <span className="font-semibold">Max Prefabs Admin</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
