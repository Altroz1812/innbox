import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Innbox Modular Prefab</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              Leading manufacturer of quality prefabricated container buildings and modular structures 
              with 18 years of experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Corporate", "Products", "References", "Quality", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-primary-foreground/80 hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Products</h3>
            <ul className="space-y-2">
              {["Containers", "Prefabricated Buildings", "Cabins", "Container Houses", "Prefab Villas", "Steel Structures"].map((product) => (
                <li key={product}>
                  <a
                    href="#products"
                    className="text-primary-foreground/80 hover:text-primary transition-colors text-sm"
                  >
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-primary-foreground/80 text-sm">
                  Industrial Zone, Manufacturing District, Turkey
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="tel:+905302451198" className="text-primary-foreground/80 hover:text-primary text-sm">
                  +90 530 245 11 98
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="mailto:info@Innbox Modular innboxprefab.com" className="text-primary-foreground/80 hover:text-primary text-sm">
                  info@Innbox Modular innboxprefab.com
                </a>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="bg-primary-foreground/10 hover:bg-primary p-2 rounded-lg transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            &copy; {currentYear} Innbox Modular Prefab. All rights reserved. | Exported to 95+ countries worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
