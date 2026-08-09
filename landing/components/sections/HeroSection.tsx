"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Users, CheckCircle, BarChart3, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ── Particle Canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
    const colors = ["#2563eb", "#7c3aed", "#06b6d4", "#22c55e"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ── Mini Chart Data ── */
const surveyData: any[] = [];
const activityData: any[] = [];
const pieData: any[] = [];
const PIE_COLORS = ["#2563eb", "#7c3aed", "#22c55e", "#94a3b8"];

/* ── Dashboard Mockup ── */
function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* Glow behind */}
      <div
        className="absolute -inset-4 rounded-3xl blur-3xl opacity-30 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #2563eb40, #7c3aed40, #06b6d440)" }}
      />

      {/* Main Dashboard Frame */}
      <div
        className="relative rounded-2xl overflow-hidden border"
        style={{
          background: "rgba(10,16,28,0.9)",
          borderColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Window Chrome */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          <div
            className="flex-1 mx-4 h-5 rounded text-xs text-slate-500 flex items-center px-2"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            election.campus.io/dashboard
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        <div className="p-4 space-y-4">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Votes", value: "0", icon: CheckCircle, color: "#22c55e", up: "0" },
              { label: "Active Parties", value: "0", icon: Users, color: "#2563eb", up: "0" },
              { label: "Survey Resp.", value: "0", icon: TrendingUp, color: "#7c3aed", up: "0" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="rounded-xl p-3 border"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
                whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  <span className="text-xs font-medium" style={{ color: "#22c55e" }}>
                    {stat.up}
                  </span>
                </div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Bar Chart */}
            <div
              className="rounded-xl p-3 border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-slate-400">Dept. Coverage</span>
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={surveyData} barSize={8}>
                  <Bar dataKey="value" radius={4} fill="#2563eb" opacity={0.85} />
                  <Tooltip
                    contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px", borderRadius: "8px" }}
                    itemStyle={{ color: "#94a3b8" }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div
              className="rounded-xl p-3 border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-slate-400">Vote Share</span>
              </div>
              <div className="flex items-center gap-2">
                <ResponsiveContainer width="60%" height={80}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={36} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-[9px] text-slate-500">{d.name} {d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div
            className="rounded-xl p-3 border"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div className="text-xs font-medium text-slate-400 mb-3">Volunteer Activity This Week</div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="votes" stroke="#7c3aed" strokeWidth={2} fill="url(#actGrad)" dot={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px", borderRadius: "8px" }}
                  itemStyle={{ color: "#94a3b8" }}
                  cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Student Table */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="px-3 py-2 text-xs font-medium text-slate-400 border-b"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              Recent Registrations
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)" }}>
              {([] as any[]).map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 border-b last:border-0"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <div>
                    <div className="text-xs font-medium text-white">{row.name}</div>
                    <div className="text-[9px] text-slate-500">{row.dept} · {row.party}</div>
                  </div>
                  <span
                    className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: row.status === "Active" ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)",
                      color: row.status === "Active" ? "#22c55e" : "#eab308",
                    }}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Glass Cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-6 glass rounded-xl px-3 py-2 border hidden xl:block"
        style={{ borderColor: "rgba(34,197,94,0.3)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-green-400">Live Election</span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">12,847 votes cast</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -left-6 glass rounded-xl px-3 py-2 border hidden xl:block"
        style={{ borderColor: "rgba(37,99,235,0.3)" }}
      >
        <div className="text-xs text-slate-400">AI Prediction</div>
        <div className="text-sm font-bold text-blue-400">Party A leads 38%</div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Hero Section ── */
export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-grid"
      aria-label="Hero section"
    >
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <ParticleCanvas />
        <div
          className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm"
              style={{
                background: "rgba(37,99,235,0.1)",
                borderColor: "rgba(37,99,235,0.3)",
                color: "#60a5fa",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              AI-Powered Platform · Now in Beta
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              AI-Powered{" "}
              <span className="gradient-text">PUCSC Election</span>{" "}
              Management Platform
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-slate-400 leading-relaxed max-w-xl"
            >
              A secure and intelligent platform for managing Panjab University College elections,
              organizing campaign teams, collecting survey responses, and analyzing
              campaign progress through interactive dashboards.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(37,99,235,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white cursor-pointer"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                aria-label="Get started with the platform"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-medium border cursor-pointer transition-all"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#e2e8f0",
                }}
                aria-label="Explore platform features"
              >
                <Play className="w-4 h-4 text-blue-400" />
                Explore Features
              </motion.button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 pt-2"
            >
              {[
                { value: "50+", label: "Colleges" },
                { value: "1M+", label: "Students" },
                { value: "99.9%", label: "Uptime" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">{item.value}</span>
                  <span className="text-sm text-slate-500">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="w-full">
            <DashboardMockup />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #030712)" }}
        aria-hidden="true"
      />
    </section>
  );
}
