"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Share2, Users, AlertCircle, MapPin, Building2, User, Users2, Home, Search, ArrowRight, Route } from "lucide-react";

// Dynamically import the NetworkGraph component with SSR disabled
// because react-force-graph-2d relies on the canvas and window objects
const NetworkGraph = dynamic(() => import("@/components/NetworkGraph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#0d1526] rounded-2xl border border-white/10 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-medium">Loading network graph engine...</p>
    </div>
  ),
});

export default function NetworkPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<{students: any[], volunteers: any[], candidates: any[]} | null>(null);

  const [filters, setFilters] = useState({
    hostel: true,
    department: true,
    volunteer: true,
    candidate: true,
    roommate: false,
    friends: false,
  });

  const [sourceNodeId, setSourceNodeId] = useState<string>("");
  const [targetNodeId, setTargetNodeId] = useState<string>("");
  const [highlightPath, setHighlightPath] = useState<{ nodes: string[], links: string[], summary: any[], isCircle?: boolean } | null>(null);
  const [pathNotFound, setPathNotFound] = useState(false);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        let currentPartyId = null;
        if (userData?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('party_id')
            .eq('user_id', userData.user.id)
            .maybeSingle();
          if (profile) currentPartyId = profile.party_id;
        }

        let studentsQuery = supabase.from("students").select("id, name, collected_by, dr_preference, affiliation, hostel, dept, roll, year, mobile, room, friends");
        let volunteersQuery = supabase.from("volunteers").select("id, name");
        let candidatesQuery = supabase.from("candidates").select("id, name");

        if (currentPartyId) {
          studentsQuery = studentsQuery.eq('party_id', currentPartyId);
          volunteersQuery = volunteersQuery.eq('party_id', currentPartyId);
        }

        // Fetch students, volunteers, candidates
        let [studentsRes, volunteersRes, candidatesRes] = await Promise.all([
          studentsQuery,
          volunteersQuery,
          candidatesQuery,
        ]);

        // Fallback if the 'friends' column hasn't been created yet
        if (studentsRes.error && studentsRes.error.message.includes("friends")) {
          console.warn("Friends column not found, falling back to query without friends...");
          let fallbackQuery = supabase.from("students").select("id, name, collected_by, dr_preference, affiliation, hostel, dept, roll, year, mobile, room");
          if (currentPartyId) fallbackQuery = fallbackQuery.eq('party_id', currentPartyId);
          studentsRes = (await fallbackQuery) as any;
        }

        const students = studentsRes.data || [];
        const volunteers = volunteersRes.data || [];
        const candidates = candidatesRes.data || [];

        setRawData({ students, volunteers, candidates });
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    if (!rawData) return;
    
    const { students, volunteers, candidates } = rawData;
    const newNodes: any[] = [];
    const newLinks: any[] = [];

    const volunteerMap = new Map();
    if (filters.volunteer) {
      volunteers.forEach((v) => {
        const vId = `vol_${v.id}`;
        volunteerMap.set(v.name, vId);
        newNodes.push({ id: vId, name: `${v.name} (Volunteer)`, group: "volunteer" });
      });
    }

    const candidateMap = new Map();
    if (filters.candidate) {
      candidates.forEach((c) => {
        const cId = `cand_${c.id}`;
        candidateMap.set(c.name, cId);
        newNodes.push({ id: cId, name: `${c.name} (Candidate)`, group: "candidate" });
      });
    }

    const createTempNode = (name: string, type: string) => {
      const prefix = type === "candidate" ? "cand" : "vol";
      const tempId = `${prefix}_temp_${name.replace(/\s+/g, "_")}`;
      newNodes.push({
        id: tempId,
        name: `${name} (${type === "candidate" ? "Candidate" : "Volunteer"})`,
        group: type,
      });
      return tempId;
    };

    const hostelMap = new Map();
    const deptMap = new Map();

    // Map to track students by hostel and room for Roommate edges
    const roomMap = new Map<string, string[]>();
    
    // Map to track students by roll number for Friend edges
    const rollMap = new Map<string, string>();

    students.forEach((s) => {
      const sId = `std_${s.id}`;
      if (s.roll) rollMap.set(s.roll.trim().toUpperCase(), sId);
      
      newNodes.push({
        id: sId,
        name: s.name,
        group: "student",
        roll: s.roll,
        dept: s.dept,
        year: s.year,
        hostel: s.hostel,
        room: s.room,
        mobile: s.mobile,
        affiliation: s.affiliation
      });

      if (filters.volunteer && s.collected_by) {
        let vId = volunteerMap.get(s.collected_by);
        if (!vId) {
          vId = createTempNode(s.collected_by, "volunteer");
          volunteerMap.set(s.collected_by, vId);
        }
        newLinks.push({ source: vId, target: sId });
      }

      if (filters.candidate && s.dr_preference) {
        let drs = [];
        if (s.dr_preference.startsWith('[')) {
          try { drs = JSON.parse(s.dr_preference); } catch(e) { drs = [s.dr_preference]; }
        } else {
          drs = [s.dr_preference];
        }
        
        drs.forEach((dr: string) => {
          if (dr === "Undecided") return;
          let cId = candidateMap.get(dr);
          if (!cId) {
            cId = createTempNode(dr, "candidate");
            candidateMap.set(dr, cId);
          }
          newLinks.push({ source: sId, target: cId, relationshipType: 'dr_support' });
        });
      }

      if (filters.candidate && s.president_preference && s.president_preference !== "Undecided") {
        let cId = candidateMap.get(s.president_preference);
        if (!cId) {
          cId = createTempNode(s.president_preference, "candidate");
          candidateMap.set(s.president_preference, cId);
        }
        newLinks.push({ source: sId, target: cId, relationshipType: 'president_support' });
      }

      if (filters.hostel && s.hostel && s.hostel !== "Unknown" && s.hostel !== "N/A" && s.hostel !== "Day Scholar") {
        let hId = hostelMap.get(s.hostel);
        if (!hId) {
          hId = `hostel_${s.hostel.replace(/\s+/g, "_")}`;
          hostelMap.set(s.hostel, hId);
          newNodes.push({ id: hId, name: `${s.hostel} (Hostel)`, group: "hostel" });
        }
        newLinks.push({ source: sId, target: hId });
      }

      if (filters.department && s.dept && s.dept !== "Unknown" && s.dept !== "N/A") {
        let dId = deptMap.get(s.dept);
        if (!dId) {
          dId = `dept_${s.dept.replace(/\s+/g, "_")}`;
          deptMap.set(s.dept, dId);
          newNodes.push({ id: dId, name: `${s.dept} (Department)`, group: "department" });
        }
        newLinks.push({ source: sId, target: dId });
      }

      // Collect data for Roommates
      if (filters.roommate && s.hostel && s.hostel !== "Day Scholar" && s.room && s.room !== "N/A") {
        const roomKey = `${s.hostel}_${s.room}`;
        if (!roomMap.has(roomKey)) roomMap.set(roomKey, []);
        roomMap.get(roomKey)?.push(sId);
      }
      // Collect data for Friends
      if (filters.friends && s.friends) {
        // Just acknowledging it exists for now, logic is in second pass
      }
    });

    // Generate Friend Edges (Second pass to ensure all roll numbers are mapped)
    if (filters.friends) {
      students.forEach((s) => {
        if (s.friends) {
          const sId = `std_${s.id}`;
          
          let friendList: { roll: string; type: string }[] = [];
          try {
            const parsed = JSON.parse(s.friends);
            if (Array.isArray(parsed)) friendList = parsed;
            else friendList = [];
          } catch (e) {
            // Fallback for old comma-separated text
            friendList = s.friends.split(',').map((f: string) => ({ roll: f.trim(), type: 'friend' }));
          }

          friendList.forEach((friend) => {
            if (!friend.roll) return;
            const targetId = rollMap.get(friend.roll.toUpperCase().trim());
            if (targetId && targetId !== sId) {
              // Ensure we don't duplicate undirected edges unnecessarily 
              // (react-force-graph will just draw two lines if both add each other)
              newLinks.push({ 
                source: sId, 
                target: targetId,
                relationshipType: friend.type
              });
            }
          });
        }
      });
    }

    // Generate Roommate Edges
    if (filters.roommate) {
      roomMap.forEach((studentIds, roomKey) => {
        // Connect all students in the same room to each other
        for (let i = 0; i < studentIds.length; i++) {
          for (let j = i + 1; j < studentIds.length; j++) {
            newLinks.push({ source: studentIds[i], target: studentIds[j] });
          }
        }
      });
    }

    setNodes(newNodes);
    setLinks(newLinks);
    
    // Clear path if the network structurally changes
    setHighlightPath(null);
    setPathNotFound(false);
  }, [rawData, filters]);

  const findFriendCircle = () => {
    setHighlightPath(null);
    setPathNotFound(false);
    if (!sourceNodeId) return;

    const circleNodes = new Set<string>();
    circleNodes.add(sourceNodeId);
    const circleLinks = new Set<string>();
    let foundNeighbors = false;
    const friendsList: any[] = [];

    links.forEach(l => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source;
      const tId = typeof l.target === 'object' ? l.target.id : l.target;
      const rel = l.relationshipType || 'connection';

      if (sId === sourceNodeId) {
        circleNodes.add(tId);
        circleLinks.add(`${sId}-${tId}`);
        foundNeighbors = true;
        friendsList.push({ name: nodes.find(n => n.id === tId)?.name || 'Unknown', rel });
      } else if (tId === sourceNodeId) {
        circleNodes.add(sId);
        circleLinks.add(`${tId}-${sId}`);
        foundNeighbors = true;
        friendsList.push({ name: nodes.find(n => n.id === sId)?.name || 'Unknown', rel });
      }
    });

    if (!foundNeighbors) {
      setPathNotFound(true);
      return;
    }

    setHighlightPath({
      nodes: Array.from(circleNodes),
      links: Array.from(circleLinks),
      isCircle: true,
      summary: friendsList
    });
  };

  const findPath = () => {
    setHighlightPath(null);
    setPathNotFound(false);
    if (!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId) return;

    // Build adjacency list for BFS
    const adj = new Map<string, { id: string, rel: string }[]>();
    links.forEach(l => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source;
      const tId = typeof l.target === 'object' ? l.target.id : l.target;
      const rel = l.relationshipType || 'connection';
      
      if (!adj.has(sId)) adj.set(sId, []);
      if (!adj.has(tId)) adj.set(tId, []);
      
      adj.get(sId)!.push({ id: tId, rel });
      adj.get(tId)!.push({ id: sId, rel });
    });

    const queue: { id: string, pathNodes: string[], pathLinks: string[], summary: any[] }[] = [];
    queue.push({ 
      id: sourceNodeId, 
      pathNodes: [sourceNodeId], 
      pathLinks: [], 
      summary: [{ id: sourceNodeId, name: nodes.find(n => n.id === sourceNodeId)?.name || 'Unknown', rel: 'start' }] 
    });
    
    const visited = new Set<string>([sourceNodeId]);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.id === targetNodeId) {
        setHighlightPath({
          nodes: current.pathNodes,
          links: current.pathLinks,
          summary: current.summary
        });
        return;
      }

      const neighbors = adj.get(current.id) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          const linkId = `${current.id}-${neighbor.id}`;
          const nextSummary = [...current.summary, { 
            id: neighbor.id, 
            name: nodes.find(n => n.id === neighbor.id)?.name || 'Unknown', 
            rel: neighbor.rel 
          }];
          queue.push({
            id: neighbor.id,
            pathNodes: [...current.pathNodes, neighbor.id],
            pathLinks: [...current.pathLinks, linkId],
            summary: nextSummary
          });
        }
      }
    }

    setPathNotFound(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            Relationship Network Graph
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Visualize connections between volunteers, students, and candidates.
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white">
              {nodes.length} Nodes
            </span>
          </div>
          <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center gap-2">
            <Share2 className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-white">
              {links.length} Links
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap gap-2 items-center bg-[#0d1526] border border-white/10 p-3 rounded-xl"
      >
        <div className="text-sm text-slate-400 font-bold mr-2 uppercase tracking-wider">Analysis By:</div>
        
        <button 
          onClick={() => toggleFilter('hostel')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filters.hostel ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          <Home className="w-3.5 h-3.5" /> Hostel
        </button>

        <button 
          onClick={() => toggleFilter('department')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filters.department ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          <Building2 className="w-3.5 h-3.5" /> Department
        </button>

        <button 
          onClick={() => toggleFilter('volunteer')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filters.volunteer ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          <Users2 className="w-3.5 h-3.5" /> Collected By
        </button>

        <button 
          onClick={() => toggleFilter('candidate')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filters.candidate ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          <User className="w-3.5 h-3.5" /> Candidate
        </button>

        <button 
          onClick={() => toggleFilter('roommate')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filters.roommate ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          <MapPin className="w-3.5 h-3.5" /> Roommate
        </button>

        <button 
          onClick={() => toggleFilter('friends')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${filters.friends ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          <Users className="w-3.5 h-3.5" /> Friend Circle
        </button>
      </motion.div>

      {/* Path Analysis Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-[#0d1526] border border-white/10 p-4 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <Route className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Connection Analysis (Shortest Path)</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-400 mb-1">Person 1 (Start)</label>
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">-- Select Person --</option>
              {nodes.filter(n => n.group === 'student' || n.group === 'volunteer' || n.group === 'candidate').map(n => (
                <option key={n.id} value={n.id}>{n.name} ({n.group})</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-400 mb-1">Person 2 (Target)</label>
            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">-- Select Person --</option>
              {nodes.filter(n => n.group === 'student' || n.group === 'volunteer' || n.group === 'candidate').map(n => (
                <option key={n.id} value={n.id}>{n.name} ({n.group})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={findFriendCircle}
              disabled={!sourceNodeId}
              className="w-full md:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              title="Show direct connections of Person 1"
            >
              <Users className="w-4 h-4" />
              Friend Circle
            </button>
            <button
              onClick={findPath}
              disabled={!sourceNodeId || !targetNodeId}
              className="w-full md:w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Find Connection
            </button>
          </div>
        </div>

        {/* Path Result */}
        {pathNotFound && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-200">No connection found between these two people in the current network. Try enabling more filters like 'Hostel' or 'Department'.</p>
          </div>
        )}
        
        {highlightPath && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="text-xs text-emerald-400 font-bold mb-2 uppercase tracking-wider">
              {highlightPath.isCircle ? `Friend Circle Found (${highlightPath.nodes.length - 1} connections)` : `Path Found (${highlightPath.nodes.length - 1} degrees of separation)`}
            </div>
            
            {highlightPath.isCircle ? (
              <div className="flex flex-wrap items-center gap-2">
                {highlightPath.summary.map((friend, idx) => (
                  <div key={idx} className="px-3 py-1.5 bg-black/40 border border-emerald-500/30 rounded-lg text-sm text-white font-medium flex items-center gap-2">
                    {friend.name}
                    <span className="text-[10px] text-emerald-400 font-bold uppercase px-1.5 py-0.5 bg-emerald-500/10 rounded">{friend.rel}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {highlightPath.summary.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="px-3 py-1.5 bg-black/40 border border-emerald-500/30 rounded-lg text-sm text-white font-medium">
                      {step.name}
                    </div>
                    {idx < highlightPath.summary.length - 1 && (
                      <div className="flex items-center gap-1 text-emerald-500/50 text-xs font-bold uppercase">
                        <ArrowRight className="w-4 h-4" />
                        {highlightPath.summary[idx + 1].rel}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <div className="w-full h-[600px] bg-[#0d1526] rounded-2xl border border-white/10 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Fetching data...</p>
          </div>
        ) : nodes.length === 0 ? (
          <div className="w-full h-[600px] bg-[#0d1526] rounded-2xl border border-white/10 flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-4" />
            <p className="text-white font-semibold">No relationship data found</p>
            <p className="text-slate-400 text-sm mt-1">Add students and volunteers to see connections.</p>
          </div>
        ) : (
          <NetworkGraph nodes={nodes} links={links} highlightPath={highlightPath} />
        )}
      </motion.div>
    </div>
  );
}
