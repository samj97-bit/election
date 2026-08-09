"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Dr. Priya Nair",
    role: "Election Officer",
    college: "NIT Trichy",
    rating: 5,
    avatar: "PN",
    avatarColor: "#2563eb",
    quote:
      "This platform completely transformed how we conduct college elections. The real-time dashboard gave us visibility we never had before. Survey collection alone saved us 3 weeks of manual work.",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "Student Union President",
    college: "IIT Bombay",
    rating: 5,
    avatar: "AM",
    avatarColor: "#7c3aed",
    quote:
      "Managing 200+ volunteers was a nightmare before this system. Now I can see exactly who's doing what, which departments are covered, and where we need more effort — all from my phone.",
  },
  {
    id: 3,
    name: "Sneha Reddy",
    role: "Campaign Coordinator",
    college: "BITS Pilani",
    rating: 5,
    avatar: "SR",
    avatarColor: "#22c55e",
    quote:
      "The survey analytics are absolutely brilliant. We could identify undecided voters by department and target our efforts accordingly. The AI predictions were 91% accurate on election day!",
  },
  {
    id: 4,
    name: "Prof. Rajesh Kumar",
    role: "Dean of Students",
    college: "VIT Vellore",
    rating: 5,
    avatar: "RK",
    avatarColor: "#f59e0b",
    quote:
      "Security was our top priority, and this platform delivered. The role-based access, audit logs, and encrypted data gave our administration complete confidence in the process.",
  },
  {
    id: 5,
    name: "Kavitha Srinivasan",
    role: "Core Team Lead",
    college: "Anna University",
    rating: 5,
    avatar: "KS",
    avatarColor: "#ec4899",
    quote:
      "From party registration to final reports, everything was smooth. The automated report generation saved us enormous time and the PDF exports were professional-grade.",
  },
  {
    id: 6,
    name: "Rohit Sharma",
    role: "Volunteer Manager",
    college: "Jadavpur University",
    rating: 4,
    avatar: "RS",
    avatarColor: "#06b6d4",
    quote:
      "The volunteer portal made assigning tasks to 150+ students feel effortless. The real-time tracking and notifications kept everyone aligned throughout the campaign period.",
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 relative" aria-label="Testimonials" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.3), transparent)" }}
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
            style={{ background: "rgba(236,72,153,0.1)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.25)" }}
          >
            Testimonials
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Loved by{" "}
            <span className="gradient-text">Campus Leaders</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Hear from election officers, student leaders, and coordinators who have
            transformed their campus elections with our platform.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl p-6 border flex flex-col cursor-default"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
              aria-label={`Testimonial from ${t.name}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle at top left, ${t.avatarColor}10, transparent 60%)` }}
              />

              {/* Quote icon */}
              <Quote
                className="w-6 h-6 mb-4 opacity-30 relative"
                style={{ color: t.avatarColor }}
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4 relative" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`w-4 h-4 ${si < t.rating ? "fill-current" : "opacity-20"}`}
                    style={{ color: si < t.rating ? "#f59e0b" : "#94a3b8" }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-sm text-slate-400 leading-relaxed flex-1 relative italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6 pt-5 relative border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{
                    background: `${t.avatarColor}30`,
                    border: `2px solid ${t.avatarColor}50`,
                    color: t.avatarColor,
                  }}
                  aria-hidden="true"
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role} · {t.college}</div>
                </div>
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, transparent, ${t.avatarColor}60, transparent)` }}
              />
            </motion.article>
          ))}
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-10 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {[
            { value: "50+", label: "Colleges onboarded" },
            { value: "4.9/5", label: "Average rating" },
            { value: "98%", label: "Would recommend" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.value}
              </div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
