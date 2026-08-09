"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  IdCard,
  Building2,
  X,
  User,
  Target,
  TrendingUp,
  Activity,
  BarChart3,
  CheckCircle2,
  Award,
  Upload
} from "lucide-react";

const statusColor: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supporters, setSupporters] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [analyticsCandidate, setAnalyticsCandidate] = useState<any>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const { data } = await supabase.from('candidates').select('*').order('created_at', { ascending: false });
      if (data) setCandidates(data);
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (analyticsCandidate) {
      supabase.from('students')
        .select('*')
        .eq('dr_preference', analyticsCandidate.name)
        .order('id', { ascending: false })
        .then(({data}) => {
          if (data) setSupporters(data);
        });
    }
  }, [analyticsCandidate]);

  const [activeDrillDown, setActiveDrillDown] = useState<string | null>(null);
  
  const [photoUrl, setPhotoUrl] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([""]);
  const [promises, setPromises] = useState<string[]>([""]);
  const [pastWork, setPastWork] = useState<string[]>([""]);
  
  const [activeSuggestion, setActiveSuggestion] = useState<{type: 'keyPoints' | 'promises' | 'pastWork', index: number} | null>(null);

  const SUGGESTIONS = {
    keyPoints: ["Strong leadership skills", "Passionate about student welfare", "Excellent communication", "Technical expertise"],
    promises: ["Extend library hours during midterms", "Improve hostel Wi-Fi stability", "Organize monthly tech seminars", "Better sports equipment funding"],
    pastWork: ["Organized Techfest 2024", "Class Representative (3rd Year)", "Led the College Debating Society", "Volunteered for NSS"]
  };

  const [supporterSearch, setSupporterSearch] = useState("");
  const [supporterYearFilter, setSupporterYearFilter] = useState("All");
  const [supporterDeptFilter, setSupporterDeptFilter] = useState("All");
  const [supporterHostelFilter, setSupporterHostelFilter] = useState("All");
  const [supporterGenderFilter, setSupporterGenderFilter] = useState("All");
  const [formPosition, setFormPosition] = useState("");
  const [formError, setFormError] = useState("");

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dept.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase())
  );

  const remove = async (id: string) => {
    await supabase.from('candidates').delete().eq('id', id);
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const openEdit = (c: any) => {
    setEditingCandidate(c);
    setPhotoUrl(c?.photo_url || "");
    setKeyPoints(c?.key_points?.length ? c.key_points : [""]);
    setPromises(c?.promises?.length ? c.promises : [""]);
    setPastWork(c?.past_work?.length ? c.past_work : [""]);
    setFormPosition(c?.position || "Department Representative");
    setFormError("");
    setShowModal(true);
  };
  
  const closeEdit = () => {
    setShowModal(false);
    setTimeout(() => {
      setEditingCandidate(null);
      setFormPosition("");
      setPhotoUrl("");
      setKeyPoints([""]);
      setPromises([""]);
      setPastWork([""]);
      setFormError("");
    }, 200);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const newCandidate = {
      name: form.get("name") as string,
      photo_url: photoUrl,
      position: "Department Representative",
      department: form.get("department") as string,
      year: form.get("year") as string,
      status: form.get("status") as string || "Active",
      key_points: keyPoints.filter(k => k.trim() !== ""),
      promises: promises.filter(p => p.trim() !== ""),
      past_work: pastWork.filter(p => p.trim() !== "")
    };

    if (editingCandidate?.id) {
       await supabase.from('candidates').update(newCandidate).eq('id', editingCandidate.id);
       setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? { ...c, ...newCandidate } : c));
    } else {
       const { data } = await supabase.from('candidates').insert([newCandidate]).select();
       if (data) setCandidates([data[0], ...candidates]);
    }
    closeEdit();
  };

  const updateArrayField = (setter: any, index: number, value: string) => {
    setter((prev: string[]) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  const addArrayField = (setter: any) => {
    setter((prev: string[]) => [...prev, ""]);
  };

  const removeArrayField = (setter: any, index: number) => {
    setter((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Candidates</h2>
          <p className="text-xs text-slate-500">{candidates.length} registered candidates</p>
        </div>
        <button
          onClick={() => openEdit(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, dept or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <motion.div
        className="grid grid-cols-2 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
      >
        {filtered.map((c) => (
          <motion.div
            key={c.id}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            onClick={() => setAnalyticsCandidate(c)}
            className="group relative rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.05] p-5 transition-all duration-200 cursor-pointer"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); openEdit(c); }} 
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-blue-600/30 flex items-center justify-center transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-blue-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); remove(c.id); }}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className={`relative w-28 h-28 rounded-2xl bg-gradient-to-br ${c.avatarGrad || 'from-slate-500 to-slate-700'} flex items-center justify-center flex-shrink-0 text-3xl font-bold text-white shadow-lg overflow-hidden`}>
                {c.photo ? (
                  <Image src={c.photo} alt={c.name} fill className="object-cover object-top" />
                ) : (
                  c.name.split(' ').map((n: string) => n[0]).join('')
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white truncate">{c.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColor[c.status] || statusColor['Active']}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-blue-400 mb-2">{c.position}</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <IdCard className="w-3 h-3" />
                    <span>{c.roll}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{c.dept}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Phone className="w-3 h-3" />
                    <span>{c.mobile}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{c.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Votes received</span>
                <span className="text-xs font-bold text-white">{c.votes || 0}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.votes / 500) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEdit}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <form onSubmit={handleSave} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1526] p-6 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-white">{editingCandidate ? "Edit Candidate" : "Add New Candidate"}</h3>
                  <button type="button" onClick={closeEdit} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/15">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-1">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Candidate Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input name="name" type="text" placeholder="Full Name" defaultValue={editingCandidate?.name || ""} className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" required />
                    </div>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Photo URL</label>
                    <div className="relative">
                      <input type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://example.com/photo.jpg" className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
                    </div>
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Position</label>
                    <div className="relative">
                      <input type="text" value="Department Representative" disabled className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-500 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Department</label>
                    <select name="department" defaultValue={editingCandidate?.department || "Computer Science"} className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer appearance-none">
                      <option value="Computer Science" className="bg-[#0a0f1c]">Computer Science</option>
                      <option value="Electronics & Comm." className="bg-[#0a0f1c]">Electronics & Comm.</option>
                      <option value="Mechanical Engg." className="bg-[#0a0f1c]">Mechanical Engg.</option>
                      <option value="Civil Engineering" className="bg-[#0a0f1c]">Civil Engineering</option>
                    </select>
                  </div>
                  
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Year</label>
                    <select name="year" defaultValue={editingCandidate?.year || "3rd Year"} className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer appearance-none">
                      <option value="1st Year" className="bg-[#0a0f1c]">1st Year</option>
                      <option value="2nd Year" className="bg-[#0a0f1c]">2nd Year</option>
                      <option value="3rd Year" className="bg-[#0a0f1c]">3rd Year</option>
                      <option value="4th Year" className="bg-[#0a0f1c]">4th Year</option>
                    </select>
                  </div>

                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Status</label>
                    <select name="status" defaultValue={editingCandidate?.status || "Active"} className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer appearance-none">
                      <option value="Active" className="bg-[#0a0f1c]">Active</option>
                      <option value="Inactive" className="bg-[#0a0f1c]">Inactive</option>
                    </select>
                  </div>

                  {/* Rich Fields */}
                  <div className="col-span-2 mt-4 space-y-4 border-t border-white/10 pt-4">
                    {/* Key Points */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-400">Key Points / Bio</label>
                        <button type="button" onClick={() => addArrayField(setKeyPoints)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add</button>
                      </div>
                      <div className="space-y-2">
                        {keyPoints.map((val, i) => (
                          <div key={`kp-${i}`} className="relative flex gap-2">
                            <input type="text" value={val} onChange={(e) => updateArrayField(setKeyPoints, i, e.target.value)} onFocus={() => setActiveSuggestion({type: 'keyPoints', index: i})} onBlur={() => setTimeout(() => setActiveSuggestion(null), 200)} placeholder="e.g. Excellent communication skills" className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                            <button type="button" onClick={() => removeArrayField(setKeyPoints, i)} className="text-slate-500 hover:text-red-400 p-2"><X className="w-4 h-4"/></button>
                            
                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                              {activeSuggestion?.type === 'keyPoints' && activeSuggestion.index === i && (
                                <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute top-full left-0 right-10 mt-1 bg-[#1a2333] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                  {SUGGESTIONS.keyPoints.map(sug => (
                                    <div key={sug} onClick={() => updateArrayField(setKeyPoints, i, sug)} className="px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white cursor-pointer transition-colors">{sug}</div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promises */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-400">Promises</label>
                        <button type="button" onClick={() => addArrayField(setPromises)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add</button>
                      </div>
                      <div className="space-y-2">
                        {promises.map((val, i) => (
                          <div key={`pr-${i}`} className="relative flex gap-2">
                            <input type="text" value={val} onChange={(e) => updateArrayField(setPromises, i, e.target.value)} onFocus={() => setActiveSuggestion({type: 'promises', index: i})} onBlur={() => setTimeout(() => setActiveSuggestion(null), 200)} placeholder="e.g. Extend library hours" className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                            <button type="button" onClick={() => removeArrayField(setPromises, i)} className="text-slate-500 hover:text-red-400 p-2"><X className="w-4 h-4"/></button>
                            
                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                              {activeSuggestion?.type === 'promises' && activeSuggestion.index === i && (
                                <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute top-full left-0 right-10 mt-1 bg-[#1a2333] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                  {SUGGESTIONS.promises.map(sug => (
                                    <div key={sug} onClick={() => updateArrayField(setPromises, i, sug)} className="px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white cursor-pointer transition-colors">{sug}</div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Past Work */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-400">Past Work</label>
                        <button type="button" onClick={() => addArrayField(setPastWork)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><PlusCircle className="w-3 h-3"/> Add</button>
                      </div>
                      <div className="space-y-2">
                        {pastWork.map((val, i) => (
                          <div key={`pw-${i}`} className="relative flex gap-2">
                            <input type="text" value={val} onChange={(e) => updateArrayField(setPastWork, i, e.target.value)} onFocus={() => setActiveSuggestion({type: 'pastWork', index: i})} onBlur={() => setTimeout(() => setActiveSuggestion(null), 200)} placeholder="e.g. Organized Techfest" className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500/50" />
                            <button type="button" onClick={() => removeArrayField(setPastWork, i)} className="text-slate-500 hover:text-red-400 p-2"><X className="w-4 h-4"/></button>
                            
                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                              {activeSuggestion?.type === 'pastWork' && activeSuggestion.index === i && (
                                <motion.div initial={{opacity:0, y:-5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="absolute top-full left-0 right-10 mt-1 bg-[#1a2333] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                  {SUGGESTIONS.pastWork.map(sug => (
                                    <div key={sug} onClick={() => updateArrayField(setPastWork, i, sug)} className="px-3 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-white cursor-pointer transition-colors">{sug}</div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <div className="col-span-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-semibold text-red-400 flex items-center justify-center gap-2 mt-2">
                      <X className="w-4 h-4" />
                      {formError}
                    </div>
                  )}
                  <button type="submit" className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors col-span-2 shadow-lg shadow-blue-500/20">
                    {editingCandidate ? "Save Changes" : "Add Candidate"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {analyticsCandidate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setAnalyticsCandidate(null); setActiveDrillDown(null); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 custom-scrollbar flex flex-col md:flex-row"
            >
              <button
                onClick={() => { setAnalyticsCandidate(null); setActiveDrillDown(null); }}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activeDrillDown && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute inset-0 bg-[#0a0f1c]/95 backdrop-blur-xl z-30 flex flex-col rounded-3xl overflow-hidden"
                  >
                    <div className="p-6 border-b border-white/10 flex flex-wrap items-center gap-4 bg-white/[0.02]">
                      <button onClick={() => setActiveDrillDown(null)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-[200px]">
                        <h3 className="text-lg font-bold text-white truncate">Supporters</h3>
                        <p className="text-xs text-slate-400">{analyticsCandidate.name}</p>
                      </div>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="pb-3 px-2">Student</th>
                            <th className="pb-3 px-2">Roll No.</th>
                            <th className="pb-3 px-2">Mobile</th>
                            <th className="pb-3 px-2">Year</th>
                            <th className="pb-3 px-2">Department</th>
                            <th className="pb-3 px-2">Hostel</th>
                            <th className="pb-3 px-2">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supporters
                            .filter(s => activeDrillDown === 'total_votes' || s.type === 'recent')
                            .filter(s => supporterGenderFilter === "All" || s.gender === supporterGenderFilter)
                            .filter(s => supporterYearFilter === "All" || s.year === supporterYearFilter)
                            .filter(s => supporterDeptFilter === "All" || s.dept === supporterDeptFilter)
                            .filter(s => supporterHostelFilter === "All" || s.hostel.startsWith(supporterHostelFilter))
                            .filter(s => 
                              s.name.toLowerCase().includes(supporterSearch.toLowerCase()) || 
                              s.roll.toLowerCase().includes(supporterSearch.toLowerCase()) || 
                              s.mobile.replace(/\s/g, '').includes(supporterSearch.replace(/\s/g, ''))
                            )
                            .map((s, i) => (
                            <motion.tr 
                              key={s.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="py-4 px-2">
                                <div className="text-sm font-bold text-white">{s.name}</div>
                              </td>
                              <td className="py-4 px-2">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                                  s.gender === 'Male' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                  s.gender === 'Female' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 
                                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                }`}>
                                  {s.gender}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-sm font-medium text-indigo-300">{s.roll}</td>
                              <td className="py-4 px-2 text-sm text-slate-300 tracking-wide">{s.mobile}</td>
                              <td className="py-4 px-2">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20 whitespace-nowrap">
                                  {s.year}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-sm text-slate-300 truncate max-w-[150px]">
                                {s.dept}
                              </td>
                              <td className="py-4 px-2 text-sm font-medium text-amber-400/90">{s.hostel}</td>
                              <td className="py-4 px-2">
                                <span className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 whitespace-nowrap">
                                  {s.date}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Left Column: Profile Overview */}
              <div className="w-full md:w-1/3 p-6 md:p-8 bg-white/[0.02] border-r border-white/5">
                <div className="flex flex-col items-center text-center mb-6">
                  <div 
                    onClick={() => setActiveDrillDown('photo')}
                    className={`relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden mb-4 border-2 border-white/10 cursor-pointer hover:scale-105 transition-transform duration-300 group`}
                  >
                    {analyticsCandidate.photo_url ? (
                      <img src={analyticsCandidate.photo_url} alt={analyticsCandidate.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      analyticsCandidate.name.split(" ").map((n: string) => n[0]).join("")
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border mb-2 ${statusColor[analyticsCandidate.status] || "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                    {analyticsCandidate.status}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{analyticsCandidate.name}</h3>
                  <p className="text-sm font-medium text-blue-400">{analyticsCandidate.position}</p>
                </div>

                <div className="space-y-4">
                  {/* Platform & Background */}
                  {(analyticsCandidate.key_points?.length > 0) && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Key Points & Bio</p>
                      <ul className="space-y-1">
                        {analyticsCandidate.key_points.map((kp: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-blue-400 mt-1">•</span> <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(analyticsCandidate.promises?.length > 0) && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Promises</p>
                      <ul className="space-y-1">
                        {analyticsCandidate.promises.map((pr: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-emerald-400 mt-1">•</span> <span>{pr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(analyticsCandidate.past_work?.length > 0) && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Past Work</p>
                      <ul className="space-y-1">
                        {analyticsCandidate.past_work.map((pw: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-violet-400 mt-1">•</span> <span>{pw}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Analytics Data */}
              <div className="w-full md:w-2/3 p-6 md:p-8 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Candidate Analytics
                </h3>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setActiveDrillDown('total_votes')}
                    className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 cursor-pointer hover:bg-blue-500/10 hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Total Votes Received</p>
                    </div>
                    <p className="text-3xl font-black text-white">{analyticsCandidate.votes}</p>
                    <p className="text-xs text-slate-400 mt-1">Goal: 1000 votes</p>
                  </div>
                  <div 
                    onClick={() => setActiveDrillDown('momentum')}
                    className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10 hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Recent Momentum</p>
                    </div>
                    <p className="text-3xl font-black text-white">+84</p>
                    <p className="text-xs text-slate-400 mt-1">Votes collected in last 48 hrs</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white">Campaign Goal Progress</p>
                      <p className="text-xs text-slate-400">{(analyticsCandidate.votes / 1000 * 100).toFixed(1)}% achieved</p>
                    </div>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(analyticsCandidate.votes / 1000) * 100}%` }} 
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Vote Distribution */}
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <p className="text-sm font-semibold text-white">Vote Distribution by Department</p>
                  </div>
                  <div className="space-y-4">
                    {(() => {
                      const deptMap: Record<string, number> = {};
                      supporters.forEach(s => { deptMap[s.dept] = (deptMap[s.dept] || 0) + 1; });
                      const departmentDistribution = Object.keys(deptMap).map(dept => ({
                        dept,
                        count: deptMap[dept],
                        pct: Math.round((deptMap[dept] / (supporters.length || 1)) * 100)
                      })).sort((a, b) => b.count - a.count);
                      
                      if (departmentDistribution.length === 0) return <p className="text-xs text-slate-500">No supporters yet</p>;

                      return departmentDistribution.map((d, i) => (
                      <div key={d.dept}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-300 font-medium">{d.dept}</span>
                          <span className="text-slate-400">{d.pct}% ({d.count} votes)</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${d.pct}%` }} 
                            transition={{ duration: 0.8, delay: 0.3 + (i * 0.1) }}
                            className="h-full bg-blue-500/80 rounded-full"
                          />
                        </div>
                      </div>
                    ))})()}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full screen lightbox */}
      <AnimatePresence>
        {activeDrillDown === 'photo' && analyticsCandidate && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrillDown(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
            />
            <button
              onClick={() => setActiveDrillDown(null)}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl aspect-square md:aspect-[3/4] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              {analyticsCandidate.photo_url ? (
                <img src={analyticsCandidate.photo_url} alt={analyticsCandidate.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-8xl font-bold text-white`}>
                  {analyticsCandidate.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
