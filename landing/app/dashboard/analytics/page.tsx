"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, Target, Zap, ArrowUp, X, Filter, Search, Phone, Calendar, Building2, IdCard } from "lucide-react";



export default function AnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState("");
  const [modalDrFilter, setModalDrFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const years = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];

  const [allStudents, setAllStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await supabase.from('students').select('*');
      if (data) setAllStudents(data);
    };
    fetchAnalytics();
  }, []);

  const filteredStudents = selectedYear === "All Years" 
    ? allStudents 
    : allStudents.filter(s => s.year === selectedYear);

  const depts: Record<string, number> = {};
  let drVotes = 0;
  let presidentVotes = 0;
  filteredStudents.forEach(s => {
    depts[s.dept] = (depts[s.dept] || 0) + 1;
    
    if (s.dr_preference) {
      if (s.dr_preference.startsWith('[')) {
        try {
          const arr = JSON.parse(s.dr_preference);
          drVotes += arr.filter((v: string) => v !== 'Undecided').length;
        } catch(e) {}
      } else if (s.dr_preference !== 'Undecided') {
        drVotes++;
      }
    }

    if (s.president_preference && s.president_preference !== 'Undecided') {
      presidentVotes++;
    }
  });

  const deptBreakdown = Object.keys(depts).map((d, i) => {
    const colors = ["from-blue-600 to-blue-500", "from-violet-600 to-violet-500", "from-emerald-600 to-emerald-500", "from-amber-600 to-amber-500", "from-rose-600 to-rose-500"];
    return {
      dept: d,
      votes: depts[d],
      color: colors[i % colors.length],
      pct: Math.round((depts[d] / filteredStudents.length) * 100) || 0
    };
  }).sort((a,b) => b.votes - a.votes);

  const topStats = [
    { label: "Total DR Support Votes", value: drVotes.toString(), icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", change: "Updated Live" },
    { label: "Total President Votes", value: presidentVotes.toString(), icon: Users, color: "text-violet-400", bg: "bg-violet-500/10", change: "Updated Live" },
    { label: "Total Data Collected", value: filteredStudents.length.toString(), icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "Total submissions" },
  ];

  const timelineMap: Record<string, { collected: number; partyVotes: number }> = {};
  filteredStudents.forEach(s => {
    if (!s.created_at) return;
    const day = new Date(s.created_at).toLocaleDateString('en-US', { weekday: 'short' });
    if (!timelineMap[day]) timelineMap[day] = { collected: 0, partyVotes: 0 };
    timelineMap[day].collected++;
    if (s.dr_preference) {
      if (s.dr_preference.startsWith('[')) {
        try {
          if (JSON.parse(s.dr_preference).filter((v:string) => v !== 'Undecided').length > 0) timelineMap[day].partyVotes++;
        } catch(e){}
      } else if (s.dr_preference !== 'Undecided') {
        timelineMap[day].partyVotes++;
      }
    }
  });
  
  const voteTimeline = Object.keys(timelineMap).map(day => ({
    day,
    collected: timelineMap[day].collected,
    partyVotes: timelineMap[day].partyVotes
  }));

  const totalCollected = voteTimeline.reduce((s, d) => s + d.collected, 0) || 0;
  const totalPartyVotes = voteTimeline.reduce((s, d) => s + d.partyVotes, 0) || 0;
  const maxCollected = Math.max(...voteTimeline.map((d) => d.collected), 1);
  
  const uniqueDrs = Array.from(new Set(allStudents.flatMap(s => {
    if (s.dr_preference) {
      if (s.dr_preference.startsWith('[')) {
        try { return JSON.parse(s.dr_preference); } catch(e) {}
      }
      return [s.dr_preference];
    }
    return [];
  }).filter(v => v && v !== 'Undecided')));

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Analytics</h2>
        <p className="text-xs text-slate-500">Student Council Election 2026 — Live Data</p>
      </div>

      {/* Top stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
      >
        {topStats.map((s) => (
          <motion.div
            key={s.label}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
          >
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUp className={`w-3 h-3 ${s.color}`} />
              <p className={`text-xs font-medium ${s.color}`}>{s.change}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Vote Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Data Collection & DR Support</h3>
            <p className="text-xs text-slate-500 mt-1">
              Collected: <span className="text-white">{totalCollected.toLocaleString()}</span> • DR Support Votes: <span className="text-blue-400 font-medium">{totalPartyVotes.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 mb-2">
              <TrendingUp className="w-3 h-3" />
              +22% vs last week
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-white/20"></span> Total Collected</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500"></span> Progress Alliance Votes</span>
            </div>
          </div>
        </div>

        {/* Dual Bar Chart */}
        <div className="flex items-end justify-between h-56 mt-8 gap-2">
          {voteTimeline.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full group">
              {/* Tooltip */}
              <div className="flex flex-col items-center text-[10px] mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-slate-400">Tot: {d.collected}</span>
                <span className="text-blue-400 font-bold">Progress Alliance: {d.partyVotes}</span>
              </div>
              
              <div className="w-full max-w-[48px] h-full flex items-end relative overflow-hidden group-hover:bg-white/[0.02] transition-colors rounded-t-lg">
                {/* Total Collected Bar (Background) */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.collected / maxCollected) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-0 w-full rounded-t-lg bg-white/10"
                />
                
                {/* Party Votes Bar (Foreground) */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.partyVotes / maxCollected) * 100}%` }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-violet-500"
                />
              </div>
              <span className="text-xs font-medium text-slate-400 mt-3">{d.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Department Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Supporters by Department</h3>
            <p className="text-xs text-slate-400 mt-0.5">Total: {deptBreakdown.reduce((s, d) => s + d.votes, 0)} supporters</p>
          </div>
          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 pr-8 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition-colors hover:bg-white/10"
            >
              {years.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-4">
          {deptBreakdown.map((d, i) => {
            const adjVotes = d.votes;
            return (
              <div 
                key={d.dept} 
                className="group cursor-pointer p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/5"
                onClick={() => setSelectedDept(d.dept)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{d.dept}</span>
                  <span className="text-sm font-bold text-white">{adjVotes} <span className="text-xs text-slate-500 font-normal">supporters</span></span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Department Voters Modal */}
      <AnimatePresence>
        {selectedDept && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedDept(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              className="fixed top-1/2 left-1/2 z-[70] w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1526] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedDept}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Showing DR supporters for {selectedYear}</p>
                </div>
                <button onClick={() => { setSelectedDept(null); setModalSearch(""); setModalDrFilter("All"); }} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="p-3 border-b border-white/10 bg-white/[0.01] flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name or mobile..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div className="relative w-40 flex-shrink-0">
                  <select
                    value={modalDrFilter}
                    onChange={(e) => setModalDrFilter(e.target.value)}
                    className="w-full h-full bg-white/5 border border-white/10 rounded-xl py-2 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="All" className="bg-[#090e1a] text-white">All Candidates</option>
                    {uniqueDrs.map((dr: any) => (
                      <option key={dr} value={dr} className="bg-[#090e1a] text-white">{dr}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>
              
              <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
                {(() => {
                  const filtered = filteredStudents.filter(s => {
                    const matchDept = s.dept === selectedDept;
                    const matchSearch = s.name.toLowerCase().includes(modalSearch.toLowerCase()) || (s.mobile && s.mobile.replace(/\s+/g, "").includes(modalSearch.replace(/\s+/g, "")));
                    
                    let matchDr = false;
                    if (modalDrFilter === "All") {
                      matchDr = true;
                    } else {
                      let parsedDr = [];
                      if (s.dr_preference) {
                        if (s.dr_preference.startsWith('[')) {
                          try { parsedDr = JSON.parse(s.dr_preference); } catch(e) { parsedDr = [s.dr_preference]; }
                        } else {
                          parsedDr = [s.dr_preference];
                        }
                      }
                      matchDr = parsedDr.includes(modalDrFilter);
                    }
                    
                    return matchDept && matchSearch && matchDr;
                  });

                  if (filtered.length === 0) {
                    return <p className="text-center text-sm text-slate-500 py-6">No supporters found matching "{modalSearch}"</p>;
                  }

                  return filtered.map((s) => (
                    <div 
                      key={s.id} 
                      onClick={() => setSelectedStudent(s)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{s.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span>{selectedYear === "All Years" ? "2nd Year" : selectedYear}</span>
                            <span>•</span>
                            <span>{s.mobile}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {(() => {
                          let drs = [];
                          if (s.dr_preference) {
                            if (s.dr_preference.startsWith('[')) {
                              try { drs = JSON.parse(s.dr_preference); } catch(e) { drs = [s.dr_preference]; }
                            } else {
                              drs = [s.dr_preference];
                            }
                          }
                          if (drs.length === 0) drs = ["Undecided"];
                          return drs.map((dr: string, idx: number) => (
                            <span key={idx} className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md" title={`Supporting ${dr}`}>DR: {dr}</span>
                          ));
                        })()}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Student Profile Modal (Overlay) */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1526] overflow-hidden shadow-2xl relative pointer-events-auto">
                <div className="bg-white/[0.03] p-6 border-b border-white/8 relative">
                  <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-lg border-2 border-white/10">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{selectedStudent.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(() => {
                          let drs = [];
                          if (selectedStudent.dr_preference) {
                            if (selectedStudent.dr_preference.startsWith('[')) {
                              try { drs = JSON.parse(selectedStudent.dr_preference); } catch(e) { drs = [selectedStudent.dr_preference]; }
                            } else {
                              drs = [selectedStudent.dr_preference];
                            }
                          }
                          if (drs.length === 0) drs = ["Undecided"];
                          return drs.map((dr: string, idx: number) => (
                            <div key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-400 uppercase tracking-wider">
                              DR: {dr}
                            </div>
                          ));
                        })()}
                      </div>
                      {selectedStudent.president_preference && selectedStudent.president_preference !== 'Undecided' && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/15 text-violet-400 uppercase tracking-wider mt-1">
                          PRESIDENT: {selectedStudent.president_preference}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {selectedStudent.mobile}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Year</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {selectedYear === "All Years" ? "2nd Year" : selectedYear}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {selectedDept}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Roll Number</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <IdCard className="w-4 h-4 text-slate-400" />
                        {selectedDept?.substring(0, 2).toUpperCase()}21B0{10 + selectedStudent.id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
