"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Megaphone,
  UserPlus,
  HeartHandshake,
  Mic2,
  ClipboardList,
  Vote,
  FileOutput,
} from "lucide-react";

const timelineEvents = [
  {
    icon: Megaphone,
    title: "Election Announcement",
    date: "Aug 15, 2026",
    description:
      "The college announces the upcoming election. Platform opens for party registration. Candidates are notified of key dates and rules.",
    color: "#2563eb",
    tag: "Kickoff",
  },
  {
    icon: UserPlus,
    title: "Party Registration",
    date: "Aug 16–20, 2026",
    description:
      "Political parties register on the platform. Submit candidate profiles, manifestos, and campaign goals for admin verification.",
    color: "#7c3aed",
    tag: "Registration",
  },
  {
    icon: HeartHandshake,
    title: "Volunteer Assignment",
    date: "Aug 21–24, 2026",
    description:
      "Core teams assign volunteers to departments and campus zones. Roles and tasks are configured in the volunteer portal.",
    color: "#06b6d4",
    tag: "Onboarding",
  },
  {
    icon: Mic2,
    title: "Campaign Period",
    date: "Aug 25 – Sep 3, 2026",
    description:
      "Active campaign phase. Volunteers engage students, collect data, and update the dashboard with daily activity metrics.",
    color: "#f59e0b",
    tag: "Campaign",
  },
  {
    icon: ClipboardList,
    title: "Survey Collection",
    date: "Sep 1–5, 2026",
    description:
      "Structured surveys deployed across departments. Real-time response tracking and sentiment analysis begins.",
    color: "#22c55e",
    tag: "Data",
  },
  {
    icon: Vote,
    title: "Election Day",
    date: "Sep 10, 2026",
    description:
      "Live election monitoring dashboard. Real-time turnout tracking, department-wise analytics, and instant result computation.",
    color: "#ef4444",
    tag: "Live",
  },
  {
    icon: FileOutput,
    title: "Reports & Analysis",
    date: "Sep 11–12, 2026",
    description:
      "Comprehensive post-election reports generated. PDF and Excel exports, campaign analysis, and insights for future elections.",
    color: "#ec4899",
    tag: "Closure",
  },
];

export default function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      className="py-24 relative"
      aria-label="Election timeline"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" }}
          >
            Timeline
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Election{" "}
            <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From announcement to final reports — every phase managed in one platform.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line Track */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5 lg:left-1/2"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-hidden="true"
          >
            {/* Animated progress fill */}
            <motion.div
              className="w-full rounded-full"
              style={{
                height: lineHeight,
                background: "linear-gradient(to bottom, #2563eb, #7c3aed, #22c55e, #ef4444, #ec4899)",
              }}
            />
          </div>

          {/* Events */}
          <div className="space-y-8 lg:space-y-0">
            {timelineEvents.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={event.title}
                  className={`relative flex items-start gap-4 lg:gap-0 lg:mb-12 ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative ml-14 lg:ml-0 lg:w-5/12 ${isLeft ? "lg:mr-auto lg:pr-8" : "lg:ml-auto lg:pl-8"}`}
                  >
                    <div
                      className="rounded-2xl p-5 border group cursor-default"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(circle at ${isLeft ? "right" : "left"} center, ${event.color}10, transparent 65%)` }}
                      />

                      <div className="flex items-center gap-2 mb-3 relative">
                        <span
                          className="text-xs font-bold uppercase px-2.5 py-1 rounded-full"
                          style={{ background: `${event.color}20`, color: event.color }}
                        >
                          {event.tag}
                        </span>
                        <span className="text-xs text-slate-500">{event.date}</span>
                      </div>

                      <h3 className="relative text-base font-bold text-white mb-2">{event.title}</h3>
                      <p className="relative text-sm text-slate-500 leading-relaxed">{event.description}</p>
                    </div>
                  </motion.div>

                  {/* Center Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                    className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 flex-shrink-0 mt-4 lg:mt-0 lg:top-1/2 lg:-translate-y-1/2"
                    style={{ zIndex: 10 }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: `${event.color}25`,
                        border: `2px solid ${event.color}`,
                        boxShadow: `0 0 16px ${event.color}50`,
                      }}
                    >
                      <event.icon className="w-4 h-4" style={{ color: event.color }} />
                    </div>
                  </motion.div>

                  {/* Empty space for opposite side on desktop */}
                  <div className="hidden lg:block lg:w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
