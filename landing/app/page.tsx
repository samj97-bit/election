import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ModulesSection from "@/components/sections/ModulesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import DashboardPreviewSection from "@/components/sections/DashboardPreviewSection";
import SecuritySection from "@/components/sections/SecuritySection";
import TimelineSection from "@/components/sections/TimelineSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/FooterSection";
import ElectedCandidatesSection from "@/components/sections/ElectedCandidatesSection";

export const metadata: Metadata = {
  title: "College Election Management System – AI-Powered Campus Elections",
  description:
    "A secure and intelligent SaaS platform for managing college elections, organizing campaign teams, collecting survey responses, and analyzing campaign progress through interactive dashboards.",
  keywords: [
    "college election management",
    "campus election system",
    "student election software",
    "election analytics platform",
    "volunteer management system",
    "survey collection tool",
    "campus campaign manager",
    "election dashboard",
  ],
  openGraph: {
    title: "College Election Management System – AI-Powered Campus Elections",
    description:
      "Manage your entire college election lifecycle — from party registration to real-time analytics — in one secure, AI-powered platform.",
    type: "website",
    siteName: "College Election Management System",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Election Management System",
    description:
      "AI-Powered platform for managing college elections with real-time analytics, volunteer management, and campaign tools.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-white"
        style={{ background: "#2563eb" }}
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <HeroSection />

        {/* Section separator */}
        <div className="section-divider" aria-hidden="true" />

        <StatsSection />

        <div className="section-divider" aria-hidden="true" />

        <ElectedCandidatesSection />

        <div className="section-divider" aria-hidden="true" />

        <FeaturesSection />

        <div className="section-divider" aria-hidden="true" />

        <ModulesSection />

        <div className="section-divider" aria-hidden="true" />

        <HowItWorksSection />

        <div className="section-divider" aria-hidden="true" />

        <DashboardPreviewSection />

        <div className="section-divider" aria-hidden="true" />

        <SecuritySection />

        <div className="section-divider" aria-hidden="true" />

        <TimelineSection />

        <div className="section-divider" aria-hidden="true" />

        <TestimonialsSection />

        <div className="section-divider" aria-hidden="true" />

        <FAQSection />

        <CTASection />
      </main>

      <Footer />
    </>
  );
}
