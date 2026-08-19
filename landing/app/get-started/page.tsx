"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  User,
  Phone,
  Lock,
  Users,
  CheckCircle2,
  Sparkles,
  Flag,
  FileText,
  UploadCloud,
  IdCard,
  Landmark,
  BadgeCent,
  FileBadge,
  Megaphone,
  Calendar,
  Mail,
} from "lucide-react";

const electionOptionsByCollege: Record<string, { value: string; label: string }[]> = {
  puc: [
    { value: "pucsc_2026", label: "PUCSC Elections 2026" },
  ],
  iit_bombay: [
    { value: "iitb_council_2026", label: "IIT Bombay Student Council 2026" },
    { value: "iitb_hostel_2026", label: "Hostel Affairs Election 2026" },
  ],
  iit_delhi: [
    { value: "iitd_bsa_2026", label: "Board for Student Activities (BSA) 2026" },
    { value: "iitd_bhm_2026", label: "Board for Hostel Management 2026" },
  ],
  bits_pilani: [
    { value: "bits_su_2026", label: "Students' Union Election 2026" },
  ],
  nit_trichy: [
    { value: "nitt_sc_2026", label: "Student Council Election 2026" },
  ],
  du: [
    { value: "dusu_2026", label: "DUSU Elections 2026" },
    { value: "dusu_college_2026", label: "Individual College Council 2026" },
  ],
};

export default function GetStartedPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [college, setCollege] = useState("");
  const [customCollege, setCustomCollege] = useState("");
  const [electionType, setElectionType] = useState("");
  const [customElection, setCustomElection] = useState("");
  
  // Party state
  const [partyName, setPartyName] = useState("");

  // Admin state
  const [adminName, setAdminName] = useState("");
  const [department, setDepartment] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");

  const availableElections = college && college !== "other" ? electionOptionsByCollege[college] : null;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match");
        return;
      }

      setIsLoading(true);
      const finalCollege = college === "other" ? customCollege : college;
      const finalElection = electionType === "other_election" ? customElection : electionType;

      // 0. Pre-check if party exists
      const { data: existingParty } = await supabase
        .from("parties")
        .select("id")
        .eq("college", finalCollege)
        .eq("election_name", finalElection)
        .eq("party_name", partyName)
        .maybeSingle();

      if (existingParty) {
        setErrorMsg(`A party named "${partyName}" is already registered for this election.`);
        setIsLoading(false);
        return;
      }

      // 1. Insert Party
      const { data: partyData, error: partyError } = await supabase
        .from("parties")
        .insert([{
          college: finalCollege,
          election_name: finalElection,
          party_name: partyName
        }])
        .select()
        .single();

      if (partyError) {
        setErrorMsg(partyError.message || "Failed to create party");
        setIsLoading(false);
        return;
      }

      // 2. Register Admin User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: adminName,
            party_id: partyData.id
          }
        }
      });

      if (authError) {
        setErrorMsg(authError.message || "Failed to create user");
        setIsLoading(false);
        return;
      }

      // 3. Insert Profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{
            user_id: authData.user.id,
            full_name: adminName,
            department: department,
            mobile: mobileNumber,
            roll_number: rollNumber,
            party_id: partyData.id
          }]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      setIsLoading(false);
      setIsSuccess(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const slideVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-x-hidden bg-[#030712] selection:bg-blue-500/30 pt-16 pb-12">
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 pointer-events-none fixed" aria-hidden="true">
        <div
          className="absolute inset-0 animated-gradient opacity-[0.15]"
          style={{ background: "linear-gradient(-45deg, #030712, #1e1b4b, #0f172a, #030712)" }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: "#2563eb" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: "#7c3aed" }}
        />
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
      </div>

      {/* ── Top Navigation ── */}
      <div className="absolute top-0 left-0 w-full p-6 z-20">
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </motion.div>
        </Link>
      </div>

      {/* ── Main Wizard Container ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-xl mx-4 z-10"
      >
        {/* Header section (hide on success) */}
        {!isSuccess && (
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Register your <span className="gradient-text">Party</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Set up your party workspace to manage campaigns and analyze elections.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="relative">
          {/* Glassmorphism Container */}
          <div
            className="absolute inset-0 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          />

          <div className="relative p-6 sm:p-10">
            {/* Progress Bar */}
            {!isSuccess && (
              <div className="mb-8">
                <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
                  <span className={step >= 1 ? "text-blue-400" : ""}>Election</span>
                  <span className={step >= 2 ? "text-blue-400" : ""}>Party</span>
                  <span className={step >= 3 ? "text-blue-400" : ""}>Admin</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed)" }}
                    initial={{ width: "25%" }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key={`step-${step}`}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onSubmit={handleNext}
                  className="space-y-6"
                >
                  {/* STEP 1: ELECTION INFORMATION */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <h3 className="text-xl font-semibold text-white mb-4">Election Information</h3>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 ml-1">College / Institute Name</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <select
                            required
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                          >
                            <option value="" disabled hidden>Select your College/Institute</option>
                            <option value="puc" className="bg-slate-900">Panjab University College</option>
                            <option value="iit_bombay" className="bg-slate-900">Indian Institute of Technology Bombay</option>
                            <option value="iit_delhi" className="bg-slate-900">Indian Institute of Technology Delhi</option>
                            <option value="bits_pilani" className="bg-slate-900">BITS Pilani</option>
                            <option value="nit_trichy" className="bg-slate-900">National Institute of Technology Trichy</option>
                            <option value="du" className="bg-slate-900">Delhi University</option>
                            <option value="other" className="bg-slate-900">Other / Not Listed</option>
                          </select>
                        </div>
                      </div>

                      {/* Conditional Input for 'Other' College */}
                      <AnimatePresence>
                        {college === "other" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="space-y-1.5 overflow-hidden"
                          >
                            <label className="text-xs font-semibold text-slate-300 ml-1">Specify College Name</label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                required
                                value={customCollege}
                                onChange={(e) => setCustomCollege(e.target.value)}
                                placeholder="Enter your college name..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 ml-1">Election Name</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Landmark className="w-4 h-4" />
                          </div>
                          {availableElections ? (
                            <select
                              required
                              value={electionType}
                              onChange={(e) => setElectionType(e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                            >
                              <option value="" disabled hidden>Select active election</option>
                              {availableElections.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-slate-900">
                                  {opt.label}
                                </option>
                              ))}
                              <option value="other_election" className="bg-slate-900">Custom / Not Listed</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              required
                              value={electionType}
                              onChange={(e) => setElectionType(e.target.value)}
                              placeholder="e.g. Student Council Election 2026"
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                          )}
                        </div>
                      </div>

                      {/* Conditional Input for 'Other' Election */}
                      <AnimatePresence>
                        {availableElections && electionType === "other_election" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="space-y-1.5 overflow-hidden"
                          >
                            <label className="text-xs font-semibold text-slate-300 ml-1">Specify Election Name</label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Landmark className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                required
                                value={customElection}
                                onChange={(e) => setCustomElection(e.target.value)}
                                placeholder="Enter custom election name..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* STEP 2: PARTY INFORMATION */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <h3 className="text-xl font-semibold text-white mb-4">Party Information</h3>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 ml-1">Party Name</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Flag className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            value={partyName}
                            onChange={(e) => setPartyName(e.target.value)}
                            placeholder="e.g. Progress Alliance"
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          />
                        </div>
                      </div>



                    </div>
                  )}

                  {/* STEP 3: MAIN ADMINISTRATOR */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white mb-2">Main Administrator</h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 ml-1">Administrator Name</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              required
                              value={adminName}
                              onChange={(e) => setAdminName(e.target.value)}
                              placeholder="Full Name"
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 ml-1">Department / Branch</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <select
                              required
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                            >
                              <option value="" disabled hidden>Select Department</option>
                              <option value="cse" className="bg-slate-900">Computer Science Engineering</option>
                              <option value="it" className="bg-slate-900">Information Technology</option>
                              <option value="uils" className="bg-slate-900">UILS (Law)</option>
                              <option value="ece" className="bg-slate-900">Electronics & Communication</option>
                              <option value="me" className="bg-slate-900">Mechanical Engineering</option>
                              <option value="ce" className="bg-slate-900">Civil Engineering</option>
                              <option value="ee" className="bg-slate-900">Electrical Engineering</option>
                              <option value="other" className="bg-slate-900">Other / Not Listed</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 ml-1">Mobile Number</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                              <Phone className="w-4 h-4" />
                            </div>
                            <input
                              type="tel"
                              required
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              placeholder="+91"
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 ml-1">Roll Number</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                              <IdCard className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              required
                              value={rollNumber}
                              onChange={(e) => setRollNumber(e.target.value)}
                              placeholder="e.g. CS21B001"
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@college.edu"
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 ml-1">Password</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300 ml-1">Confirm Password</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                              <Lock className="w-4 h-4" />
                            </div>
                            <input
                              type="password"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                      {errorMsg}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative flex-1 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden group transition-all cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
                      
                      <span className="relative flex items-center justify-center gap-2">
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : step === totalSteps ? (
                          <>Create Workspace <Sparkles className="w-4 h-4" /></>
                        ) : (
                          <>Next Step <ArrowRight className="w-4 h-4" /></>
                        )}
                      </span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                /* SUCCESS STATE */
                <motion.div
                  key="success"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  className="py-12 flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/30"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Party Registered!</h3>
                  <p className="text-slate-400 text-sm max-w-sm mb-8">
                    Your political party workspace is ready. You can now invite volunteers and start analyzing your campaign data.
                  </p>
                  <Link href="/login" className="w-full">
                    <button className="w-full py-4 rounded-xl text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
