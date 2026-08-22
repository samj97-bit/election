"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  PlusCircle,
  Search,
  Trash2,
  Phone,
  Mail,
  IdCard,
  Building2,
  X,
  User,
  UserCheck,
  UserX,
  Filter,
  CheckCircle2,
  Copy,
  Loader2,
} from "lucide-react";

const statusColor: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Inactive: "bg-slate-500/15 text-slate-400 border border-slate-500/20",
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", roll: "", mobile: "", email: "", dept: "", year: "", task: "", friends: [] as any[] });
  const [generatedCredentials, setGeneratedCredentials] = useState<{email: string, password: string, hashedPasswordDebug?: string} | null>(null);
  const [activeFriendSearch, setActiveFriendSearch] = useState<number | null>(null);
  const [allStudentsList, setAllStudentsList] = useState<any[]>([]);

  const [partyId, setPartyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        let { data: profile } = await supabase.from('profiles').select('party_id').eq('user_id', userData.user.id).maybeSingle();
        
        let pId = profile?.party_id;
        
        if (!pId) {
          const { data: parties } = await supabase.from('parties').select('id').limit(1);
          if (parties && parties.length > 0) {
            pId = parties[0].id;
            await supabase.from('profiles').upsert({ user_id: userData.user.id, party_id: pId });
          }
        }

        if (pId) {
          setPartyId(pId);
          const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .eq('party_id', pId)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error("Error fetching volunteers:", error);
          }
          if (data) setVolunteers(data);
          
          // Fetch all students silently in the background for the search dropdown
          fetch('/api/students/all')
            .then(res => res.json())
            .then(allStudentsRes => {
              if (allStudentsRes && allStudentsRes.success) {
                setAllStudentsList(allStudentsRes.students);
              }
            })
            .catch(console.error);
        }
      }
      setLoading(false);
    };
    fetchVolunteers();
  }, []);

  const handleAddVolunteer = async () => {
    if (!formData.name || !formData.email) {
      alert("Name and email are required.");
      return;
    }
    if (!partyId) {
      alert("Your account is not assigned to a party. Cannot add volunteer.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, party_id: partyId })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCredentials(data.credentials);
        if (data.volunteer) {
          setVolunteers(prev => [data.volunteer, ...prev]);
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add volunteer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setFormData({ name: "", roll: "", mobile: "", email: "", dept: "", year: "", task: "", friends: [] });
      setGeneratedCredentials(null);
    }, 200);
  };

  const filtered = volunteers.filter((v) => {
    const matchSearch =
      (v.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.department || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.tasks || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || v.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    await supabase.from('volunteers').update({ status: newStatus }).eq('id', id);
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  const remove = async (id: string) => {
    await supabase.from('volunteers').delete().eq('id', id);
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
  };

  const activeCount = volunteers.filter((v) => v.status === "Active").length;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Volunteers</h2>
          <p className="text-xs text-slate-500">
            <span className="text-emerald-400 font-semibold">{activeCount} active</span> · {volunteers.length} total
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add Volunteer
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, dept or task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
          {(["All", "Active", "Inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Volunteer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll / Dept</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Connections</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <motion.tr
                key={v.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {(v.name || "Unknown").split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-white">{v.name || "Unknown"}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                    <IdCard className="w-3 h-3" /> {v.roll}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building2 className="w-3 h-3" /> {v.department}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                    <Phone className="w-3 h-3" /> {v.mobile}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail className="w-3 h-3" /> {v.email}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-slate-400">{v.tasks}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex -space-x-2">
                    {v.friends && v.friends.length > 0 ? (
                      <>
                        {v.friends.slice(0, 3).map((f: any, i: number) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0d1526] flex items-center justify-center text-[9px] font-bold text-white z-10" title={f.roll}>
                            {(f.roll || "???").slice(-3)}
                          </div>
                        ))}
                        {v.friends.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0d1526] flex items-center justify-center text-[9px] font-bold text-slate-400 z-0">
                            +{v.friends.length - 3}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-slate-600">-</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[v.status] || statusColor['Active']}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleStatus(v.id, v.status)}
                      title={v.status === "Active" ? "Deactivate" : "Activate"}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      {v.status === "Active"
                        ? <UserX className="w-4 h-4 text-rose-400" />
                        : <UserCheck className="w-4 h-4 text-emerald-400" />
                      }
                    </button>
                    <button
                      onClick={() => remove(v.id)}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-colors text-slate-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-500 text-sm">No volunteers found</div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1526] p-6 shadow-2xl">
                {generatedCredentials ? (
                  <div className="flex flex-col items-center text-center space-y-4 py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Volunteer Added Successfully!</h3>
                      <p className="text-sm text-slate-400">
                        Login credentials have been generated and securely hashed in the database.
                      </p>
                    </div>
                    
                    <div className="w-full bg-black/30 border border-white/5 rounded-xl p-4 mt-4 text-left space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">Email</span>
                        <div className="text-sm text-white font-medium bg-white/5 px-3 py-2 rounded-lg border border-white/5 flex justify-between items-center">
                          {generatedCredentials.email}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">Generated Password</span>
                        <div className="text-sm text-white font-mono bg-white/5 px-3 py-2 rounded-lg border border-white/5 flex justify-between items-center group">
                          {generatedCredentials.password}
                          <button 
                            onClick={() => navigator.clipboard.writeText(generatedCredentials.password)}
                            className="text-slate-500 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={closeModal}
                      className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold text-white">Add New Volunteer</h3>
                      <button onClick={closeModal} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/15">
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "name", label: "Full Name", icon: User, placeholder: "Volunteer Name", type: "text", fullWidth: true },
                        { id: "roll", label: "Roll Number", icon: IdCard, placeholder: "e.g. CS22B001", type: "text" },
                        { 
                          id: "dept", label: "Department", icon: Building2, type: "select", 
                          options: ["Computer Science", "Information Technology", "UILS", "Electronics & Comm.", "Mechanical Engg.", "Civil Engineering", "Biotechnology", "Others"] 
                        },
                        { 
                          id: "year", label: "Year", icon: IdCard, type: "select", 
                          options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Ph.D./PG"] 
                        },
                        { id: "mobile", label: "Mobile", icon: Phone, placeholder: "+91", type: "tel" },
                        { 
                          id: "task", label: "Task Assignment", icon: UserCheck, type: "select", 
                          options: ["Campus Outreach", "Social Media", "Poster Distribution", "Voter Registration", "Event Management", "Data Collection", "Unassigned"]
                        },
                        { id: "email", label: "Email", icon: Mail, placeholder: "volunteer@college.edu", type: "email", fullWidth: true },
                      ].map((f) => (
                        <div key={f.label} className={`space-y-1 ${f.fullWidth ? 'col-span-2' : 'col-span-1'}`}>
                          <label className="text-xs font-semibold text-slate-400">{f.label}</label>
                          <div className="relative">
                            <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            {f.type === 'select' ? (
                              <select
                                value={formData[f.id as keyof typeof formData]}
                                onChange={(e) => setFormData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer appearance-none"
                              >
                                <option value="" disabled className="bg-[#0a0f1c] text-slate-500">Select {f.label}</option>
                                {f.options?.map(opt => (
                                  <option key={opt} value={opt} className="bg-[#0a0f1c] text-white">{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={f.type}
                                placeholder={f.placeholder}
                                value={formData[f.id as keyof typeof formData]}
                                onChange={(e) => setFormData(prev => ({ ...prev, [f.id]: e.target.value }))}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                        
                        {/* Dynamic Relationships UI for Volunteer */}
                        <div className="col-span-2 space-y-3 pt-2 border-t border-white/5 mt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-white">Friend Circle & Relationships</label>
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, friends: [...formData.friends, { roll: "", type: "friend" }]})}
                              className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            >
                              + Add Connection
                            </button>
                          </div>
                          {formData.friends.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No relationships added yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {formData.friends.map((friend, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <div className="relative flex-1">
                                    <input 
                                      type="text" placeholder="Search name or roll no..."
                                      value={friend.roll}
                                      onFocus={() => setActiveFriendSearch(idx)}
                                      onChange={(e) => {
                                        const newFriends = [...formData.friends];
                                        newFriends[idx] = { ...newFriends[idx], roll: e.target.value };
                                        setFormData({...formData, friends: newFriends});
                                      }}
                                      onBlur={() => setTimeout(() => setActiveFriendSearch(null), 200)}
                                      className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500/50"
                                    />
                                    {activeFriendSearch === idx && (
                                      <div className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[#0d1526] border border-white/10 rounded-xl shadow-2xl z-50">
                                        {allStudentsList
                                          .filter(s => 
                                            (s.name || "").toLowerCase().includes((friend.roll || "").toLowerCase()) || 
                                            (s.roll || "").toLowerCase().includes((friend.roll || "").toLowerCase())
                                          )
                                          .slice(0, 10)
                                          .map(s => (
                                            <div 
                                              key={s.id}
                                              onClick={() => {
                                                const newFriends = [...formData.friends];
                                                newFriends[idx] = { ...newFriends[idx], roll: s.roll };
                                                setFormData({...formData, friends: newFriends});
                                                setActiveFriendSearch(null);
                                              }}
                                              className="px-3 py-2 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                                            >
                                              <div className="text-sm font-semibold text-white">{s.name}</div>
                                              <div className="text-[10px] text-slate-400 flex flex-wrap gap-1.5 mt-0.5">
                                                <span className="text-blue-400 font-medium">{s.roll}</span>
                                                <span>•</span>
                                                <span>{s.dept}</span>
                                                <span>•</span>
                                                <span>{s.year}</span>
                                              </div>
                                            </div>
                                        ))}
                                        {allStudentsList.filter(s => (s.name || "").toLowerCase().includes((friend.roll || "").toLowerCase()) || (s.roll || "").toLowerCase().includes((friend.roll || "").toLowerCase())).length === 0 && (
                                          <div className="px-3 py-3 text-xs text-slate-500 italic text-center">No students found.</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <select
                                    value={friend.type}
                                    onChange={(e) => {
                                      const newFriends = [...formData.friends];
                                      newFriends[idx] = { ...newFriends[idx], type: e.target.value };
                                      setFormData({...formData, friends: newFriends});
                                    }}
                                    className="w-32 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500/50"
                                  >
                                    <option value="friend" className="bg-[#090e1a]">Friend</option>
                                    <option value="boyfriend" className="bg-[#090e1a]">Boyfriend</option>
                                    <option value="girlfriend" className="bg-[#090e1a]">Girlfriend</option>
                                    <option value="roommate" className="bg-[#090e1a]">Roommate</option>
                                    <option value="other" className="bg-[#090e1a]">Other</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFriends = formData.friends.filter((_, i) => i !== idx);
                                      setFormData({...formData, friends: newFriends});
                                    }}
                                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      <button 
                        onClick={handleAddVolunteer}
                        disabled={isSubmitting}
                        className="w-full mt-2 flex items-center justify-center py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed col-span-2"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Volunteer"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
