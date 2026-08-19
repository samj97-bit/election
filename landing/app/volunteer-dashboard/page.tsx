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
  Edit2,
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
  const [volunteerPartyId, setVolunteerPartyId] = useState<string | null>(null);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const drOptions = [...candidatesList.filter(c => c.position !== 'President').map(c => c.name)];
  const presidentOptions = [...candidatesList.filter(c => c.position === 'President').map(c => c.name), "Undecided"];

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    name: string; gender: string; roll: string; dept: string; year: string; hostel: string; room: string; address: string; mobile: string; email: string; drPref: string[]; presidentPref: string;
    friends: { roll: string; type: string }[];
  }>({ name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: [], presidentPref: "Undecided", friends: [] });

  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);

  const handleEditClick = (student: any) => {
    let parsedFriends = [];
    if (student.friends) {
      try {
        parsedFriends = JSON.parse(student.friends);
        if (!Array.isArray(parsedFriends)) parsedFriends = [];
      } catch (e) {
        parsedFriends = student.friends.split(',').map((f: string) => ({ roll: f.trim(), type: 'friend' }));
      }
    }

    let parsedDrPref: string[] = [];
    if (student.dr_preference && student.dr_preference !== "Undecided") {
      try {
        parsedDrPref = JSON.parse(student.dr_preference);
        if (!Array.isArray(parsedDrPref)) parsedDrPref = [student.dr_preference];
      } catch (e) {
        parsedDrPref = [student.dr_preference];
      }
    }

    setFormData({
      name: student.name,
      gender: student.gender || "Male",
      roll: student.roll || "",
      dept: student.dept || "",
      year: student.year || "1st Year",
      hostel: student.hostel || "Boys Hostel 1",
      room: student.room || "",
      address: student.address || "",
      mobile: student.mobile || "",
      email: student.email || "",
      drPref: parsedDrPref,
      presidentPref: student.president_preference || "Undecided",
      friends: parsedFriends
    });
    setEditingStudentId(student.id);
    setShowAddModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Get Volunteer details
      try {
        const res = await fetch('/api/auth/volunteer/me');
        if (res.ok) {
          const data = await res.json();
          const sessionVolId = data.volunteer.id;
          
          // Fetch Volunteer Data using secure RPC
          const { data: rpcData } = await supabase.rpc('get_volunteer_profile', { p_volunteer_id: sessionVolId }).single();
          const volData = rpcData as any;
          
          if (volData) {
            setVolunteerName(volData.name);
            setVolunteerPartyId(volData.party_id);
            
            // Fetch Students collected by this volunteer using secure RPC
            const { data: stdData } = await supabase.rpc('get_volunteer_students', { p_volunteer_name: volData.name });
            setStudentsList(stdData || []);
          }
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

    if (existingStudent && existingStudent.id !== editingStudentId) {
      setAddError("A student with this Roll Number has already been added.");
      setIsSubmitting(false);
      return;
    }

    const baseStudent = {
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
      dr_preference: formData.drPref,
      friends: formData.friends.length > 0 ? JSON.stringify(formData.friends) : null
    };
    
    if (editingStudentId) {
      const { data, error } = await supabase.from('students').update(baseStudent).eq('id', editingStudentId).select();
      
      if (error) {
        console.error("Supabase Error:", error);
        setAddError(error.message);
        setIsSubmitting(false);
        return;
      }
      
      if (data && data.length > 0) {
        setStudentsList(studentsList.map(s => s.id === editingStudentId ? data[0] : s));
        setShowAddModal(false);
        setEditingStudentId(null);
        setFormData({ name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: [], presidentPref: "Undecided", friends: [] });
      }
    } else {

      const newStudent = {
        ...baseStudent,
        collected_by: volunteerName || "Unknown Volunteer",
        affiliation: "Neutral",
        ...(volunteerPartyId ? { party_id: volunteerPartyId } : {})
      };

      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('add_student_secure', {
          p_name: newStudent.name,
          p_gender: newStudent.gender,
          p_roll: newStudent.roll,
          p_dept: newStudent.dept,
          p_year: newStudent.year,
          p_hostel: newStudent.hostel,
          p_room: newStudent.room,
          p_address: newStudent.address,
          p_mobile: newStudent.mobile,
          p_email: newStudent.email,
          p_dr_preference: newStudent.dr_preference,
          p_friends: newStudent.friends ? JSON.parse(newStudent.friends) : null,
          p_collected_by: newStudent.collected_by,
          p_affiliation: newStudent.affiliation,
          p_party_id: newStudent.party_id || null,
          p_president_preference: formData.presidentPref !== "Undecided" ? formData.presidentPref : null
        });
        
        if (rpcError) {
          throw new Error(rpcError.message);
        }
        
        const { data: addedStudent } = await supabase
          .from('students')
          .select('*')
          .eq('id', rpcData.id)
          .single();
          
        if (addedStudent) {
          setStudentsList([addedStudent, ...studentsList]);
          setShowAddModal(false);
          setFormData({ name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: [], presidentPref: "Undecided", friends: [] });
        }
      } catch (err: any) {
        console.error("RPC Error:", err);
        if (err.message && err.message.includes('unique_roll_number')) {
          setAddError(`Error: A student with Roll Number "${newStudent.roll}" already exists in the system!`);
        } else if (err.message && err.message.includes('Could not find the function')) {
          setAddError(`Error adding student: ${err.message}. Make sure you ran the SQL script in Supabase!`);
        } else {
          setAddError(`Error adding student: ${err.message}`);
        }
        setIsSubmitting(false);
        return;
      }
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
          onClick={() => {
            setEditingStudentId(null);
            setFormData({ name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: [], presidentPref: "Undecided", friends: [] });
            setShowAddModal(true);
          }}
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
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
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
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => handleEditClick(s)}
                        className="p-1.5 rounded-lg text-blue-500 hover:text-white hover:bg-blue-500/20 transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
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
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded border font-bold tracking-wide bg-blue-500/10 border-blue-500/20 text-blue-400 flex-shrink-0">
                      DR: {s.dr_preference}
                    </span>
                    <button onClick={() => handleEditClick(s)} className="p-1 text-blue-500 hover:text-blue-400 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                    <h3 className="text-lg font-bold text-white">{editingStudentId ? "Edit Student" : "Add New Student"}</h3>
                    <p className="text-sm text-slate-400">Enter student details to add to database.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingStudentId(null);
                      setFormData({ name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: [], presidentPref: "Undecided", friends: [] });
                    }}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
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
                    {/* President Preference */}
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-300">President Preference</label>
                      <select 
                        value={formData.presidentPref} onChange={e => setFormData({...formData, presidentPref: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      >
                        <option value="Undecided" className="bg-[#090e1a]">Undecided</option>
                        {presidentOptions.filter(o => o !== 'Undecided').map(c => <option key={c} value={c} className="bg-[#090e1a]">{c}</option>)}
                      </select>
                    </div>
                    {/* Multi-DR Preference (Up to 4) */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>DR Preference (Select up to 4)</span>
                        <span className="text-[10px] text-blue-400">{formData.drPref.length}/4 Selected</span>
                      </label>
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-wrap gap-2">
                        {drOptions.length === 0 ? (
                          <p className="text-xs text-slate-500 italic py-1">No DR candidates available.</p>
                        ) : (
                          drOptions.map(opt => {
                            const isSelected = formData.drPref.includes(opt);
                            const isDisabled = !isSelected && formData.drPref.length >= 4;
                            return (
                              <button
                                type="button"
                                key={opt}
                                disabled={isDisabled}
                                onClick={() => {
                                  setFormData(prev => {
                                    const newArr = prev.drPref.includes(opt) 
                                      ? prev.drPref.filter(x => x !== opt)
                                      : [...prev.drPref, opt];
                                    return { ...prev, drPref: newArr };
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                  isSelected 
                                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                                    : isDisabled 
                                      ? 'bg-black/20 text-slate-600 border-white/5 cursor-not-allowed'
                                      : 'bg-black/20 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                    {/* Dynamic Relationships UI */}
                    <div className="sm:col-span-2 space-y-3 pt-2 border-t border-white/5 mt-2">
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
                              <input 
                                type="text" placeholder="Roll No. (e.g. CS24B001)"
                                value={friend.roll}
                                onChange={(e) => {
                                  const newFriends = [...formData.friends];
                                  newFriends[idx] = { ...newFriends[idx], roll: e.target.value };
                                  setFormData({...formData, friends: newFriends});
                                }}
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500/50"
                              />
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
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  </div>

                  <div className="p-4 sm:p-6 flex items-center justify-end gap-3 border-t border-white/8 flex-shrink-0 bg-[#0d1526]">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingStudentId(null);
                        setFormData({ name: "", gender: "Male", roll: "", dept: "", year: "1st Year", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: [], presidentPref: "Undecided", friends: [] });
                      }}
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
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        editingStudentId ? "Save Changes" : "Add Student"
                      )}
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
