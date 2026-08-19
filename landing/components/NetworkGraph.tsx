"use client";

import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { User, IdCard, Building2, Calendar, MapPin, Phone, Flag, X } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  group: 'student' | 'volunteer' | 'candidate' | 'hostel' | 'department';
  val?: number; // size
  roll?: string;
  dept?: string;
  year?: string;
  hostel?: string;
  mobile?: string;
  affiliation?: string;
}

interface Link {
  source: string;
  target: string;
  relationshipType?: string;
}

interface NetworkGraphProps {
  nodes: Node[];
  links: Link[];
  highlightPath?: { nodes: string[], links: string[] } | null;
}

export default function NetworkGraph({ nodes, links, highlightPath }: NetworkGraphProps) {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update dimensions on resize
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    if (fgRef.current) {
      // Center and zoom in on the clicked node
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(8, 2000);
    }
  };

  const getNodeColor = (group: string) => {
    if (group === 'volunteer') return '#10b981'; // Emerald
    if (group === 'candidate') return '#8b5cf6'; // Violet
    if (group === 'hostel') return '#f97316'; // Orange
    if (group === 'department') return '#14b8a6'; // Teal
    return '#3b82f6'; // Blue for students
  };

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-[#0d1526] rounded-2xl border border-white/10 overflow-hidden relative">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={{ nodes, links }}
        linkColor={(link: any) => {
          const sId = typeof link.source === 'object' ? link.source.id : link.source;
          const tId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (highlightPath) {
            if (highlightPath.links.includes(`${sId}-${tId}`) || highlightPath.links.includes(`${tId}-${sId}`)) {
              return '#10b981'; // Emerald glow for path
            }
            return 'rgba(255, 255, 255, 0.05)'; // Super dim for non-path
          }

          if (link.relationshipType === 'boyfriend' || link.relationshipType === 'girlfriend') return '#f43f5e'; // Rose/Pink
          if (link.relationshipType === 'roommate') return '#ec4899'; // Pink
          if (link.relationshipType === 'friend') return '#eab308'; // Yellow
          if (link.relationshipType) return '#94a3b8'; // Other explicit relationship
          return 'rgba(255, 255, 255, 0.15)'; // Default link
        }}
        linkCurvature={0.15}
        linkWidth={(link: any) => {
          if (highlightPath) {
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            if (highlightPath.links.includes(`${sId}-${tId}`) || highlightPath.links.includes(`${tId}-${sId}`)) {
              return 3;
            }
            return 0.5;
          }
          return link.relationshipType ? 1.5 : 1;
        }}
        nodeLabel={() => ""} // Disable default label so it doesn't overlap
        onNodeClick={handleNodeClick}
        onBackgroundClick={() => setSelectedNode(null)}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const isSelected = selectedNode?.id === node.id;
          const isHighlighted = highlightPath?.nodes.includes(node.id);
          const isDimmed = highlightPath && !isHighlighted;
          
          const radius = isSelected || isHighlighted ? 12 : 6;
          const color = getNodeColor(node.group);

          ctx.save();
          if (isDimmed) ctx.globalAlpha = 0.2;

          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();

          if (isSelected || isHighlighted) {
            // Draw border for selected/highlighted node
            ctx.lineWidth = isHighlighted ? 3 / globalScale : 1.5 / globalScale;
            ctx.strokeStyle = isHighlighted ? '#10b981' : '#ffffff';
            ctx.stroke();

            // Draw rich info inside/around the circle when zoomed in
            const fontSize = Math.max(1.5, 8 / globalScale);
            ctx.font = `bold ${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';

            let yOffset = node.y - 3;
            const lineSpacing = fontSize * 1.2;

            ctx.fillText(node.name, node.x, yOffset);
            
            ctx.font = `normal ${fontSize * 0.8}px Sans-Serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            
            if (node.dept) {
              yOffset += lineSpacing;
              ctx.fillText(node.dept, node.x, yOffset);
            }
            if (node.roll) {
              yOffset += lineSpacing;
              ctx.fillText(`Roll: ${node.roll}`, node.x, yOffset);
            }
            if (node.hostel && node.hostel !== 'Day Scholar') {
              yOffset += lineSpacing;
              ctx.fillText(node.hostel, node.x, yOffset);
            }
          } else {
            // Just draw the name below the node if zoomed in enough
            if (globalScale >= 2.5 && !isDimmed) {
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'top';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.fillText(node.name, node.x, node.y + radius + 2);
            }
          }
          
          ctx.restore();
        }}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <h4 className="text-white text-xs font-bold mb-3 uppercase tracking-wider">Legend</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-xs text-slate-300">Volunteer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
            <span className="text-xs text-slate-300">Candidate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
            <span className="text-xs text-slate-300">Hostel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
            <span className="text-xs text-slate-300">Department</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-xs text-slate-300">Student</span>
          </div>
        </div>
      </div>

      {/* Selected Node Overlay */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 w-80 shadow-2xl z-10 transition-all duration-200">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
                  {selectedNode.group}
                </span>
                {selectedNode.affiliation && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                    <Flag className="w-3 h-3" /> {selectedNode.affiliation}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">{selectedNode.name}</h3>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {selectedNode.group === 'student' && (
            <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
              {selectedNode.roll && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <IdCard className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{selectedNode.roll}</span>
                </div>
              )}
              {selectedNode.dept && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>{selectedNode.dept}</span>
                </div>
              )}
              {selectedNode.year && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{selectedNode.year}</span>
                </div>
              )}
              {selectedNode.hostel && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{selectedNode.hostel}</span>
                </div>
              )}
              {selectedNode.mobile && selectedNode.mobile !== "Unknown" && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{selectedNode.mobile}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
