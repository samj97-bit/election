"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart3,
  AreaChart as AreaChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  CheckCircle,
  Activity,
  Calendar,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/* ── Mock Data ── */
const deptData = [
  { dept: "CS", surveyed: 420, target: 500, volunteers: 28 },
  { dept: "ECE", surveyed: 310, target: 400, volunteers: 22 },
  { dept: "ME", surveyed: 280, target: 380, volunteers: 18 },
  { dept: "Civil", surveyed: 190, target: 300, volunteers: 14 },
  { dept: "MBA", surveyed: 350, target: 420, volunteers: 25 },
  { dept: "BBA", surveyed: 220, target: 280, volunteers: 16 },
];

const weeklyActivity = [
  { day: "Mon", party_a: 120, party_b: 85, party_c: 65 },
  { day: "Tue", party_a: 185, party_b: 110, party_c: 72 },
  { day: "Wed", party_a: 210, party_b: 145, party_c: 88 },
  { day: "Thu", party_a: 290, party_b: 190, party_c: 105 },
  { day: "Fri", party_a: 340, party_b: 220, party_c: 138 },
  { day: "Sat", party_a: 180, party_b: 130, party_c: 95 },
  { day: "Sun", party_a: 95, party_b: 75, party_c: 58 },
];

const surveyDist = [
  { name: "Completed", value: 68 },
  { name: "Partial", value: 19 },
  { name: "Pending", value: 13 },
];
const PIE_COLORS = ["#2563eb", "#f59e0b", "#ef4444"];

const trendData = Array.from({ length: 14 }, (_, i) => ({
  date: `Aug ${i + 1}`,
  votes: Math.floor(400 + Math.random() * 600 + i * 30),
  surveys: Math.floor(200 + Math.random() * 300 + i * 20),
}));

const heatmap: { dept: string; slots: number[] }[] = [
  { dept: "CS", slots: [8, 6, 9, 7, 10, 5, 3] },
  { dept: "ECE", slots: [5, 7, 6, 8, 9, 4, 2] },
  { dept: "ME", slots: [4, 5, 7, 6, 7, 3, 1] },
  { dept: "Civil", slots: [3, 4, 5, 6, 5, 2, 1] },
  { dept: "MBA", slots: [7, 8, 9, 10, 8, 6, 4] },
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const recentUpdates = [
  { msg: "Party A submitted manifesto", time: "2m ago", type: "success" },
  { msg: "120 survey responses recorded", time: "8m ago", type: "info" },
  { msg: "New volunteer joined ECE batch", time: "15m ago", type: "success" },
  { msg: "Admin approved Party C registration", time: "32m ago", type: "info" },
  { msg: "Dept. coverage target met: CS", time: "1h ago", type: "success" },
];

const tooltipStyle = {
  contentStyle: {
    background: "#0a1628",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "11px",
    borderRadius: "10px",
    color: "#94a3b8",
  },
  itemStyle: { color: "#cbd5e1" },
  cursor: { fill: "rgba(255,255,255,0.03)" },
};

/* ── Chart Card Wrapper ── */
function ChartCard({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function DashboardPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-24 relative" aria-label="Live dashboard preview" ref={ref}>
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            Live Preview
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your{" "}
            <span className="gradient-text">Analytics Dashboard</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            See real-time data visualizations from an actual campaign. Charts, tables,
            and heatmaps — all in one place.
          </p>
        </motion.div>

        {/* Dashboard Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl border overflow-hidden"
          style={{
            background: "rgba(10,16,28,0.95)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "0 60px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Dashboard Header Bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.85 }} />
                ))}
              </div>
              <div
                className="h-6 px-3 rounded text-xs text-slate-500 flex items-center"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                analytics.election.campus.io
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </div>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
                className="p-1 rounded text-slate-500"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Votes Cast", value: "12,847", change: "+4.2%", icon: CheckCircle, color: "#22c55e" },
                { label: "Active Volunteers", value: "1,284", change: "+12", icon: Users, color: "#2563eb" },
                { label: "Survey Completion", value: "68%", change: "+3.1%", icon: TrendingUp, color: "#7c3aed" },
                { label: "Turnout Today", value: "34.2%", change: "+8.4%", icon: Activity, color: "#f59e0b" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    <span className="text-xs font-medium" style={{ color: "#22c55e" }}>{s.change}</span>
                  </div>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Bar: Dept Coverage */}
              <div className="lg:col-span-2">
                <ChartCard title="Department Survey Coverage" icon={BarChart3} color="#2563eb">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={deptData} barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip {...tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                      <Bar dataKey="surveyed" name="Surveyed" fill="#2563eb" radius={[4, 4, 0, 0]} opacity={0.9} />
                      <Bar dataKey="target" name="Target" fill="#7c3aed" radius={[4, 4, 0, 0]} opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Pie: Survey Distribution */}
              <ChartCard title="Survey Status" icon={PieChartIcon} color="#f59e0b">
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={surveyDist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none" paddingAngle={2}>
                        {surveyDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-1.5 w-full mt-1">
                    {surveyDist.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                          <span className="text-xs text-slate-400">{d.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Line: Trend */}
              <div className="lg:col-span-2">
                <ChartCard title="Campaign Activity Trend (14 Days)" icon={AreaChartIcon} color="#7c3aed">
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="survGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip {...tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                      <Area type="monotone" dataKey="votes" name="Votes" stroke="#2563eb" strokeWidth={2} fill="url(#voteGrad)" dot={false} />
                      <Area type="monotone" dataKey="surveys" name="Surveys" stroke="#7c3aed" strokeWidth={2} fill="url(#survGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Recent Updates */}
              <div
                className="rounded-2xl p-5 border"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.3)" }}
                  >
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">Live Updates</span>
                </div>
                <div className="space-y-3">
                  {recentUpdates.map((u, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: u.type === "success" ? "#22c55e" : "#2563eb" }}
                      />
                      <div>
                        <p className="text-xs text-slate-300 leading-snug">{u.msg}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{u.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Volunteer Activity Heatmap */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(6,182,212,0.18)", border: "1px solid rgba(6,182,212,0.3)" }}
                >
                  <Calendar className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm font-semibold text-white">Volunteer Activity Heatmap</span>
                <span className="text-xs text-slate-500 ml-auto">This week</span>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-8 gap-1.5 mb-2 ml-14">
                    {days.map((d) => (
                      <div key={d} className="text-[10px] text-slate-500 text-center">{d}</div>
                    ))}
                  </div>
                  {/* Rows */}
                  {heatmap.map((row) => (
                    <div key={row.dept} className="grid grid-cols-8 gap-1.5 mb-1.5 items-center">
                      <div className="text-[10px] text-slate-500 text-right pr-2 col-span-1">{row.dept}</div>
                      {row.slots.map((val, i) => {
                        const intensity = val / 10;
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.15 }}
                            className="h-7 rounded cursor-pointer"
                            style={{
                              background: `rgba(37,99,235,${0.1 + intensity * 0.8})`,
                              border: `1px solid rgba(37,99,235,${0.1 + intensity * 0.4})`,
                            }}
                            title={`${row.dept} ${days[i]}: ${val * 12} volunteers`}
                          />
                        );
                      })}
                    </div>
                  ))}
                  {/* Legend */}
                  <div className="flex items-center gap-2 mt-3 ml-14">
                    <span className="text-[10px] text-slate-600">Low</span>
                    {[0.15, 0.35, 0.55, 0.75, 0.95].map((op) => (
                      <div key={op} className="w-5 h-3 rounded-sm" style={{ background: `rgba(37,99,235,${op})` }} />
                    ))}
                    <span className="text-[10px] text-slate-600">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Party Activity */}
            <ChartCard title="Weekly Volunteer Activity by Party" icon={Activity} color="#22c55e">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Line type="monotone" dataKey="party_a" name="Party A" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: "#2563eb", r: 3 }} />
                  <Line type="monotone" dataKey="party_b" name="Party B" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 3 }} />
                  <Line type="monotone" dataKey="party_c" name="Party C" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: "#22c55e", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
