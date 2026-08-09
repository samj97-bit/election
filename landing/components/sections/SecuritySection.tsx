"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  ScrollText,
  HardDriveDownload,
  Lock,
  Database,
  Fingerprint,
  ClipboardList,
} from "lucide-react";

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Granular permissions for Admin, Party Lead, Volunteer, and Viewer roles. Access only what you're authorized to see.",
    color: "#2563eb",
    badge: "RBAC",
  },
  {
    icon: KeyRound,
    title: "Encrypted Authentication",
    description:
      "Bcrypt-hashed passwords, salted credentials, and secure HTTPS-only data transmission.",
    color: "#7c3aed",
    badge: "AES-256",
  },
  {
    icon: ScrollText,
    title: "Activity Logs",
    description:
      "Complete audit trail of all user actions, logins, and data modifications with timestamps.",
    color: "#06b6d4",
    badge: "Audit",
  },
  {
    icon: HardDriveDownload,
    title: "Automatic Backup",
    description:
      "Scheduled database backups every 6 hours with point-in-time recovery and geo-redundant storage.",
    color: "#22c55e",
    badge: "6hr",
  },
  {
    icon: Lock,
    title: "Data Protection",
    description:
      "End-to-end encryption for all student data. GDPR-compliant data retention policies and right-to-delete.",
    color: "#f59e0b",
    badge: "GDPR",
  },
  {
    icon: Database,
    title: "Secure Database",
    description:
      "Isolated database instances with row-level security, injection prevention, and query parameterization.",
    color: "#ec4899",
    badge: "RLS",
  },
  {
    icon: Fingerprint,
    title: "JWT Authentication",
    description:
      "Stateless JWT tokens with short expiry, refresh token rotation, and device fingerprinting.",
    color: "#14b8a6",
    badge: "JWT",
  },
  {
    icon: ClipboardList,
    title: "Audit Logs",
    description:
      "Immutable log entries for every critical operation. Export logs for compliance and forensic analysis.",
    color: "#8b5cf6",
    badge: "ISO 27001",
  },
];

export default function SecuritySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 relative" aria-label="Security features" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute bottom-0 left-1/4 w-96 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #22c55e, transparent)" }}
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
            style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            Security
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Enterprise-Grade{" "}
            <span className="gradient-text">Security</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Your election data is protected by multiple layers of security, ensuring
            integrity, confidentiality, and availability at all times.
          </p>
        </motion.div>

        {/* Shield Visual + Grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left: Shield Visual */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Outer ring */}
              <div
                className="w-56 h-56 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
                  border: "1px solid rgba(34,197,94,0.15)",
                  boxShadow: "0 0 60px rgba(34,197,94,0.1)",
                }}
              >
                {/* Middle ring */}
                <div
                  className="w-40 h-40 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}
                >
                  {/* Inner */}
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      border: "2px solid rgba(34,197,94,0.4)",
                      boxShadow: "0 0 30px rgba(34,197,94,0.2), inset 0 0 20px rgba(34,197,94,0.05)",
                    }}
                  >
                    <ShieldCheck className="w-12 h-12 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              {["256-bit", "GDPR", "JWT", "RBAC"].map((label, i) => {
                const angles = [30, 120, 210, 300];
                const radius = 120;
                const rad = (angles[i] * Math.PI) / 180;
                return (
                  <motion.div
                    key={label}
                    animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    className="absolute px-2.5 py-1 rounded-lg text-[10px] font-bold"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#4ade80",
                      top: `calc(50% + ${Math.sin(rad) * radius}px - 12px)`,
                      left: `calc(50% + ${Math.cos(rad) * radius}px - 24px)`,
                    }}
                  >
                    {label}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right: Security Cards Grid */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {securityFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ scale: 1.02, x: -2 }}
                className="group relative rounded-2xl p-4 border cursor-default"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at left center, ${feat.color}10, transparent 65%)` }}
                />
                <div className="flex items-start gap-3 relative">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}30` }}
                  >
                    <feat.icon className="w-4 h-4" style={{ color: feat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-white">{feat.title}</span>
                      <span
                        className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{ background: `${feat.color}20`, color: feat.color }}
                      >
                        {feat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
                  </div>
                </div>

                {/* Animated checkmark on hover */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(34,197,94,0.15)" }}
                >
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
