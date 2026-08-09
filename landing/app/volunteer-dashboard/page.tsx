"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PlusCircle,
  Phone,
  Mail,
  IdCard,
  Building2,
  User,
  X,
  MapPin,
  Home,
  Calendar,
} from "lucide-react";

const HOSTELS_LIST = [
  ...Array.from({length: 8}, (_, i) => `Boys Hostel ${i + 1}`),
  ...Array.from({length: 11}, (_, i) => `Girls Hostel ${i + 1}`),
  "Day Scholar"
];

export default function VolunteerStudentDataPage() {
  const [volunteerName, setVolunteerName] = useState("");
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const drOptions = [...candidatesList.map(c => c.name), "Undecided"];

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ 
    name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: "Undecided" 
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Get Volunteer details
      try {
        const res = await fetch('/api/auth/volunteer/me');
        if (res.ok) {
          const data = await res.json();
          const volName = data.volunteer.name;
          setVolunteerName(volName);
          
          // 2. Fetch students collected by this volunteer
          const { data: studentsData } = await supabase
            .from('students')
            .select('*')
            .eq('collected_by', volName)
            .order('id', { ascending: false });
            
          if (studentsData) setStudentsList(studentsData);
        }
      } catch (err) {
        console.error(err);
      }

      // 3. Fetch candidates
      const { data: candidatesRes } = await supabase.from('candidates').select('*');
      if (candidatesRes) setCandidatesList(candidatesRes);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setIsSubmitting(true);
    
    if (!formData.name || !formData.roll) {
      setAddError("Name and Roll Number are required.");
      setIsSubmitting(false);
      return;
    }

    // Check for duplicates based on Roll Number
    const { data: existingStudent, error: checkError } = await supabase
      .from('students')
      .select('id')
      .eq('roll', formData.roll)
      .maybeSingle();

    if (existingStudent) {
      setAddError("A student with this Roll Number has already been added.");
      setIsSubmitting(false);
      return;
    }

    const newStudent = {
      name: formData.name,
      gender: formData.gender,
      roll: formData.roll,
      dept: formData.dept || "Unknown",
      year: formData.year || "Unknown",
      hostel: formData.hostel || "Day Scholar",
      room: formData.room || "N/A",
      address: formData.address || "Unknown",
      mobile: formData.mobile || "Unknown",
      email: formData.email || "Not provided",
      collected_by: volunteerName || "Unknown Volunteer",
      affiliation: "Neutral",
      dr_preference: formData.drPref
    };
    
    const { data, error } = await supabase.from('students').insert([newStudent]).select();
    
    if (error) {
      if (error.code === '23505') {
        setAddError("This student was just added by another volunteer simultaneously!");
      } else {
        setAddError("Failed to add student. Please try again.");
      }
    } else if (data && data.length > 0) {
      setStudentsList([data[0], ...studentsList]);
      setShowAddModal(false);
      setFormData({ name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: "Undecided" });
    }
    
    setIsSubmitting(false);
  };

  const filtered = studentsList.filter((s: any) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile.replace(/\s+/g, "").includes(search.replace(/\s+/g, ""))
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">My Collected Data</h2>
          <p className="text-xs text-slate-500">
            Students you have added to the database · <span className="text-blue-400 font-medium">{studentsList.length} entries</span>
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search your students by name, roll, or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Data View */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">Loading your data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-white/8 bg-white/[0.03]">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/10">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-sm font-medium text-white mb-1">No students found</p>
          <p className="text-xs text-slate-500">You haven't added any students yet, or no matches found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Info</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Academics</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Accommodation</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferences</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: any, i: number) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-white/5 hover:bg-white/[0.05] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0 border border-white/10">
                          {s.name.split(" ").map((n: string) => n[0]).join("").substring(0,2)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block mb-0.5">{s.name}</span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <User className="w-3 h-3" /> {s.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium mb-1">
                        <IdCard className="w-3.5 h-3.5" /> {s.roll} <span className="text-slate-500 mx-1">•</span> {s.year}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Building2 className="w-3 h-3" /> <span className="truncate">{s.dept}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {s.mobile}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Mail className="w-3 h-3 text-slate-500" /> <span className="truncate">{s.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                        <Home className="w-3 h-3 text-slate-500" /> {s.hostel === "Day Scholar" ? "Day Scholar" : `${s.hostel}, Room ${s.room}`}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500" /> <span className="truncate">{s.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] px-2 py-1 rounded border font-semibold tracking-wide bg-blue-500/10 border-blue-500/20 text-blue-400">
                        DR: {s.dr_preference}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Compact) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((s: any, i: number) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-3 flex flex-col gap-2 shadow-sm"
              >
                {/* Header Row: Name & DR Preference */}
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-white leading-tight block truncate">{s.name}</span>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1 text-blue-400 font-medium"><IdCard className="w-3 h-3" /> {s.roll}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {s.gender}</span>
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> <span className="truncate max-w-[100px]">{s.dept}</span> ({s.year})</span>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded border font-bold tracking-wide bg-blue-500/10 border-blue-500/20 text-blue-400 flex-shrink-0">
                    DR: {s.dr_preference}
                  </span>
                </div>
                
                {/* Details Grid: Contact & Address */}
                <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-white/5">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <Phone className="w-3 h-3 text-slate-500 flex-shrink-0" /> <span className="truncate">{s.mobile}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" /> <span className="truncate">{s.email}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <Home className="w-3 h-3 text-slate-500 flex-shrink-0" /> 
                      <span className="truncate">{s.hostel === "Day Scholar" ? "Day Scholar" : `${s.hostel}, R.${s.room}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" /> 
                      <span className="truncate">{s.address}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => !isSubmitting && setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <div className="w-full max-w-2xl bg-[#0d1526] rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[90vh] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/8 flex items-center justify-between flex-shrink-0 bg-[#0d1526] z-10">
                  <div>
                    <h3 className="text-lg font-bold text-white">Add New Student</h3>
                    <p className="text-sm text-slate-400">Enter student details to add to database.</p>
                  </div>
                  <button 
                    onClick={() => !isSubmitting && setShowAddModal(false)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                <form onSubmit={handleAddStudent} className="flex flex-col flex-1 overflow-hidden">
                  <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
                    {addError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium">
                      {addError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                      <input 
                        type="text" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                        placeholder="John Doe"
                      />
                    </div>
                    {/* Roll No */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Roll Number *</label>
                      <input 
                        type="text" required
                        value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                        placeholder="e.g. 21BCE100"
                      />
                    </div>
                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Gender</label>
                      <select 
                        value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      >
                        <option value="Male" className="bg-[#090e1a]">Male</option>
                        <option value="Female" className="bg-[#090e1a]">Female</option>
                        <option value="Other" className="bg-[#090e1a]">Other</option>
                      </select>
                    </div>
                    {/* Department */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Department</label>
                      <input 
                        type="text" 
                        value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    {/* Year */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Year</label>
                      <select 
                        value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      >
                        <option value="1st Year" className="bg-[#090e1a]">1st Year</option>
                        <option value="2nd Year" className="bg-[#090e1a]">2nd Year</option>
                        <option value="3rd Year" className="bg-[#090e1a]">3rd Year</option>
                        <option value="4th Year" className="bg-[#090e1a]">4th Year</option>
                      </select>
                    </div>
                    {/* Mobile */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Mobile Number</label>
                      <input 
                        type="text" 
                        value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    {/* Hostel */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Hostel</label>
                      <select 
                        value={formData.hostel} onChange={e => setFormData({...formData, hostel: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      >
                        {HOSTELS_LIST.map(h => <option key={h} value={h} className="bg-[#090e1a]">{h}</option>)}
                      </select>
                    </div>
                    {/* Room */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Room Number</label>
                      <input 
                        type="text" 
                        value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}
                        disabled={formData.hostel === "Day Scholar"}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                        placeholder="e.g. 101"
                      />
                    </div>
                    {/* DR Preference */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">DR Preference</label>
                      <select 
                        value={formData.drPref} onChange={e => setFormData({...formData, drPref: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      >
                        {drOptions.map(c => <option key={c} value={c} className="bg-[#090e1a]">{c}</option>)}
                      </select>
                    </div>
                  </div>

                  </div>

                  <div className="p-4 sm:p-6 flex items-center justify-end gap-3 border-t border-white/8 flex-shrink-0 bg-[#0d1526]">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 border border-blue-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <PlusCircle className="w-4 h-4" />
                      )}
                      Add Student
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
