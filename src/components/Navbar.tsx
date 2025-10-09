import { Menu, X, Mail, Phone, Facebook, Instagram, Linkedin, ChevronDown, User, LogOut } from "lucide-react";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import innboxLogo from "@/assets/innbox-logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { productCategories } from "@/data/products";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const menuItemsBeforeProducts = [
    { label: "HOME", href: "/" },
    { label: "CORPORATE", href: "/about" },
  ];

  const menuItemsAfterProducts = [
    { label: "REFERENCES", href: "/projects" },
    { label: "QUALITY", href: "/quality" },
    { label: "BLOG", href: "/blog" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-background border-b hidden md:block">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-12 items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="mailto:info@innboxmodular.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@innboxmodular.com</span>
              </a>
              <a href="tel:+916302165600" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>+91 630-216-5600</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/innboxmodularprefab" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://x.com/InnboxP?s=08" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a href="https://www.youtube.com/@innboxmodularprefab2" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <FaYoutube className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center gap-8">
            <Link to="/" className="flex items-center text-primary-foreground">
              <img src={innboxLogo} alt="Innbox Modular Prefab" className="h-12 w-auto" />
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-6">
              {menuItemsBeforeProducts.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors rounded"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors rounded">
                    PRODUCTS
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-popover z-[100]">
                    <DropdownMenuLabel>Product Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {productCategories.map((category) => (
                      <div key={category.slug}>
                        <DropdownMenuItem asChild>
                          <Link to={`/products/${category.slug}`} className="font-medium">
                            {category.name}
                          </Link>
                        </DropdownMenuItem>
                        {category.subcategories.length > 0 && (
                          <div className="ml-4">
                            {category.subcategories.map((sub) => (
                              <DropdownMenuItem asChild key={sub.slug}>
                                <Link to={`/products/${category.slug}`} className="text-sm text-muted-foreground">
                                  {sub.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/products" className="font-medium text-primary">
                        View All Products
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              {menuItemsAfterProducts.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors rounded"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Section - Pushed to Right */}
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <Button size="sm" variant="secondary" className="bg-background text-primary hover:bg-background/90">
                CALL ME BACK
              </Button>
              {user ? (
                <>
                  {isAdmin && (
                    <Button size="sm" variant="secondary" asChild className="bg-background text-primary hover:bg-background/90">
                      <Link to="/admin">
                        <User className="h-4 w-4 mr-2" />
                        ADMIN PANEL
                      </Link>
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => signOut()} className="bg-background text-primary hover:bg-background/90">
                    <LogOut className="h-4 w-4 mr-2" />
                    SIGN OUT
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="secondary" asChild className="bg-background text-primary hover:bg-background/90">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    LOGIN
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-primary-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-primary-foreground/20">
              <ul className="flex flex-col gap-2">
                {[...menuItemsBeforeProducts, ...menuItemsAfterProducts].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="block py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 px-4 rounded transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <div className="px-4 py-2">
                    <Link to="/products" className="block text-sm font-medium text-primary-foreground">
                      PRODUCTS
                    </Link>
                    <div className="ml-4 mt-2 space-y-1">
                      {productCategories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/products/${category.slug}`}
                          className="block py-1 text-xs text-primary-foreground/80 hover:text-primary-foreground"
                          onClick={() => {
                            setIsOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
                <li className="px-4 pt-2">
                  <Button size="sm" variant="secondary" className="w-full bg-background text-primary hover:bg-background/90">
                    CALL ME BACK
                  </Button>
                </li>
                {user ? (
                  <>
                    {isAdmin && (
                      <li className="px-4 pt-2">
                        <Button size="sm" variant="secondary" asChild className="w-full bg-background text-primary hover:bg-background/90" onClick={() => setIsOpen(false)}>
                          <Link to="/admin">
                            <User className="h-4 w-4 mr-2" />
                            ADMIN PANEL
                          </Link>
                        </Button>
                      </li>
                    )}
                    <li className="px-4 pt-2">
                      <Button size="sm" variant="secondary" onClick={() => { signOut(); setIsOpen(false); }} className="w-full bg-background text-primary hover:bg-background/90">
                        <LogOut className="h-4 w-4 mr-2" />
                        SIGN OUT
                      </Button>
                    </li>
                  </>
                ) : (
                  <li className="px-4 pt-2">
                    <Button size="sm" variant="secondary" asChild className="w-full bg-background text-primary hover:bg-background/90" onClick={() => setIsOpen(false)}>
                      <Link to="/auth">
                        <User className="h-4 w-4 mr-2" />
                        LOGIN
                      </Link>
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
