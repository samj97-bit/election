"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  GitBranch,
  Globe,
  Share2,
  Mail,
  ExternalLink,
} from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "Timeline", href: "#timeline" },
    { label: "Dashboard", href: "#" },
    { label: "Analytics", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR Compliance", href: "#" },
  ],
  Support: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status Page", href: "#" },
    { label: "Contact Support", href: "#contact" },
  ],
};

const socialLinks = [
  { icon: GitBranch, label: "GitHub", href: "#", color: "#94a3b8" },
  { icon: Globe, label: "Twitter / X", href: "#", color: "#1d9bf0" },
  { icon: Share2, label: "LinkedIn", href: "#", color: "#0a66c2" },
  { icon: Mail, label: "Email", href: "mailto:support@cems.io", color: "#22c55e" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.3), rgba(124,58,237,0.3), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block leading-tight">
                  College Election
                </span>
                <span className="text-xs text-slate-500 block">Management System</span>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
              A secure, AI-powered SaaS platform for managing college elections,
              organizing campaigns, and analyzing electoral data in real-time.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <s.icon className="w-4 h-4 text-slate-400" />
                </motion.a>
              ))}
            </div>

            {/* Version badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs text-slate-500"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Version 2.1.0 · Stable
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs text-slate-600">
            © {currentYear} College Election Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <span aria-hidden="true">·</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookies</a>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
