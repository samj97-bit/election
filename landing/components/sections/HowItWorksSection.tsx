"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  UserPlus,
  Users,
  ClipboardList,
  LayoutDashboard,
  Monitor,
  FileOutput,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Register your Party (Panjab University)",
    description:
      "Parties from Panjab University College register on the platform with their manifesto, candidate details, and campaign goals for the upcoming PUCSC Elections.",
    color: "#2563eb",
    detail: "Takes ~10 minutes",
  },
  {
    num: "02",
    icon: Users,
    title: "Create Team",
    description:
      "Build your core team and assign volunteers to specific departments and campus zones for maximum coverage.",
    color: "#7c3aed",
    detail: "Auto role assignment",
  },
  {
    num: "03",
    icon: ClipboardList,
    title: "Collect Survey Data",
    description:
      "Deploy surveys across departments. Volunteers gather data using mobile-friendly forms with offline support.",
    color: "#22c55e",
    detail: "Real-time sync",
  },
  {
    num: "04",
    icon: LayoutDashboard,
    title: "Analyze Dashboard",
    description:
      "Monitor campaign performance with live charts, heatmaps, and AI-powered insights from your personalized dashboard.",
    color: "#f59e0b",
    detail: "AI-powered insights",
  },
  {
    num: "05",
    icon: Monitor,
    title: "Election Monitoring",
    description:
      "Track real-time voting progress, monitor turnout by department, and watch live analytics on election day.",
    color: "#06b6d4",
    detail: "Live tracking",
  },
  {
    num: "06",
    icon: FileOutput,
    title: "Generate Reports",
    description:
      "Post-election reports with detailed analysis, campaign performance, and insights for future elections.",
    color: "#ec4899",
    detail: "PDF + Excel export",
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 relative" aria-label="How it works" ref={ref}>
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
            style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            Process
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            How It{" "}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Six simple steps from party registration to post-election reporting.
            Get started in minutes, not days.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative rounded-2xl p-6 border overflow-hidden cursor-default"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl"
                style={{ background: `radial-gradient(circle at top left, ${step.color}10, transparent 60%)` }}
              />

              {/* Step number (large bg) */}
              <div
                className="absolute top-4 right-4 text-6xl font-black opacity-[0.04] select-none"
                style={{ color: step.color, fontFamily: "'Space Grotesk', sans-serif" }}
                aria-hidden="true"
              >
                {step.num}
              </div>

              {/* Number badge */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${step.color}22`, color: step.color, border: `1px solid ${step.color}40` }}
                >
                  {step.num}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${step.color}15`, color: step.color }}
                >
                  {step.detail}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
              >
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>

              {/* Content */}
              <h3 className="relative text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="relative text-sm text-slate-500 leading-relaxed">{step.description}</p>

              {/* Bottom line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, transparent, ${step.color}80, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Connector arrows — desktop only */}
        <div className="hidden lg:flex justify-center gap-6 mt-8" aria-hidden="true">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.15 }}
              className="flex-1 max-w-40 h-px mt-4"
              style={{
                background: "linear-gradient(90deg, rgba(37,99,235,0.5), rgba(124,58,237,0.5))",
                transformOrigin: "left",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
