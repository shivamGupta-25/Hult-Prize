'use client';

import { Separator } from "@/components/ui/separator";
import contactData from "@/Data/Contact";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import { sanitizePhone, formatAddressString, useDeveloperInfo } from "@/lib/contactUtils";
import Link from "next/link";

// Icon mapping for social links
const iconMap = {
  Linkedin,
  Instagram,
};

const Footer = () => {
  const { developerInfo, loading, fallbackName } = useDeveloperInfo();

  const currentYear = new Date().getFullYear();
  const { contactInfo, socialLinks, organization, locationUrl } = contactData || {};
  const { email, phone, address } = contactInfo || {};

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              {organization || "Hult Prize"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering students to develop innovative solutions for social
              impact through entrepreneurship and sustainable practices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blogs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm">
              {email && (
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-muted-foreground hover:text-primary transition-colors break-all"
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <a
                    href={`tel:${sanitizePhone(phone)}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {locationUrl ? (
                    <a
                      href={locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {formatAddressString(address) || address.line1}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">
                      {formatAddressString(address) || address.line1}
                    </span>
                  )}
                </li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = iconMap[social.icon];
                  if (!IconComponent || !social.url) return null;

                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary text-muted-foreground hover:text-primary transition-all duration-200"
                      aria-label={social.platform}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} {organization || "Hult Prize - Hansraj College"}. All
            rights reserved.
          </p>
          {loading ? (
            <p className="text-muted-foreground">Loading developer info...</p>
          ) : (
            <p className="text-muted-foreground text-center sm:text-right">
              Designed & Developed by{" "}
              {developerInfo?.linkedin ? (
                <a
                  href={developerInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold transition-colors"
                >
                  &ldquo;{developerInfo.credit}&rdquo;
                </a>
              ) : (
                <span className="text-primary font-semibold underline">
                  &ldquo;{developerInfo?.credit || fallbackName}&rdquo;
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;