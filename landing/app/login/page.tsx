"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  Megaphone,
  LogIn,
  CheckCircle2,
  Users,
  HeartHandshake,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"party_admin" | "volunteer">("party_admin");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const roles = [
    { id: "party_admin", label: "Party Admin", icon: Users },
    { id: "volunteer", label: "Volunteer", icon: HeartHandshake },
  ] as const;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (role === "party_admin") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }
    } else if (role === "volunteer") {
      try {
        const hashedClientPassword = await sha256(password);
        const res = await fetch("/api/auth/volunteer/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: hashedClientPassword }),
        });
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "Failed to login as volunteer");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setErrorMsg("Failed to connect to login service");
        setIsLoading(false);
        return;
      }
    }

    setIsSuccess(true);
    // Add small delay to show success animation before redirect
    setTimeout(() => {
      router.push(role === "volunteer" ? "/volunteer-dashboard" : "/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#030712] selection:bg-blue-500/30">
      {/* ── Background Effects ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Animated Gradient Background */}
        <div
          className="absolute inset-0 animated-gradient opacity-30"
          style={{ background: "linear-gradient(-45deg, #030712, #0a1628, #0f1e3a, #030712)" }}
        />
        {/* Glow Orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #2563eb, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-30" />
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

      {/* ── Login Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[440px] p-6 sm:p-10 z-10 mx-4"
      >
        {/* Glassmorphism Container */}
        <div
          className="absolute inset-0 rounded-[2rem] border shadow-2xl backdrop-blur-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        />
        
        {/* Inner Glow */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top, rgba(37,99,235,0.1), transparent 50%)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-lg"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in to manage your campus elections.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Role Selector Tabs */}
                <div
                  className="flex p-1 rounded-xl mb-8"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className="relative flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-colors z-10"
                      style={{ color: role === r.id ? "#fff" : "#94a3b8" }}
                    >
                      {role === r.id && (
                        <motion.div
                          layoutId="activeRole"
                          className="absolute inset-0 rounded-lg shadow-sm"
                          style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <r.icon className={`w-4 h-4 relative z-10 ${role === r.id ? "text-blue-400" : ""}`} />
                      <span className="relative z-10">{r.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">College Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@college.edu"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <Link href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded border-white/10 bg-black/20 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
                      Remember me for 30 days
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden group transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 group-hover:opacity-90 transition-opacity" />
                    {/* Button Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
                    
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          Sign In <LogIn className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Or continue with</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* SSO Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold text-slate-300 hover:text-white transition-all hover:bg-white/5"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold text-slate-300 hover:text-white transition-all hover:bg-white/5"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <svg viewBox="0 0 21 21" className="w-4 h-4">
                      <path fill="#f25022" d="M0 0h10v10H0z" />
                      <path fill="#7fba00" d="M11 0h10v10H11z" />
                      <path fill="#00a4ef" d="M0 11h10v10H0z" />
                      <path fill="#ffb900" d="M11 11h10v10H11z" />
                    </svg>
                    Microsoft
                  </button>
                </div>
              </motion.div>
            ) : (
              // Success State
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/30"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Login Successful</h3>
                <p className="text-slate-400 text-sm">Redirecting to your dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
