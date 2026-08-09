"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
} from "lucide-react";

const navLinks = [
  { href: "/volunteer-dashboard", label: "My Students", icon: LayoutDashboard },
];

export default function VolunteerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [volunteerName, setVolunteerName] = useState("Loading...");

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const res = await fetch('/api/auth/volunteer/me');
        if (res.ok) {
          const data = await res.json();
          setVolunteerName(data.volunteer.name);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchVolunteer();
  }, [router]);

  const handleLogout = async () => {
    // Ideally call an endpoint to clear the cookie, but for now we can just redirect to login
    // which might not clear the cookie. Let's redirect to login for now.
    // To be perfectly robust, we should hit a logout API, but we'll do a simple push.
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex-shrink-0 flex flex-col border-r border-white/8 bg-white/[0.03] backdrop-blur-xl z-20"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 z-30 w-6 h-6 rounded-full bg-blue-600 border-2 border-[#030712] flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg"
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
        </button>

        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/8 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <HeartHandshake className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold text-white leading-tight">Volunteer Portal</p>
                <p className="text-xs text-slate-500 leading-tight">Election 2.0</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavVolunteer"
                    className="absolute inset-0 rounded-xl bg-blue-600/15 border border-blue-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 relative z-10 ${isActive ? "text-blue-400" : ""}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium relative z-10 whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className={`px-3 py-4 border-t border-white/8`}>
          <div onClick={handleLogout} className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {volunteerName === "Loading..." ? "..." : volunteerName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
              </span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs font-semibold text-white truncate">{volunteerName}</p>
                  <p className="text-xs text-slate-500 truncate">Volunteer</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0" />}
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-white/[0.02] backdrop-blur-sm">
          <div>
            <h1 className="text-base font-semibold text-white">
              {navLinks.find(l => l.href === pathname)?.label ?? "Dashboard"}
            </h1>
            <p className="text-xs text-slate-500">Welcome back, {volunteerName}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-grid">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
