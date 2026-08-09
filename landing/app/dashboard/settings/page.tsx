"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Flag,
  Building2,
  Megaphone,
  UploadCloud,
  Lock,
  Mail,
  FileText,
  Save,
  User,
  Phone,
  Landmark,
} from "lucide-react";

const sections = [
  { id: "party", label: "Party Info" },
  { id: "election", label: "Election Info" },
  { id: "admin", label: "Admin Account" },
  { id: "security", label: "Security" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("party");
  const [profile, setProfile] = useState<any>({});
  const [party, setParty] = useState<any>({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettingsData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setEmail(userData.user.email || "");
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*, parties(*)")
          .eq("user_id", userData.user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
          if (profileData.parties) {
            setParty(profileData.parties);
          }
        }
      }
      setLoading(false);
    };
    fetchSettingsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white">Settings</h2>
        <p className="text-xs text-slate-500">Manage your party and account details</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === s.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* PARTY INFO */}
            {active === "party" && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-white border-b border-white/8 pb-3">Party Information</h3>



                {[
                  { label: "Party Name", icon: Flag, placeholder: "Progress Alliance", defaultValue: party.party_name || "" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{f.label}</label>
                    <div className="relative group">
                      <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        defaultValue={f.defaultValue}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Party Description</label>
                  <div className="relative group">
                    <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <textarea
                      rows={3}
                      defaultValue="Committed to transparency, student welfare, and inclusive campus development."
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ELECTION INFO */}
            {active === "election" && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-white border-b border-white/8 pb-3">Election Information</h3>
                {[
                  { label: "College / Institute", icon: Building2, placeholder: "IIT Bombay", defaultValue: party.college || "" },
                  { label: "Election Name", icon: Landmark, placeholder: "Student Council Election 2026", defaultValue: party.election_name || "" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{f.label}</label>
                    <div className="relative group">
                      <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        defaultValue={f.defaultValue}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADMIN ACCOUNT */}
            {active === "admin" && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-white border-b border-white/8 pb-3">Administrator Account</h3>
                {[
                  { label: "Full Name", icon: User, placeholder: "Arjun Kumar", defaultValue: profile.full_name || "", type: "text" },
                  { label: "Mobile Number", icon: Phone, placeholder: "+91", defaultValue: profile.mobile || "", type: "tel" },
                  { label: "Email Address", icon: Mail, placeholder: "admin@college.edu", defaultValue: email, type: "email" },
                  { label: "Department / Branch", icon: Building2, placeholder: "Computer Science", defaultValue: profile.department || "", type: "text" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{f.label}</label>
                    <div className="relative group">
                      <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type={f.type}
                        defaultValue={f.defaultValue}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECURITY */}
            {active === "security" && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-white border-b border-white/8 pb-3">Change Password</h3>
                {[
                  { label: "Current Password", placeholder: "••••••••" },
                  { label: "New Password", placeholder: "••••••••" },
                  { label: "Confirm New Password", placeholder: "••••••••" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{f.label}</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="password"
                        placeholder={f.placeholder}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                ))}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                  ⚠️ After changing your password, you will be logged out of all sessions.
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-5 mt-5 border-t border-white/8">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
