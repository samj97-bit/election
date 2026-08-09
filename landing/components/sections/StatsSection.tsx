"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  GraduationCap,
  HeartHandshake,
  MessageSquare,
  Building2,
  Radio,
} from "lucide-react";

const stats = [
  {
    id: "parties",
    icon: Building2,
    value: 248,
    suffix: "+",
    label: "Registered Parties",
    color: "#2563eb",
    gradient: "from-blue-600/20 to-blue-900/10",
  },
  {
    id: "students",
    icon: GraduationCap,
    value: 1250000,
    suffix: "+",
    label: "Registered Students",
    color: "#7c3aed",
    gradient: "from-violet-600/20 to-violet-900/10",
  },
  {
    id: "volunteers",
    icon: HeartHandshake,
    value: 48500,
    suffix: "+",
    label: "Active Volunteers",
    color: "#22c55e",
    gradient: "from-green-600/20 to-green-900/10",
  },
  {
    id: "surveys",
    icon: MessageSquare,
    value: 890000,
    suffix: "+",
    label: "Survey Responses",
    color: "#f59e0b",
    gradient: "from-amber-600/20 to-amber-900/10",
  },
  {
    id: "departments",
    icon: Users,
    value: 1200,
    suffix: "+",
    label: "Departments Covered",
    color: "#06b6d4",
    gradient: "from-cyan-600/20 to-cyan-900/10",
  },
  {
    id: "sessions",
    icon: Radio,
    value: 342,
    suffix: "",
    label: "Live Sessions Today",
    color: "#ef4444",
    gradient: "from-red-600/20 to-red-900/10",
  },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function AnimatedCounter({
  target,
  suffix,
  color,
  duration = 2000,
}: {
  target: number;
  suffix: string;
  color: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="font-bold" style={{ color }}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="py-20 relative"
      aria-label="Platform statistics"
      ref={ref}
    >
      <div className="section-divider mb-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: "rgba(37,99,235,0.1)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.25)" }}
          >
            Platform Scale
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Trusted by Colleges Nationwide
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Real numbers from real campuses using our election management platform.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative rounded-2xl p-6 border overflow-hidden group cursor-default"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              {/* Background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at top left, ${stat.color}15 0%, transparent 70%)` }}
              />

              {/* Animated border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 0 1px ${stat.color}30` }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>

              {/* Value */}
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  color={stat.color}
                />
              </div>

              {/* Label */}
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="section-divider mt-16" />
    </section>
  );
}
