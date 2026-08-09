"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  IdCard,
  Building2,
  CheckCircle2,
  Clock,
  User,
  X,
  MapPin,
  Home,
  Calendar,
  Flag,
  Users,
  Trash2,
  PlusCircle,
} from "lucide-react";



const COLORS = [
  { bg: "bg-blue-500/15", text: "text-blue-400", hex: "#3b82f6" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400", hex: "#10b981" },
  { bg: "bg-amber-500/15", text: "text-amber-400", hex: "#f59e0b" },
  { bg: "bg-pink-500/15", text: "text-pink-400", hex: "#ec4899" },
  { bg: "bg-violet-500/15", text: "text-violet-400", hex: "#8b5cf6" },
  { bg: "bg-cyan-500/15", text: "text-cyan-400", hex: "#06b6d4" },
  { bg: "bg-rose-500/15", text: "text-rose-400", hex: "#f43f5e" }
];

const affiliationStyle: Record<string, { bg: string; text: string }> = {
  "Progress Alliance": { bg: "bg-blue-500/15", text: "text-blue-400" },
  "United Front": { bg: "bg-rose-500/15", text: "text-rose-400" },
  "Neutral": { bg: "bg-slate-500/15", text: "text-slate-400" },
};

const HOSTELS_LIST = [
  ...Array.from({length: 8}, (_, i) => `Boys Hostel ${i + 1}`),
  ...Array.from({length: 11}, (_, i) => `Girls Hostel ${i + 1}`),
  "Day Scholar"
];

export default function StudentDataPage() {
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [liveDrStyle, setLiveDrStyle] = useState<Record<string, { bg: string; text: string; hex: string }>>({});
  const drOptions = [...candidatesList.map(c => c.name), "Undecided"];

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [drFilter, setDrFilter] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [hostelFilter, setHostelFilter] = useState<string>("All");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [confirmChange, setConfirmChange] = useState<{ id: number; newAff: string } | null>(null);
  const [confirmCandidateChange, setConfirmCandidateChange] = useState<{ id: number; position: string; newCandidate: string } | null>(null);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", gender: "Male", roll: "", dept: "", year: "", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: "Undecided" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [studentsRes, candidatesRes] = await Promise.all([
        supabase.from('students').select('*').order('id', { ascending: false }),
        supabase.from('candidates').select('*')
      ]);
      if (studentsRes.data) setStudentsList(studentsRes.data);
      if (candidatesRes.data) {
        setCandidatesList(candidatesRes.data);
        const styleMap: Record<string, any> = {};
        candidatesRes.data.forEach((c: any, index: number) => {
          styleMap[c.name] = COLORS[index % COLORS.length];
        });
        styleMap["Undecided"] = { bg: "bg-slate-500/15", text: "text-slate-400", hex: "#64748b" };
        setLiveDrStyle(styleMap);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddStudent = async () => {
    if (!formData.name) return;
    const newStudent = {
      name: formData.name,
      gender: formData.gender,
      roll: formData.roll || "Unknown",
      dept: formData.dept || "Unknown",
      year: formData.year || "Unknown",
      hostel: formData.hostel || "Day Scholar",
      room: formData.room || "N/A",
      address: formData.address || "Unknown",
      mobile: formData.mobile || "Unknown",
      email: formData.email || "Not provided",
      collected_by: "Admin",
      affiliation: "Neutral",
      dr_preference: formData.drPref
    };
    
    const { data, error } = await supabase.from('students').insert([newStudent]).select();
    
    if (data && data.length > 0) {
      setStudentsList([data[0], ...studentsList]);
    }
    setShowAddModal(false);
    setFormData({ name: "", gender: "Male", roll: "", dept: "", year: "", hostel: "Boys Hostel 1", room: "", address: "", mobile: "", email: "", drPref: "Undecided" });
  };
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const requestAffiliationChange = (id: number, newAffiliation: string) => {
    setConfirmChange({ id, newAff: newAffiliation });
  };

  const confirmAffiliationChange = async () => {
    if (!confirmChange) return;
    const { id, newAff } = confirmChange;
    
    await supabase.from('students').update({ affiliation: newAff }).eq('id', id);
    
    setStudentsList((prev: any[]) =>
      prev.map((s: any) => (s.id === id ? { ...s, affiliation: newAff } : s))
    );
    if (selectedStudent?.id === id) {
      setSelectedStudent({ ...selectedStudent, affiliation: newAff });
    }
    setConfirmChange(null);
  };

  const requestCandidateChange = (id: number, position: string, newCandidate: string) => {
    setConfirmCandidateChange({ id, position, newCandidate });
  };

  const confirmCandChange = async () => {
    if (!confirmCandidateChange) return;
    const { id, position, newCandidate } = confirmCandidateChange;
    
    await supabase.from('students').update({ dr_preference: newCandidate }).eq('id', id);
    
    setStudentsList((prev: any[]) =>
      prev.map((s: any) => (s.id === id ? { ...s, dr_preference: newCandidate } : s))
    );
    if (selectedStudent?.id === id) {
      setSelectedStudent((prev: any) => (prev ? { ...prev, dr_preference: newCandidate } : null));
    }
    setConfirmCandidateChange(null);
  };

  const requestDelete = (id: number, name: string) => {
    setConfirmDelete({ id, name });
  };

  const confirmDeletion = async () => {
    if (!confirmDelete) return;
    await supabase.from('students').delete().eq('id', confirmDelete.id);
    setStudentsList((prev: any[]) => prev.filter((s: any) => s.id !== confirmDelete.id));
    if (selectedStudent?.id === confirmDelete.id) {
      setSelectedStudent(null);
    }
    setConfirmDelete(null);
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape', 'pt', 'a4');
    
    doc.setFontSize(18);
    doc.text("Student Database Export", 40, 40);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Total Entries: ${filtered.length} | Generated on: ${new Date().toLocaleDateString()}`, 40, 60);
    
    const tableColumn = ["Roll No", "Name", "Gender", "Year", "Dept", "Mobile", "Hostel", "DR Preference", "Affiliation", "Collected By"];
    const tableRows = filtered.map(s => [
      s.roll,
      s.name,
      s.gender,
      s.year,
      s.dept,
      s.mobile,
      s.hostel,
      s.dr_preference,
      s.affiliation,
      s.collected_by
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8, cellPadding: 4 },
    });

    doc.save("students_database.pdf");
  };

  const filtered = studentsList.filter((s: any) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile.replace(/\s+/g, "").includes(search.replace(/\s+/g, "")) ||
      s.dept.toLowerCase().includes(search.toLowerCase()) ||
      (s.collected_by && s.collected_by.toLowerCase().includes(search.toLowerCase()));
    
    const matchYear = yearFilter === "All" || s.year === yearFilter;
    const matchDr = drFilter === "All" || s.dr_preference === drFilter;
    const matchGender = genderFilter === "All" || s.gender === genderFilter;
    const matchHostel = hostelFilter === "All" || s.hostel === hostelFilter;
    
    return matchSearch && matchYear && matchDr && matchGender && matchHostel;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Student Database</h2>
          <p className="text-xs text-slate-500">
            Data collected by volunteers · <span className="text-blue-400 font-medium">{studentsList.length} entries</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            Add Student
          </button>
          <button onClick={() => setShowExportConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors border border-white/10 shadow-lg">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Supporter Chart */}
      {/* DR Supporter Chart */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {(() => {
          const counts = studentsList.reduce((acc: any, s: any) => {
            const dr = s.dr_preference || "Undecided";
            acc[dr] = (acc[dr] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const total = studentsList.length;
          
          let gradientStops: string[] = [];
          let currentPct = 0;
          
          Object.entries(liveDrStyle).forEach(([name, style]: [string, any]) => {
            const pct = ((counts[name] || 0) / total) * 100;
            if (pct > 0) {
              gradientStops.push(`${style.hex} ${currentPct}% ${currentPct + pct}%`);
              currentPct += pct;
            }
          });
          
          const gradient = `conic-gradient(${gradientStops.join(', ')})`;
          
          return (
            <>
              <div 
                className={`relative w-28 h-28 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] flex-shrink-0 transition-transform cursor-pointer hover:scale-105 ${drFilter === "All" ? "ring-2 ring-white/20" : "opacity-80"}`} 
                style={{ background: gradient }}
                onClick={() => setDrFilter("All")}
                title="View All DR Supports"
              >
                <div className="absolute inset-2 bg-[#090e1a] rounded-full flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white leading-none">{total}</span>
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Total</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                {Object.entries(liveDrStyle).map(([name, style]: [string, any]) => {
                  const pct = Math.round(((counts[name] || 0) / total) * 100);
                  const count = counts[name] || 0;
                  const isSelected = drFilter === name;
                  return (
                    <div 
                      key={name} 
                      onClick={() => setDrFilter(isSelected ? "All" : name)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected ? "bg-white/10 scale-[1.02] ring-1 ring-white/10" : "hover:bg-white/5 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className={`w-1.5 h-10 rounded-full ${style.bg.replace('/15', '')} opacity-80`} />
                      <div>
                        <p className={`text-xs font-semibold mb-0.5 ${isSelected ? "text-white" : "text-slate-400"}`}>{name}</p>
                        <div className="flex items-end gap-2">
                          <span className={`text-lg font-bold leading-none ${isSelected ? "text-white" : "text-slate-300"}`}>{count}</span>
                          <span className={`text-xs font-bold ${style.text} leading-none mb-0.5`}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

      {/* Year Breakdown Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* All Years Card */}
        <motion.div
          onClick={() => setYearFilter("All")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-3.5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${
            yearFilter === "All"
              ? "bg-blue-600/20 border-blue-500/50" 
              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              yearFilter === "All" ? "bg-blue-500/20 border-blue-400/30" : "bg-blue-500/10 border-blue-500/20"
            }`}>
              <Users className={`w-3.5 h-3.5 ${yearFilter === "All" ? "text-blue-300" : "text-blue-400"}`} />
            </div>
            <span className={`text-sm font-semibold ${yearFilter === "All" ? "text-white" : "text-slate-300"}`}>All Years</span>
          </div>
          <span className={`text-xl font-bold ${yearFilter === "All" ? "text-blue-400" : "text-white"}`}>{studentsList.length}</span>
        </motion.div>

        {Object.entries(studentsList.reduce((acc: any, s: any) => {
          acc[s.year] = (acc[s.year] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)).sort().map(([year, count], i) => {
          const isSelected = yearFilter === year;
          return (
            <motion.div
              key={year}
              onClick={() => setYearFilter(isSelected ? "All" : year)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-3.5 flex items-center justify-between shadow-sm cursor-pointer transition-all ${
                isSelected 
                  ? "bg-blue-600/20 border-blue-500/50" 
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                  isSelected ? "bg-blue-500/20 border-blue-400/30" : "bg-blue-500/10 border-blue-500/20"
                }`}>
                  <Calendar className={`w-3.5 h-3.5 ${isSelected ? "text-blue-300" : "text-blue-400"}`} />
                </div>
                <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-300"}`}>{year}</span>
              </div>
              <span className={`text-xl font-bold ${isSelected ? "text-blue-400" : "text-white"}`}>{String(count)}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, roll, mobile, or volunteer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
        
        <div className="relative w-full sm:w-40 flex-shrink-0">
          <select
            value={genderFilter}
            onChange={(e) => {
              const val = e.target.value;
              setGenderFilter(val);
              if (val === "Female" && hostelFilter.includes("Boys")) setHostelFilter("All");
              if ((val === "Male" || val === "Other") && hostelFilter.includes("Girls")) setHostelFilter("All");
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="All" className="bg-[#090e1a] text-white">All Genders</option>
            <option value="Male" className="bg-[#090e1a] text-white">Male</option>
            <option value="Female" className="bg-[#090e1a] text-white">Female</option>
            <option value="Other" className="bg-[#090e1a] text-white">Other</option>
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        <div className="relative w-full sm:w-44 flex-shrink-0">
          <select
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="All" className="bg-[#090e1a] text-white">All Hostels</option>
            {HOSTELS_LIST.filter(h => {
              if (genderFilter === "Female") return h.includes("Girls") || h === "Day Scholar";
              if (genderFilter === "Male" || genderFilter === "Other") return h.includes("Boys") || h === "Day Scholar";
              return true;
            }).map(h => (
              <option key={h} value={h} className="bg-[#090e1a] text-white">{h}</option>
            ))}
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.02]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Academics</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Accommodation</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected By</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Affiliation & Preferences</th>
              <th className="px-4 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s: any, i: number) => {
              return (
                <motion.tr
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/[0.05] transition-colors group cursor-pointer"
                >
                  {/* Student Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0 border border-white/10">
                        {s.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block mb-0.5">{s.name}</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <User className="w-3 h-3" /> Student
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Academics */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium mb-1">
                      <IdCard className="w-3.5 h-3.5" /> {s.roll} <span className="text-slate-500 mx-1">•</span> {s.year}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Building2 className="w-3 h-3" /> <span className="truncate">{s.dept}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                      <Phone className="w-3 h-3 text-slate-500" /> {s.mobile}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Mail className="w-3 h-3 text-slate-500" /> <span className="truncate">{s.email}</span>
                    </div>
                  </td>

                  {/* Accommodation */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                      <Home className="w-3 h-3 text-slate-500" /> {s.hostel === "Day Scholar" ? "Day Scholar" : `${s.hostel}, Room ${s.room}`}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" /> <span className="truncate">{s.address}</span>
                    </div>
                  </td>

                  {/* Collected By */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-slate-300 block mb-0.5">{s.collected_by}</span>
                    <span className="text-[11px] text-slate-500">{s.date}</span>
                  </td>

                  {/* Affiliation */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <div className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${affiliationStyle[s.affiliation].bg} ${affiliationStyle[s.affiliation].text} cursor-pointer hover:ring-1 hover:ring-white/20 transition-all`} title="Click to change affiliation">
                        {s.affiliation}
                        <select 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          value={s.affiliation}
                          onChange={(e) => requestAffiliationChange(s.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {Object.keys(affiliationStyle).map(a => (
                            <option key={a} value={a} className="bg-slate-900 text-white">{a}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Candidate Preferences */}
                      <div className="flex flex-wrap gap-1 mt-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className={`flex items-center text-[10px] px-2 py-1 rounded border font-semibold tracking-wide ${s.dr_preference === 'Undecided' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`} title={`DR: ${s.dr_preference}`}>
                          <span className="text-slate-500 mr-1">DR:</span> <span className={s.dr_preference === 'Undecided' ? 'text-slate-400' : 'text-blue-300'}>{s.dr_preference}</span>
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); requestDelete(s.id, s.name); }}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/10">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-white mb-1">No students found</p>
            <p className="text-xs text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1526] overflow-hidden shadow-2xl relative">
                {/* Header Profile Section */}
                <div className="bg-white/[0.03] p-6 border-b border-white/8 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button onClick={() => requestDelete(selectedStudent.id, selectedStudent.name)} className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center hover:bg-rose-500/20 transition-colors text-rose-500" title="Delete Student">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setSelectedStudent(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                      {selectedStudent.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{selectedStudent.name}</h3>
                      <div className={`relative inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${affiliationStyle[selectedStudent.affiliation].bg} ${affiliationStyle[selectedStudent.affiliation].text} uppercase tracking-wider cursor-pointer hover:ring-1 hover:ring-white/20 transition-all`} title="Click to change affiliation">
                        <Flag className="w-3 h-3" />
                        {selectedStudent.affiliation}
                        <select 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          value={selectedStudent.affiliation}
                          onChange={(e) => requestAffiliationChange(selectedStudent.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {Object.keys(affiliationStyle).map(a => (
                            <option key={a} value={a} className="bg-slate-900 text-white">{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Candidate Badges */}
                    <div className="flex flex-wrap gap-2 mt-2 w-full">
                      <div className={`relative inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-white uppercase tracking-wider cursor-pointer hover:ring-1 hover:ring-white/20 transition-all`} title={`Change Department Representative candidate`}>
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400 mr-1">DR:</span> {selectedStudent.dr_preference}
                        <select 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          value={selectedStudent.dr_preference}
                          onChange={(e) => requestCandidateChange(selectedStudent.id, "Department Representative", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {drOptions.map(c => (
                            <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Roll Number</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <IdCard className="w-4 h-4 text-slate-400" />
                        {selectedStudent.roll}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Year</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {selectedStudent.year}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {selectedStudent.dept}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {selectedStudent.mobile}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium truncate" title={selectedStudent.email}>
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{selectedStudent.email}</span>
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Hostel</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <Home className="w-4 h-4 text-slate-400" />
                        {selectedStudent.hostel === "Day Scholar" ? "Day Scholar" : `${selectedStudent.hostel}, Room ${selectedStudent.room}`}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Address</p>
                      <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {selectedStudent.address}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">Collected by {selectedStudent.collected_by}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Recorded on {selectedStudent.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmChange && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setConfirmChange(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              className="fixed top-1/2 left-1/2 z-[70] w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1526] p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">Confirm Change</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to change the affiliation to <span className="text-white font-semibold">{confirmChange.newAff}</span>?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setConfirmChange(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAffiliationChange}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 border border-blue-500"
                >
                  Confirm Change
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              className="fixed top-1/2 left-1/2 z-[70] w-full max-w-sm rounded-2xl border border-rose-500/20 bg-[#0d1526] p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">Delete Student</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">{confirmDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeletion}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-500/20 border border-rose-500"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export PDF Confirmation Modal */}
      <AnimatePresence>
        {showExportConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setShowExportConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              className="fixed top-1/2 left-1/2 z-[70] w-full max-w-sm rounded-2xl border border-blue-500/20 bg-[#0d1526] p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">Export to PDF</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to export the current view ({filtered.length} entries) to a PDF document?
              </p>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowExportConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowExportConfirm(false);
                    exportPDF();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 border border-blue-500"
                >
                  Generate PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Candidate Change */}
      <AnimatePresence>
        {confirmCandidateChange && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1526] p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-2">Change Supported Candidate</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Are you sure you want to change the supported candidate for <span className="text-white font-semibold">{confirmCandidateChange.position}</span> to <span className="text-white font-semibold">{confirmCandidateChange.newCandidate}</span>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmCandidateChange(null)}
                    className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCandChange}
                    className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Confirm Change
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d1526] shadow-2xl my-8 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
                  <h3 className="text-lg font-bold text-white">Add New Student</h3>
                  <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "name", label: "Full Name", icon: User, placeholder: "Student Name", type: "text", fullWidth: true },
                    { id: "gender", label: "Gender", icon: Users, type: "select", options: ["Male", "Female", "Other"] },
                    { id: "roll", label: "Roll Number", icon: IdCard, placeholder: "e.g. CS24B001", type: "text" },
                    { 
                      id: "dept", label: "Department", icon: Building2, type: "select", 
                      options: ["Computer Science", "Electronics & Comm.", "Mechanical Engg.", "Civil Engineering", "Electrical Engg.", "Others"] 
                    },
                    { 
                      id: "year", label: "Year", icon: Calendar, type: "select", 
                      options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Ph.D./PG"] 
                    },
                    { id: "mobile", label: "Mobile", icon: Phone, placeholder: "+91", type: "tel" },
                    { id: "email", label: "Email (Optional)", icon: Mail, placeholder: "student@college.edu", type: "email" },
                    { 
                      id: "hostel", label: "Hostel / Living", icon: Home, type: "select", 
                      options: formData.gender === "Female" 
                        ? [...Array.from({length: 11}, (_, i) => `Girls Hostel ${i + 1}`), "Day Scholar"]
                        : [...Array.from({length: 8}, (_, i) => `Boys Hostel ${i + 1}`), "Day Scholar"]
                    },
                    { id: "room", label: "Room No. (Optional)", icon: Home, placeholder: "e.g. 212", type: "text" },
                    { id: "address", label: "Home Address", icon: MapPin, placeholder: "City, State", type: "text", fullWidth: true },
                    { 
                      id: "drPref", label: "DR Preference", icon: User, type: "select", 
                      options: drOptions,
                      fullWidth: true
                    },
                  ].map((f) => (
                    <div key={f.id} className={`space-y-1.5 ${f.fullWidth ? 'md:col-span-2' : 'col-span-1'}`}>
                      <label className="text-xs font-semibold text-slate-400">{f.label}</label>
                      <div className="relative">
                        <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        {f.type === 'select' ? (
                          <select
                            value={formData[f.id as keyof typeof formData]}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (f.id === "gender") {
                                setFormData((prev: any) => ({ 
                                  ...prev, 
                                  gender: val, 
                                  hostel: val === "Female" ? "Girls Hostel 1" : "Boys Hostel 1" 
                                }));
                              } else {
                                setFormData((prev: any) => ({ ...prev, [f.id]: val }));
                              }
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer appearance-none"
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
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddStudent}
                      disabled={!formData.name}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Student
                    </button>
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
