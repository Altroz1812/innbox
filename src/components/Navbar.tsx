import { Building2, Menu, X, Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "HOME", href: "#home" },
    { label: "CORPORATE", href: "#about" },
    { label: "PRODUCTS", href: "#products" },
    { label: "REFERENCES", href: "#projects" },
    { label: "QUALITY", href: "#quality" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-background border-b hidden md:block">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-12 items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="mailto:info@Innbox Modular https://www.innboxprefab.com/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@Innbox Modular https://www.innboxprefab.com/</span>
              </a>
              <a href="tel:+905302451198" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>+90 530 245 11 98</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
           <a href="#home" className="flex items-center gap-2 text-xl font-bold text-primary-foreground">
            <img
              src="/logo.jpeg"
              alt="Innbox Modular Prefab Logo"
              className="h-14 w-auto object-contain"
            />
            {/* <span className="hidden sm:inline">Innbox Modular Prefab</span> */}
          </a>



            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors rounded"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="ml-2">
                <Button size="sm" variant="secondary" className="bg-background text-primary hover:bg-background/90">
                  CALL ME BACK
                </Button>
              </li>
            </ul>

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
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block py-2 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 px-4 rounded transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="px-4 pt-2">
                  <Button size="sm" variant="secondary" className="w-full bg-background text-primary hover:bg-background/90">
                    CALL ME BACK
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
