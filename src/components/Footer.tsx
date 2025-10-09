import { Building2, Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";
import { FaXTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa6";

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
              <span className="text-xl font-bold">INNBOX MODULAR PREFAB</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              Leading manufacturer of quality prefabricated container buildings and modular structures 
              based in Hyderabad, India.
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
                  Survey No-416, Dundigal Orr Service Road, Hyderabad-500043, Telangana, India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="tel:+916302165600" className="text-primary-foreground/80 hover:text-primary text-sm">
                  +91 630-216-5600
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <a href="mailto:info@innboxmodular.com" className="text-primary-foreground/80 hover:text-primary text-sm">
                  info@innboxmodular.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp className="h-5 w-5 flex-shrink-0 text-primary" />
                <a 
                  href="https://wa.me/916302165600?text=Hello%20Innbox%20Modular%20Prefab%2C%20I%20would%20like%20to%20inquire%20about%20your%20products" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary text-sm"
                >
                  WhatsApp
                </a>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              <a
                href="https://www.facebook.com/innboxmodularprefab"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/InnboxP?s=08"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Twitter/X"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@innboxmodularprefab2"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="YouTube"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-foreground/10 hover:bg-primary p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            &copy; {currentYear} Innbox Modular Prefab. All rights reserved. | Quality prefabricated solutions from Hyderabad, India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
