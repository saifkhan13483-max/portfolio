import { Link } from "wouter";
import { Twitter, Linkedin, Github, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { LOGO_DARK } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[hsl(var(--footer))] pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link href="/">
              <div className="mb-6 cursor-pointer">
                <img src={LOGO_DARK} alt="SaifCraft Logo" className="h-9 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-white/75 text-sm leading-relaxed mb-6">
              Saif Khan is a senior fullstack developer & AI specialist who helps startups and businesses build fast, custom web apps that solve real problems.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/saifcraft_dev" target="_blank" rel="noopener noreferrer" className="text-white/65 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/saifcraft-dev/" target="_blank" rel="noopener noreferrer" className="text-white/65 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/saifcraft-dev" target="_blank" rel="noopener noreferrer" className="text-white/65 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/services" className="hover:text-white transition-colors">Landing Page — from $800</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Business Website — from $2,000</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Custom Web App — from $3,500</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">AI Features — from $1,200</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Monthly Retainer — from $550/mo</Link></li>
            </ul>
          </div>

          {/* Navigate Column */}
          <div>
            <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition-colors">Our Work</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Services & Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Share Your Idea</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contact@saifcraft.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <SiWhatsapp className="w-4 h-4 text-primary shrink-0" />
                <a href="https://wa.me/923188055850" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +92 318 8055850
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Multan, Punjab, Pakistan — Remote Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/55">
          <p>&copy; {currentYear} Saif Khan / SaifCraft. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
