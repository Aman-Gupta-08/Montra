import { Link } from 'react-router-dom';
import { MontraLogo } from '../common/Logo';
import { Code2, MessageSquare, Users, Mail } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#' },
    { label: 'Security', href: '#security' },
    { label: 'Roadmap', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Licenses', href: '#' },
  ],
};

const socials = [
  { icon: MessageSquare, label: 'Twitter', href: '#' },
  { icon: Code2, label: 'GitHub', href: '#' },
  { icon: Users, label: 'LinkedIn', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@montra.app' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleAnchorClick = (href) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <MontraLogo size="md" />
            <p className="mt-4 text-sm text-secondary-text leading-relaxed max-w-xs">
              Smart money management for students, employees, and business owners.
              Take control of your finances today.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-secondary-text hover:text-primary-text dark:hover:text-white hover:bg-lavender dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-primary-text dark:text-white mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          handleAnchorClick(link.href);
                        }
                      }}
                      className="text-sm text-secondary-text hover:text-primary-text dark:hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-text">
            © {currentYear} Montra. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-secondary-text">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for better financial health</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
