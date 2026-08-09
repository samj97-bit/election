"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is the College Election Management System?",
    a: "The College Election Management System (CEMS) is a comprehensive SaaS platform designed to manage every aspect of campus elections. It covers party registration, volunteer coordination, survey collection, real-time analytics, and report generation — all in one secure, role-based platform.",
  },
  {
    q: "How is student data protected on the platform?",
    a: "We implement enterprise-grade security including AES-256 encryption at rest, TLS in transit, bcrypt-hashed passwords, JWT authentication with short expiry and refresh token rotation, row-level database security, and GDPR-compliant data handling policies. All data is backed up automatically every 6 hours.",
  },
  {
    q: "Who can access the dashboards and analytics?",
    a: "Access is controlled by a role-based permission system. Admins have full access. Party leaders can view their own campaign data. Volunteers see task assignments and their activity logs. The college administration can see aggregated, anonymized analytics. All access is logged with timestamps.",
  },
  {
    q: "Can reports and data be exported?",
    a: "Yes. The platform supports one-click export to PDF, Excel (XLSX), and CSV formats. Reports include campaign summaries, volunteer activity, department-wise coverage, survey analysis, and election outcome insights. You can also schedule automated report delivery to email addresses.",
  },
  {
    q: "Is the platform mobile-friendly?",
    a: "Absolutely. The platform is fully responsive and optimized for all screen sizes — desktop, tablet, and mobile. Volunteers can submit survey responses, update activity logs, and communicate via the mobile-friendly volunteer portal even with limited connectivity.",
  },
  {
    q: "How long does it take to set up for a new election?",
    a: "Most colleges are up and running within 2-4 hours. The platform includes a guided setup wizard, pre-built templates for common election workflows, and dedicated onboarding support. Party registration, volunteer onboarding, and survey deployment can all begin on day one.",
  },
  {
    q: "Does the platform support multiple parties simultaneously?",
    a: "Yes. The platform is designed for multi-party elections with complete data isolation between parties. Each party has its own dashboard, volunteer pool, and analytics. Admins see a unified view across all parties while maintaining strict access boundaries.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="faq"
      className="py-24 relative"
      aria-label="Frequently asked questions"
      ref={ref}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: "rgba(6,182,212,0.1)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.25)" }}
          >
            FAQ
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Everything you need to know about the College Election Management System.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3" role="list">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              role="listitem"
            >
              <div
                className="rounded-2xl border overflow-hidden transition-all duration-300"
                style={{
                  background: openIndex === i ? "rgba(37,99,235,0.06)" : "rgba(255,255,255,0.03)",
                  borderColor: openIndex === i ? "rgba(37,99,235,0.3)" : "rgba(255,255,255,0.07)",
                }}
              >
                {/* Question Button */}
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span
                    className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                      openIndex === i ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 0 : 0 }}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: openIndex === i ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.06)",
                      border: openIndex === i ? "1px solid rgba(37,99,235,0.4)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                    aria-hidden="true"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {openIndex === i ? (
                        <motion.div
                          key="minus"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Minus className="w-3.5 h-3.5 text-blue-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="plus"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t" style={{ borderColor: "rgba(37,99,235,0.2)" }}>
                        <div className="pt-4">{faq.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 text-center"
        >
          <p className="text-slate-500 text-sm">
            Still have questions?{" "}
            <a
              href="#contact"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 underline underline-offset-4"
            >
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
