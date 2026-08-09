"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Crown,
  Star,
  Users,
  Award,
  Briefcase,
  BookOpen,
  Megaphone,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  Calendar,
  X,
} from "lucide-react";

/* ── Candidate Data ── */
const positions = [
  {
    title: "President",
    icon: Crown,
    color: "#f59e0b",
    borderColor: "rgba(245,158,11,0.3)",
    featured: true,
    candidates: [
      {
        name: "Arjun Verma",
        initials: "AV",
        photo: "/candidates/candidate_m1.png",
        department: "Computer Science Engineering",
        party: "Progress Alliance",
        partyColor: "#2563eb",
        year: "4th Year",
        roll: "CS21B043",
        manifesto: ["Digital Campus Initiative", "Better WiFi", "Smart Labs"],
        status: "Approved",
      },
      {
        name: "Rahul Nair",
        initials: "RN",
        photo: "/candidates/candidate_m2.png",
        department: "Electronics & Communication",
        party: "Unity Front",
        partyColor: "#7c3aed",
        year: "4th Year",
        roll: "EC21A112",
        manifesto: ["Hostel Reform", "Grievance Cell", "Library Hours"],
        status: "Approved",
      },
      {
        name: "Sneha Pillai",
        initials: "SP",
        photo: "/candidates/candidate_f1.png",
        department: "Civil Engineering",
        party: "Student Voice",
        partyColor: "#ec4899",
        year: "4th Year",
        roll: "CV21C005",
        manifesto: ["Campus Sustainability", "Bus Routes", "Fee Transparency"],
        status: "Approved",
      },
    ],
  },
  {
    title: "Vice President",
    icon: Star,
    color: "#7c3aed",
    borderColor: "rgba(124,58,237,0.3)",
    featured: true,
    candidates: [
      {
        name: "Priya Nambiar",
        initials: "PN",
        photo: "/candidates/candidate_f2.png",
        department: "Electronics & Communication",
        party: "Progress Alliance",
        partyColor: "#2563eb",
        year: "3rd Year",
        roll: "EC22A078",
        manifesto: ["Student Welfare", "Mental Health Desk", "Inclusivity"],
        status: "Approved",
      },
      {
        name: "Karan Singh",
        initials: "KS",
        photo: "/candidates/candidate_m3.png",
        department: "Mechanical Engineering",
        party: "Unity Front",
        partyColor: "#7c3aed",
        year: "3rd Year",
        roll: "ME22B034",
        manifesto: ["Sports Complex", "Inter-college Fest", "Gym Access"],
        status: "Approved",
      },
    ],
  },
  {
    title: "General Secretary",
    icon: Briefcase,
    color: "#22c55e",
    borderColor: "rgba(34,197,94,0.3)",
    featured: false,
    candidates: [
      {
        name: "Rohan Das",
        initials: "RD",
        photo: "/candidates/candidate_m4.png",
        department: "Mechanical Engineering",
        party: "Unity Front",
        partyColor: "#7c3aed",
        year: "3rd Year",
        roll: "ME22B098",
        manifesto: ["Transparent Governance", "Event Reforms", "Alumni Connect"],
        status: "Approved",
      },
      {
        name: "Ananya Iyer",
        initials: "AI",
        photo: "/candidates/candidate_f3.png",
        department: "Information Technology",
        party: "Progress Alliance",
        partyColor: "#2563eb",
        year: "3rd Year",
        roll: "IT22C021",
        manifesto: ["Online Grievance", "Semester Planner", "Exam Reform"],
        status: "Approved",
      },
    ],
  },
  {
    title: "Cultural Secretary",
    icon: Megaphone,
    color: "#ec4899",
    borderColor: "rgba(236,72,153,0.3)",
    featured: false,
    candidates: [
      {
        name: "Divya Krishnan",
        initials: "DK",
        photo: "/candidates/candidate_f4.png",
        department: "Computer Science Engineering",
        party: "Student Voice",
        partyColor: "#ec4899",
        year: "2nd Year",
        roll: "CS23A055",
        manifesto: ["Annual Fest Upgrade", "Cultural Exchange", "Art Grants"],
        status: "Approved",
      },
      {
        name: "Mithun Raj",
        initials: "MR",
        photo: "/candidates/candidate_m1.png",
        department: "MBA",
        party: "Unity Front",
        partyColor: "#7c3aed",
        year: "2nd Year",
        roll: "MB23B012",
        manifesto: ["Film Club", "Music Studio", "Theatre Wing"],
        status: "Approved",
      },
    ],
  },
  {
    title: "Sports Secretary",
    icon: TrendingUp,
    color: "#06b6d4",
    borderColor: "rgba(6,182,212,0.3)",
    featured: false,
    candidates: [
      {
        name: "Karthik Menon",
        initials: "KM",
        photo: "/candidates/candidate_m4.png",
        department: "BBA",
        party: "Progress Alliance",
        partyColor: "#2563eb",
        year: "2nd Year",
        roll: "BB23C019",
        manifesto: ["New Sports Complex", "Inter-college Tournaments", "Fitness Hub"],
        status: "Approved",
      },
      {
        name: "Vijay Reddy",
        initials: "VR",
        photo: "/candidates/candidate_m2.png",
        department: "Civil Engineering",
        party: "Student Voice",
        partyColor: "#ec4899",
        year: "3rd Year",
        roll: "CV22A067",
        manifesto: ["Cricket Ground", "Swimming Pool", "Yoga Sessions"],
        status: "Approved",
      },
    ],
  },
  {
    title: "Academic Secretary",
    icon: BookOpen,
    color: "#f97316",
    borderColor: "rgba(249,115,22,0.3)",
    featured: false,
    candidates: [
      {
        name: "Anjali Sharma",
        initials: "AS",
        photo: "/candidates/candidate_f1.png",
        department: "Information Technology",
        party: "Unity Front",
        partyColor: "#7c3aed",
        year: "3rd Year",
        roll: "IT22B043",
        manifesto: ["Research Grants", "Placement Reform", "Industry MoUs"],
        status: "Approved",
      },
    ],
  },
  {
    title: "Director — Finance",
    icon: ShieldCheck,
    color: "#14b8a6",
    borderColor: "rgba(20,184,166,0.3)",
    featured: false,
    candidates: [
      {
        name: "Vikram Gupta",
        initials: "VG",
        photo: "/candidates/candidate_m3.png",
        department: "BBA",
        party: "Progress Alliance",
        partyColor: "#2563eb",
        year: "4th Year",
        roll: "BB21A037",
        manifesto: ["Budget Transparency", "Scholarship Drive", "Audit Reports"],
        status: "Approved",
      },
    ],
  },
  {
    title: "Director — Technical",
    icon: GraduationCap,
    color: "#8b5cf6",
    borderColor: "rgba(139,92,246,0.3)",
    featured: false,
    candidates: [
      {
        name: "Meera Krishnan",
        initials: "MK",
        photo: "/candidates/candidate_f3.png",
        department: "Computer Science Engineering",
        party: "Student Voice",
        partyColor: "#ec4899",
        year: "3rd Year",
        roll: "CS22C088",
        manifesto: ["Hackathons", "Open Source Labs", "Tech Incubator"],
        status: "Approved",
      },
      {
        name: "Sahil Joshi",
        initials: "SJ",
        photo: "/candidates/candidate_m2.png",
        department: "Electronics & Communication",
        party: "Unity Front",
        partyColor: "#7c3aed",
        year: "3rd Year",
        roll: "EC22B051",
        manifesto: ["Robotics Club", "3D Printing Lab", "IoT Workshop"],
        status: "Approved",
      },
    ],
  },
  {
    title: "Director — Social Welfare",
    icon: Users,
    color: "#ef4444",
    borderColor: "rgba(239,68,68,0.3)",
    featured: false,
    candidates: [
      {
        name: "Meera Pillai",
        initials: "MP",
        photo: "/candidates/candidate_f4.png",
        department: "Electronics & Communication",
        party: "Unity Front",
        partyColor: "#7c3aed",
        year: "2nd Year",
        roll: "EC23A029",
        manifesto: ["Mental Health Desk", "Blood Donation", "Inclusivity Drive"],
        status: "Approved",
      },
      {
        name: "Aryan Bose",
        initials: "AB",
        photo: "/candidates/candidate_m1.png",
        department: "Civil Engineering",
        party: "Student Voice",
        partyColor: "#ec4899",
        year: "2nd Year",
        roll: "CV23C041",
        manifesto: ["Anti-Ragging Cell", "Scholarship Help", "NSS Activities"],
        status: "Approved",
      },
    ],
  },
];

/* ── Candidate Card ── */
function CandidateCard({
  candidate,
  posColor,
  index,
  inView,
  featured,
  onClick,
}: {
  candidate: (typeof positions)[0]["candidates"][0];
  posColor: string;
  index: number;
  inView: boolean;
  featured: boolean;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const heightClass = featured ? "h-72 sm:h-80" : "h-64 sm:h-72";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className="group relative rounded-2xl border overflow-hidden cursor-pointer flex flex-col shadow-lg"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {/* Full width Image Header */}
      <div className={`relative w-full ${heightClass} overflow-hidden bg-[#030712]`}>
        {!imgError ? (
          <Image
            src={candidate.photo}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
            alt={candidate.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-black"
            style={{ background: `${posColor}15`, color: posColor }}
          >
            {candidate.initials}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full backdrop-blur-md bg-black/40 border border-white/20 text-white shadow-sm">
            <CheckCircle className="w-3 h-3 text-green-400" />
            {candidate.status}
          </span>
        </div>

        {/* Gradient Overlay & Name */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/80 to-transparent p-4 pt-16">
          <h4 className="text-xl font-bold text-white leading-tight mb-1">{candidate.name}</h4>
          <p className="text-xs text-slate-300">
            {candidate.year} · {candidate.roll}
          </p>
        </div>
      </div>

      <div className="p-4 pt-3 flex-1 flex flex-col bg-[#0a0f1c]">
        <p className="text-xs text-slate-400 mb-4 line-clamp-1">{candidate.department}</p>

        {/* Party badge */}
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-md"
            style={{
              background: `${candidate.partyColor}15`,
              color: candidate.partyColor,
              border: `1px solid ${candidate.partyColor}30`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: candidate.partyColor }}
            />
            {candidate.party}
          </span>
        </div>

        {/* Manifesto tags (truncate to 2 for the card preview) */}
        <div
          className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          {candidate.manifesto.slice(0, 2).map((point: string) => (
            <span
              key={point}
              className="text-[9px] px-2 py-1 rounded-md text-slate-400 border"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {point}
            </span>
          ))}
          {candidate.manifesto.length > 2 && (
            <span
              className="text-[9px] px-2 py-1 rounded-md text-slate-500 border"
              style={{
                borderColor: "rgba(255,255,255,0.05)",
                background: "transparent",
              }}
            >
              +{candidate.manifesto.length - 2} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Position Block ── */
function PositionBlock({
  pos,
  blockIndex,
  inView,
  onCandidateClick,
}: {
  pos: (typeof positions)[0];
  blockIndex: number;
  inView: boolean;
  onCandidateClick: (candidate: any, posColor: string, posTitle: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: blockIndex * 0.08 }}
      className="rounded-3xl border overflow-hidden shadow-lg"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: pos.borderColor,
      }}
    >
      {/* Position Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ background: `${pos.color}0a`, borderColor: pos.borderColor }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
          style={{ background: `${pos.color}20`, border: `1px solid ${pos.color}40` }}
        >
          <pos.icon className="w-5 h-5" style={{ color: pos.color }} />
        </div>
        <div className="flex-1">
          <h3
            className="text-base font-bold"
            style={{ color: pos.color, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {pos.title}
          </h3>
          <p className="text-xs text-slate-400">
            {pos.candidates.length} candidate{pos.candidates.length !== 1 ? "s" : ""} contesting
          </p>
        </div>
        <div
          className="text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider"
          style={{ background: `${pos.color}18`, color: pos.color }}
        >
          {pos.candidates.length === 1 ? "Unopposed" : `${pos.candidates.length} Contesting`}
        </div>
      </div>

      {/* Candidate cards grid */}
      <div
        className={`p-5 grid gap-5 ${
          pos.candidates.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : pos.featured
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2"
        }`}
      >
        {pos.candidates.map((c, ci) => (
          <CandidateCard
            key={c.roll}
            candidate={c}
            posColor={pos.color}
            index={blockIndex * 3 + ci}
            inView={inView}
            featured={pos.featured}
            onClick={() => onCandidateClick(c, pos.color, pos.title)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main Section ── */
export default function CandidatesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [selectedPosColor, setSelectedPosColor] = useState<string>("");
  const [selectedPosTitle, setSelectedPosTitle] = useState<string>("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCandidate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCandidate]);

  const handleCandidateClick = (candidate: any, color: string, title: string) => {
    setSelectedCandidate(candidate);
    setSelectedPosColor(color);
    setSelectedPosTitle(title);
  };

  const closeModal = () => setSelectedCandidate(null);

  const totalCandidates = positions.reduce((sum, p) => sum + p.candidates.length, 0);

  return (
    <>
      <section
        id="candidates"
        className="py-24 relative"
        aria-label="Election candidates"
        ref={ref}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-72 rounded-full blur-3xl opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, #f59e0b, #7c3aed, transparent)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{
                background: "rgba(245,158,11,0.1)",
                color: "#fbbf24",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              PUCSC Elections 2026
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Meet the{" "}
              <span className="gradient-text">Candidates</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              All registered and approved candidates contesting in this year&apos;s PUCSC student
              council election at Panjab University College. Click on any profile to learn more about their campaign.
            </p>

            {/* Election info bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="inline-flex flex-wrap items-center justify-center gap-6 mt-10 px-8 py-5 rounded-2xl border mx-auto shadow-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              {[
                { icon: Users, value: String(totalCandidates), label: "Total Candidates", color: "#2563eb" },
                { icon: Award, value: String(positions.length), label: "Positions Open", color: "#7c3aed" },
                { icon: CheckCircle, value: "3", label: "Registered Parties", color: "#22c55e" },
                { icon: Calendar, value: "Sep 10, 2026", label: "Election Day", color: "#f59e0b" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-black text-white leading-tight">{s.value}</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">{s.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Position blocks */}
          <div className="space-y-8">
            {/* Featured: President & VP */}
            <div className="grid lg:grid-cols-2 gap-8">
              {positions.filter((p) => p.featured).map((pos, i) => (
                <PositionBlock
                  key={pos.title}
                  pos={pos}
                  blockIndex={i}
                  inView={inView}
                  onCandidateClick={handleCandidateClick}
                />
              ))}
            </div>

            {/* Secretary positions */}
            <div className="grid lg:grid-cols-2 gap-8">
              {positions
                .filter((p) => !p.featured && p.title.includes("Secretary"))
                .map((pos, i) => (
                  <PositionBlock
                    key={pos.title}
                    pos={pos}
                    blockIndex={i + 2}
                    inView={inView}
                    onCandidateClick={handleCandidateClick}
                  />
                ))}
            </div>

            {/* Director positions */}
            <div className="grid lg:grid-cols-3 gap-8">
              {positions
                .filter((p) => !p.featured && p.title.includes("Director"))
                .map((pos, i) => (
                  <PositionBlock
                    key={pos.title}
                    pos={pos}
                    blockIndex={i + 5}
                    inView={inView}
                    onCandidateClick={handleCandidateClick}
                  />
                ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff" }}
              aria-label="Register your party"
            >
              <GraduationCap className="w-5 h-5" />
              Register your Party (PUCSC)
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <p className="text-sm text-slate-500 mt-4">
              Registration closes&nbsp;
              <span className="text-slate-300 font-medium">Aug 20, 2026</span>
              &nbsp;· Requires admin approval
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Candidate Modal (Popup) ── */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0f1c] border rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row z-10 custom-scrollbar"
              style={{
                borderColor: selectedPosColor ? `${selectedPosColor}50` : "rgba(255,255,255,0.1)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white hover:bg-black/80 hover:scale-110 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Large Image */}
              <div className="w-full md:w-2/5 h-72 md:h-auto min-h-[300px] relative bg-[#030712] flex-shrink-0">
                <Image
                  src={selectedCandidate.photo}
                  fill
                  className="object-cover object-top"
                  alt={selectedCandidate.name}
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                {/* Gradient fades matching layout */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0a0f1c]/10 md:to-[#0a0f1c]" />
              </div>

              {/* Right Column: Candidate Details */}
              <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                <div className="inline-flex flex-wrap items-center gap-3 mb-5">
                  <span
                    className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border"
                    style={{
                      background: `${selectedPosColor}15`,
                      color: selectedPosColor,
                      borderColor: `${selectedPosColor}40`,
                    }}
                  >
                    {selectedPosTitle} Candidate
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" /> Approved
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                  {selectedCandidate.name}
                </h3>
                
                <p className="text-sm sm:text-base text-slate-300 mb-6 font-medium">
                  {selectedCandidate.department} · {selectedCandidate.year} <span className="text-slate-500">(Roll: {selectedCandidate.roll})</span>
                </p>

                <div className="mb-8">
                  <span
                    className="inline-flex items-center gap-2.5 text-sm font-semibold px-4 py-2 rounded-xl"
                    style={{
                      background: `${selectedCandidate.partyColor}15`,
                      color: selectedCandidate.partyColor,
                      border: `1px solid ${selectedCandidate.partyColor}30`,
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ background: selectedCandidate.partyColor }}
                    />
                    {selectedCandidate.party}
                  </span>
                </div>

                <div className="border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <h4 className="text-sm font-bold text-slate-200 mb-5 uppercase tracking-widest flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-slate-400" /> Key Campaign Promises
                  </h4>
                  <ul className="space-y-4">
                    {selectedCandidate.manifesto.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-3.5">
                        <div
                          className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{
                            background: `${selectedPosColor}15`,
                            color: selectedPosColor,
                            border: `1px solid ${selectedPosColor}30`,
                          }}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-300 text-sm sm:text-base leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
