"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Globe,
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Brain,
  FileText,
  Settings,
  ChevronDown,
} from "lucide-react";

const modules = [
  {
    id: "landing",
    icon: Globe,
    title: "Landing Website",
    description: "Public-facing campaign portal and voter information hub",
    color: "#2563eb",
    badge: "Public",
  },
  {
    id: "party",
    icon: LayoutDashboard,
    title: "Party Dashboard",
    description: "Campaign management, team coordination, and progress tracking",
    color: "#7c3aed",
    badge: "Party",
  },
  {
    id: "volunteer",
    icon: Users,
    title: "Volunteer Portal",
    description: "Task assignment, attendance tracking, and communication tools",
    color: "#06b6d4",
    badge: "Field",
  },
  {
    id: "survey",
    icon: MessageSquare,
    title: "Survey Collection",
    description: "Custom forms, response analytics, and sentiment analysis",
    color: "#22c55e",
    badge: "Data",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics Engine",
    description: "Real-time dashboards, heatmaps, and comparative analysis",
    color: "#f59e0b",
    badge: "Analytics",
  },
  {
    id: "prediction",
    icon: Brain,
    title: "Prediction Engine",
    description: "AI-powered vote predictions based on survey and engagement data",
    color: "#ec4899",
    badge: "AI",
  },
  {
    id: "reports",
    icon: FileText,
    title: "Reports",
    description: "Auto-generated insights, summaries, and exportable documents",
    color: "#14b8a6",
    badge: "Export",
  },
  {
    id: "admin",
    icon: Settings,
    title: "Administration",
    description: "System config, user roles, security settings, and audit logs",
    color: "#94a3b8",
    badge: "Admin",
  },
];

export default function ModulesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="modules"
      className="py-24 relative"
      aria-label="Platform modules"
      ref={ref}
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #2563eb, transparent)" }}
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
            style={{ background: "rgba(6,182,212,0.1)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.25)" }}
          >
            Platform Architecture
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            One Platform,{" "}
            <span className="gradient-text">Eight Powerful Modules</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Interconnected modules that work seamlessly together to power every
            aspect of your college election campaign.
          </p>
        </motion.div>

        {/* Module Flow — Two column layout on large, stacked on mobile */}
        <div className="flex flex-col items-center gap-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
          {/* Left column */}
          <div className="flex flex-col items-center gap-0 w-full max-w-xs">
            {modules.slice(0, 4).map((mod, i) => (
              <div key={mod.id} className="flex flex-col items-center w-full">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  className="w-full group relative rounded-2xl p-4 border cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at left center, ${mod.color}12, transparent 70%)` }}
                  />
                  <div className="flex items-center gap-3 relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${mod.color}18`, border: `1px solid ${mod.color}30` }}
                    >
                      <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">{mod.title}</span>
                        <span
                          className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                          style={{ background: `${mod.color}20`, color: mod.color }}
                        >
                          {mod.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">{mod.description}</p>
                    </div>
                  </div>
                </motion.div>
                {i < 3 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                    className="flex flex-col items-center py-1"
                  >
                    <div className="w-px h-4" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(37,99,235,0.4))" }} />
                    <ChevronDown className="w-4 h-4 text-blue-500 opacity-60" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Center: Connecting Visual */}
          <div className="hidden lg:flex flex-col items-center justify-center h-full py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative"
            >
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(124,58,237,0.15) 50%, transparent 70%)",
                  border: "1px solid rgba(37,99,235,0.3)",
                  boxShadow: "0 0 40px rgba(37,99,235,0.2)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(124,58,237,0.2) 100%)",
                    border: "1px solid rgba(124,58,237,0.4)",
                  }}
                >
                  <span className="text-2xl font-bold gradient-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    CE
                  </span>
                </div>
              </div>
              {/* Orbiting dots */}
              {[0, 120, 240].map((deg, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div
                    className="absolute w-2.5 h-2.5 rounded-full"
                    style={{
                      top: "-5px",
                      background: ["#2563eb", "#7c3aed", "#22c55e"][i],
                      boxShadow: `0 0 8px ${["#2563eb", "#7c3aed", "#22c55e"][i]}`,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-4 text-xs text-slate-500 text-center">Core Platform</div>
          </div>

          {/* Right column */}
          <div className="flex flex-col items-center gap-0 w-full max-w-xs mt-6 lg:mt-0">
            {modules.slice(4).map((mod, i) => (
              <div key={mod.id} className="flex flex-col items-center w-full">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.03, x: -4 }}
                  className="w-full group relative rounded-2xl p-4 border cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at right center, ${mod.color}12, transparent 70%)` }}
                  />
                  <div className="flex items-center gap-3 relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${mod.color}18`, border: `1px solid ${mod.color}30` }}
                    >
                      <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">{mod.title}</span>
                        <span
                          className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                          style={{ background: `${mod.color}20`, color: mod.color }}
                        >
                          {mod.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">{mod.description}</p>
                    </div>
                  </div>
                </motion.div>
                {i < 3 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.4 }}
                    className="flex flex-col items-center py-1"
                  >
                    <div className="w-px h-4" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(124,58,237,0.4))" }} />
                    <ChevronDown className="w-4 h-4 text-purple-500 opacity-60" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
