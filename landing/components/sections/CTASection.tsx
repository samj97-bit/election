"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      aria-label="Call to action"
      ref={ref}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 animated-gradient opacity-60"
          style={{ background: "linear-gradient(-45deg, #030712, #0a1628, #0f1e3a, #030712)" }}
        />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, #2563eb, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 bg-grid opacity-30"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Glass card */}
          <div
            className="relative rounded-3xl p-10 sm:p-16 border overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.09)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center top, rgba(37,99,235,0.12), transparent 60%)",
              }}
              aria-hidden="true"
            />

            {/* Sparkles badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
              style={{
                background: "rgba(37,99,235,0.15)",
                borderColor: "rgba(37,99,235,0.3)",
                color: "#60a5fa",
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Start for Free · No Credit Card</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to Manage Your{" "}
              <span className="gradient-text">PUCSC Election?</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Join the student campaigns at Panjab University College who trust our platform for transparent, secure,
              and data-driven elections. Set up your first campaign in under an hour.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/get-started">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white cursor-pointer transition-all relative overflow-hidden group"
                  aria-label="Get started with the platform"
                >
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                  />
                  <span className="relative z-10 flex items-center gap-2.5">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </Link>

              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-medium border cursor-pointer transition-all"
                  style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#e2e8f0",
                  }}
                  aria-label="Login to existing account"
                >
                  <LogIn className="w-5 h-5 text-slate-400" />
                  Login to Dashboard
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              {[
                "✓ Free 30-day trial",
                "✓ No setup fees",
                "✓ 99.9% uptime SLA",
                "✓ 24/7 support",
              ].map((b) => (
                <span key={b} className="text-sm text-slate-500 font-medium">
                  {b}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
