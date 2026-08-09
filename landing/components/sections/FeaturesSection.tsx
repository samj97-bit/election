"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Database,
  HeartHandshake,
  Users,
  MessageSquare,
  BarChart3,
  FileText,
  ShieldCheck,
  Lock,
  Search,
  LayoutDashboard,
  Bell,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Student Database",
    description:
      "Centralized student records with department-wise segmentation, search, and real-time synchronization across all modules.",
    color: "#2563eb",
  },
  {
    icon: HeartHandshake,
    title: "Volunteer Management",
    description:
      "Assign, track, and communicate with volunteers. Monitor engagement, tasks, and coverage across campus zones.",
    color: "#7c3aed",
  },
  {
    icon: Users,
    title: "Core Team Management",
    description:
      "Organize campaign leadership with role-based access, hierarchical team structure, and activity tracking.",
    color: "#06b6d4",
  },
  {
    icon: MessageSquare,
    title: "Survey Collection",
    description:
      "Build and distribute surveys with custom forms. Collect responses, track completion rates, and analyze sentiment.",
    color: "#22c55e",
  },
  {
    icon: BarChart3,
    title: "Election Analytics",
    description:
      "Real-time dashboards with department coverage maps, vote trend predictions, and comparative party analysis.",
    color: "#f59e0b",
  },
  {
    icon: FileText,
    title: "Smart Reports",
    description:
      "Auto-generated PDF and Excel reports with campaign summary, volunteer stats, and election outcome insights.",
    color: "#ec4899",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Auth",
    description:
      "Granular permission system for admin, party leads, volunteers, and viewers. Secure access at every level.",
    color: "#ef4444",
  },
  {
    icon: Lock,
    title: "Data Security",
    description:
      "End-to-end encryption, secure JWT tokens, automatic backups, and GDPR-compliant data handling.",
    color: "#8b5cf6",
  },
  {
    icon: Search,
    title: "Fast Search",
    description:
      "Instant full-text search across student records, volunteers, and survey responses with smart filtering.",
    color: "#14b8a6",
  },
  {
    icon: LayoutDashboard,
    title: "Real-Time Dashboard",
    description:
      "Live-updating metrics, interactive charts, and heatmaps powered by WebSocket connections.",
    color: "#f97316",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Push notifications, in-app alerts, and email digests for critical election events and milestones.",
    color: "#a855f7",
  },
  {
    icon: Download,
    title: "Export Reports",
    description:
      "One-click export to PDF, Excel, and CSV. Scheduled report delivery directly to your inbox.",
    color: "#10b981",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      className="py-24 relative"
      aria-label="Platform features"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}
          >
            Features
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything You Need to{" "}
            <span className="gradient-text">Run an Election</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A complete toolkit for managing every aspect of your college election,
            from registration to results.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl p-5 border overflow-hidden cursor-default"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
              aria-label={`Feature: ${feature.title}`}
            >
              {/* Hover background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at top left, ${feature.color}12 0%, transparent 60%)`,
                }}
              />

              {/* Hover border */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: `1px solid ${feature.color}00` }}
                whileHover={{ border: `1px solid ${feature.color}40` }}
                transition={{ duration: 0.3 }}
              />

              {/* Icon */}
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${feature.color}18`,
                  border: `1px solid ${feature.color}30`,
                }}
              >
                <feature.icon className="w-5 h-5 transition-colors duration-300" style={{ color: feature.color }} />
              </div>

              {/* Content */}
              <h3 className="relative text-sm font-semibold text-white mb-2">{feature.title}</h3>
              <p className="relative text-xs text-slate-500 leading-relaxed">{feature.description}</p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)` }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
