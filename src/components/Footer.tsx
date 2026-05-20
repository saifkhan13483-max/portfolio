import { Link } from "wouter";
import { Twitter, Linkedin, Github, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useDarkMode } from "@/hooks/use-dark-mode";

const logoLight = "/logo-light.png";
const logoDark = "/logo-dark.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const isDark = useDarkMode();

  return (
    <footer className="bg-[hsl(var(--footer))] pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <Link href="/">
              <div className="mb-6 cursor-pointer">
                <img src={logoDark} alt="SaifCraft Logo" className="h-9 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-white/75 text-sm leading-relaxed mb-6">
              Hi, I'm Saif Khan — a freelance fullstack developer. I help startups and businesses build fast, custom web apps that solve real problems.
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

          <div>
            <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/services"><span className="hover:text-white transition-colors cursor-pointer">Landing Page — from $250</span></Link></li>
              <li><Link href="/services"><span className="hover:text-white transition-colors cursor-pointer">Business Website — from $700</span></Link></li>
              <li><Link href="/services"><span className="hover:text-white transition-colors cursor-pointer">Custom Web App — from $2,500</span></Link></li>
              <li><Link href="/services"><span className="hover:text-white transition-colors cursor-pointer">AI Features — from $600</span></Link></li>
              <li><Link href="/services"><span className="hover:text-white transition-colors cursor-pointer">Monthly Retainer — from $250/mo</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link href="/about"><span className="hover:text-white transition-colors cursor-pointer">About Me</span></Link></li>
              <li><Link href="/portfolio"><span className="hover:text-white transition-colors cursor-pointer">My Work</span></Link></li>
              <li><Link href="/services"><span className="hover:text-white transition-colors cursor-pointer">Services & Pricing</span></Link></li>
              <li><Link href="/faq"><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-white transition-colors cursor-pointer">Hire Me</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contact@saifcraft.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <SiWhatsapp className="w-4 h-4 text-primary shrink-0" />
                <a href="https://wa.me/923188055850" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+92 318 8055850</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Multan, Punjab, Pakistan — Remote Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/55">
          <p>&copy; {currentYear} Saif Khan / SaifCraft. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/faq"><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></Link>
            <Link href="/privacy-policy"><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></Link>
            <Link href="/terms-of-service"><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
