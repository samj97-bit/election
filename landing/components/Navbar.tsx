"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Candidates", href: "#candidates" },
  { label: "Features", href: "#features" },
  { label: "Modules", href: "#modules" },
  { label: "Timeline", href: "#timeline" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (label: string, href: string) => {
    setActiveLink(label);
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(3,7,18,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={() => handleNavClick("Home", "#home")}
              className="flex items-center gap-2.5 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center glow-primary"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-white text-sm leading-tight block">
                  College Election
                </span>
                <span className="text-xs text-slate-400 leading-tight block">
                  Management System
                </span>
              </div>
            </motion.a>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.label, link.href)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer ${
                    activeLink === link.label
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                  aria-current={activeLink === link.label ? "page" : undefined}
                >
                  {link.label}
                  {activeLink === link.label && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)" }}
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 text-sm font-medium text-slate-300 rounded-lg border transition-all duration-200 hover:text-white hover:border-slate-500 cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/get-started">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(37,99,235,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2 text-sm font-semibold text-white rounded-lg cursor-pointer transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                  aria-label="Get started with College Election Management System"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden overflow-hidden bg-[#030712]/95 backdrop-blur-2xl border-t border-white/5"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col h-[calc(100vh-4rem)] px-6 py-8 overflow-y-auto">
              <motion.div 
                className="flex flex-col gap-2 flex-1"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.05 } },
                  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                }}
              >
                {navLinks.map((link) => (
                  <motion.button
                    key={link.label}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: 20 }
                    }}
                    onClick={() => handleNavClick(link.label, link.href)}
                    className="w-full text-left px-4 py-4 text-xl font-bold rounded-xl transition-all"
                    style={{ 
                      color: activeLink === link.label ? "#fff" : "rgba(148, 163, 184, 0.8)",
                      background: activeLink === link.label ? "rgba(37,99,235,0.15)" : "transparent",
                      borderLeft: activeLink === link.label ? "4px solid #2563eb" : "4px solid transparent"
                    }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </motion.div>
              <motion.div 
                className="flex flex-col gap-3 pb-8 pt-4 mt-auto border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-3.5 rounded-xl text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/get-started" onClick={() => setMobileOpen(false)} className="w-full">
                  <button className="w-full py-3.5 rounded-xl text-base font-semibold text-white cursor-pointer shadow-lg shadow-blue-500/20" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
                    Get Started Free
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
