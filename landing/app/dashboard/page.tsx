"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Users,
  UserCheck,
  TrendingUp,
  Clock,
  Activity,
  PlusCircle,
  ArrowUpRight,
  Flame,
  Target,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";



const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const router = useRouter();
  
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [activeVolunteersCount, setActiveVolunteersCount] = useState(0);
  
  const [votesByDept, setVotesByDept] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const [electionDate, setElectionDate] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [tempDate, setTempDate] = useState("");
  
  // Real user data states
  const [adminName, setAdminName] = useState("Admin");
  const [electionInfo, setElectionInfo] = useState("Election 2026");
  const [partyId, setPartyId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('electionDate');
      if (stored) setElectionDate(stored);
    }
    
    const fetchDashboardData = async () => {
      // 1. Fetch Auth & Profile & Party
      const { data: userData } = await supabase.auth.getUser();
      let userPartyId = null;
      if (userData?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, party_id, parties(election_name, college)')
          .eq('user_id', userData.user.id)
          .maybeSingle();
          
        if (profile) {
          userPartyId = profile.party_id;
          setAdminName(profile.full_name);
          setPartyId(userPartyId);
          // @ts-ignore
          if (profile.parties) {
             // @ts-ignore
            setElectionInfo(`${profile.parties.election_name} - ${profile.parties.college}`);
          }
        }
      }

      // 2. Fetch Stats filtered by party_id (if applicable)
      const studentsQuery = supabase.from('students').select('*');
      const candidatesQuery = supabase.from('candidates').select('id');
      const volunteersQuery = supabase.from('volunteers').select('id, status');

      if (userPartyId) {
        // Assuming students and candidates have party_id. If not, this might fail, but volunteers definitely does.
        volunteersQuery.eq('party_id', userPartyId);
      }

      const [studentsRes, candidatesRes, volunteersRes] = await Promise.all([
        studentsQuery,
        candidatesQuery,
        volunteersQuery
      ]);

      const students = studentsRes.data || [];
      const candidates = candidatesRes.data || [];
      const volunteers = volunteersRes.data || [];

      const activeVolunteers = volunteers.filter(v => v.status === 'Active').length;

      const depts: Record<string, number> = {};
      students.forEach(s => {
        depts[s.dept] = (depts[s.dept] || 0) + 1;
      });
      
      const deptList = Object.keys(depts).map(d => ({
         dept: d,
         votes: depts[d],
         pct: students.length > 0 ? Math.round((depts[d] / students.length) * 100) : 0
      })).sort((a,b) => b.votes - a.votes);
      
      setVotesByDept(deptList);
      setTotalVotes(students.length);
      
      setTotalStudents(students.length);
      setTotalCandidates(candidates.length);
      setTotalVolunteers(volunteers.length);
      setActiveVolunteersCount(activeVolunteers);
    };
    fetchDashboardData();
  }, []);

  let daysValue = "TBD";
  let changeValue = "Not Scheduled";
  if (electionDate) {
    const diff = new Date(electionDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) {
      daysValue = "Ended";
      changeValue = "Election Over";
    } else {
      daysValue = days.toString();
      changeValue = `Ends ${new Date(electionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  }

  const saveSchedule = () => {
    if (tempDate) {
      localStorage.setItem('electionDate', tempDate);
      setElectionDate(tempDate);
      setShowScheduleModal(false);
    }
  };

  const stats = [
    {
      label: "Total Data Collected",
      value: totalStudents.toString(),
      change: "Live updates",
      positive: true,
      href: "/dashboard/students",
      icon: TrendingUp,
      color: "blue",
      gradient: "from-blue-600/20 to-blue-600/5",
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Candidates",
      value: totalCandidates.toString(),
      change: "All registered",
      positive: true,
      href: "/dashboard/candidates",
      icon: Users,
      color: "violet",
      gradient: "from-violet-600/20 to-violet-600/5",
      border: "border-violet-500/20",
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      label: "Volunteers",
      value: totalVolunteers.toString(),
      change: `${activeVolunteersCount} active`,
      positive: true,
      href: "/dashboard/volunteers",
      icon: UserCheck,
      color: "emerald",
      gradient: "from-emerald-600/20 to-emerald-600/5",
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Days Remaining",
      value: daysValue,
      change: changeValue,
      positive: false,
      onClick: () => setShowScheduleModal(true),
      icon: Clock,
      color: "amber",
      gradient: "from-amber-600/20 to-amber-600/5",
      border: "border-amber-500/20",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 p-5"
      >
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Election Live</span>
            </div>
            <h2 className="text-xl font-bold text-white">Welcome back, {adminName.split(' ')[0]} 👋</h2>
            <p className="text-sm text-slate-400 mt-0.5">{electionInfo}</p>
          </div>
          <div className="flex gap-2">

            <Link
              href="/dashboard/analytics" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors border border-white/10"
            >
              <Target className="w-4 h-4" />
              View Analytics
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            onClick={() => {
              if (s.href) router.push(s.href);
              else if (s.onClick) s.onClick();
            }}
            className={`relative overflow-hidden rounded-2xl border ${s.border} bg-gradient-to-br ${s.gradient} p-5 group transition-transform duration-200 ${(s.href || s.onClick) ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                <s.icon className={`w-4.5 h-4.5 ${s.iconColor}`} />
              </div>
              <ArrowUpRight className={`w-4 h-4 ${s.positive ? s.iconColor : "text-slate-600"} opacity-0 ${s.href ? 'group-hover:opacity-100' : ''} transition-opacity`} />
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-xs mt-1 font-medium ${s.positive ? s.iconColor : "text-amber-400"}`}>{s.change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Section */}
      <div className="w-full">
        {/* Votes by Department */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl border border-white/8 bg-white/[0.03] p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Votes by Department</h3>
            <span className="text-xs text-slate-500">Total: {totalVotes}</span>
          </div>
          <div className="space-y-3.5">
            {votesByDept.map((d, i) => (
              <div key={d.dept}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-300">{d.dept}</span>
                  <span className="text-xs text-slate-500">{d.votes} votes</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowScheduleModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[#0d1526] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Set Election Date</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 mb-2">Select Date</label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={e => setTempDate(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-text [color-scheme:dark]"
                />
              </div>
              
              <button
                onClick={saveSchedule}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
              >
                Save Schedule
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
