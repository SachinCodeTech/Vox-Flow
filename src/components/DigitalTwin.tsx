import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { 
  Globe, 
  Cpu, 
  Zap, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  Database,
  Layers,
  Network
} from 'lucide-react';
import { cn } from '../lib/utils';

export const DigitalTwin = () => {
  const { workspaces, currentWorkspaceId, switchWorkspace, agents, events } = useWorkflowStore();
  
  // Calculate node positions for the spatial map
  const workspacePoints = useMemo(() => {
    return workspaces.map((ws, i) => {
      const angle = (i / workspaces.length) * Math.PI * 2;
      const radius = 300;
      return {
        id: ws.id,
        name: ws.name,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        nodes: ws.nodes.length
      };
    });
  }, [workspaces]);

  // Pre-calculate stable animation heights for bottom bars to eliminate layout overhead and lag
  const pulseHeights = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      h1: 8 + (Math.sin(i * 1.5) + 1) * 6,
      h2: 12 + (Math.cos(i * 2.2) + 1) * 10
    }));
  }, []);

  // Pre-calculate stable event trajectories using simple deterministic string hash to prevent Jitter & CPU reload
  const stableEvents = useMemo(() => {
    return events.slice(0, 3).map((ev) => {
      let hashX = 0;
      let hashY = 0;
      const str = ev.id || "";
      for (let j = 0; j < str.length; j++) {
        const char = str.charCodeAt(j);
        if (j % 2 === 0) {
          hashX = (hashX << 5) - hashX + char;
        } else {
          hashY = (hashY << 5) - hashY + char;
        }
      }
      const targetX = (Math.abs(hashX) % 500) - 250;
      const targetY = (Math.abs(hashY) % 500) - 250;
      return {
        ...ev,
        targetX,
        targetY
      };
    });
  }, [events]);

  return (
    <div className="flex-1 overflow-hidden relative bg-[#010101] flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00f2ff05_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Top HUD */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 z-10 pointer-events-none">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-vox-primary animate-pulse shadow-[0_0_10px_rgba(0,242,255,0.8)]" />
             <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Digital Twin Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter italic uppercase leading-[0.85]">
            Neural <br className="sm:hidden" /><span className="text-vox-primary">Sphere</span>
          </h1>
        </div>

        <div className="flex gap-8 sm:gap-12">
           <div className="text-right">
              <span className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Active Synapses</span>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tighter">
                {workspaces.reduce((acc, w) => acc + w.nodes.length, 0)}
              </p>
           </div>
           <div className="text-right">
              <span className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Mesh Stability</span>
              <p className="text-xl sm:text-2xl font-black text-vox-primary tracking-tighter">0.99</p>
           </div>
        </div>
      </div>

      {/* Temporal Visualizer (Bottom) - Hidden on Mobile */}
      <div className="hidden lg:flex absolute bottom-12 left-12 right-12 justify-between items-end z-10 pointer-events-none">
         <div className="w-64 space-y-4">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Agent Coordination Pulse</span>
            <div className="flex items-end gap-1 h-8">
               {pulseHeights.map((bar, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: [10, bar.h2, 10] }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                   className="w-1 bg-vox-secondary/40 rounded-full"
                 />
               ))}
            </div>
         </div>

         <div className="flex gap-4">
            <HUDStat label="AOC Latency" value="12ms" />
            <HUDStat label="Throughput" value="1.4M OPS" />
         </div>
      </div>

      {/* Spatial Map Content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-8 pb-64 md:pb-0">
         <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center scale-[0.75] sm:scale-[0.85] md:scale-100 lg:scale-110 transition-transform duration-700">
            {/* Connection Lines (SVG) */}
            <svg viewBox="0 0 800 800" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
               <defs>
                  <filter id="glow">
                     <feGaussianBlur stdDeviation="2" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
               </defs>
               {workspacePoints.map((p, i) => (
                  <React.Fragment key={`lines-${p.id}`}>
                     {/* Lines to center */}
                     <motion.line 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: i * 0.2 }}
                        x1="400" y1="400"
                        x2={400 + p.x} y2={400 + p.y}
                        stroke="rgba(0, 242, 255, 0.1)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                     />
                     {/* Arcs between nodes */}
                     {workspacePoints[i + 1] && (
                        <motion.path 
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition={{ duration: 3, delay: i * 0.3 }}
                           d={`M ${400 + p.x} ${400 + p.y} Q 400 400 ${400 + workspacePoints[i+1].x} ${400 + workspacePoints[i+1].y}`}
                           fill="none"
                           stroke="rgba(112, 0, 255, 0.05)"
                           strokeWidth="0.5"
                        />
                     )}
                  </React.Fragment>
               ))}
            </svg>

            {/* Central Governance Hub */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
               className="absolute z-20"
            >
               <div className="w-48 h-48 rounded-full border border-vox-primary/10 flex items-center justify-center relative">
                  <div className="absolute inset-2 border border-vox-secondary/5 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-8 border border-white/5 rounded-full animate-[spin_30s_linear_reverse_infinite]" />
                  <div className="w-16 h-16 rounded-full bg-vox-bg border border-vox-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(0,242,255,0.1)]">
                     <Cpu size={32} className="text-vox-primary animate-pulse" />
                  </div>
                  
                  {/* Rotating Satellites */}
                  {[0, 1, 2].map(s => (
                    <motion.div 
                      key={s}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15 + s * 5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0"
                    >
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-vox-primary/40 shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
                    </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* Department Clusters */}
            {workspacePoints.map((p, i) => (
               <motion.div 
                  key={p.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  style={{ 
                     left: `calc(50% + ${p.x}px)`, 
                     top: `calc(50% + ${p.y}px)` 
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
               >
                  <button 
                    onClick={() => switchWorkspace(p.id)}
                    className={cn(
                       "relative group p-4 rounded-[2rem] border transition-all duration-500",
                       p.id === currentWorkspaceId 
                         ? "bg-vox-primary/10 border-vox-primary shadow-[0_0_50px_rgba(0,242,255,0.2)]" 
                         : "bg-white/[0.02] border-white/5 hover:border-vox-primary/30"
                    )}
                  >
                     <div className="flex flex-col items-center gap-3">
                        <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                           p.id === currentWorkspaceId ? "bg-vox-primary text-vox-bg" : "bg-white/5 text-white/20 group-hover:text-vox-primary"
                        )}>
                           <Layers size={20} />
                        </div>
                        <div className="text-center">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{p.name}</p>
                           <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1.5">{p.nodes} Synapses</p>
                        </div>
                     </div>
                     
                     {/* Pulse effect if active */}
                     {p.id === currentWorkspaceId && (
                       <motion.div 
                         animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
                         transition={{ duration: 2, repeat: Infinity }}
                         className="absolute inset-0 rounded-[2rem] border-2 border-vox-primary"
                       />
                     )}
                  </button>
               </motion.div>
            ))}

            {/* Data Stream Simulation */}
            <AnimatePresence>
               {stableEvents.map((ev) => (
                  <motion.div 
                    key={`stream-${ev.id}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                       opacity: [0, 1, 1, 0],
                       scale: [0.5, 1, 1, 0.5],
                       x: [0, ev.targetX],
                       y: [0, ev.targetY]
                    }}
                    transition={{ duration: 4 }}
                    className="absolute z-10 pointer-events-none"
                  >
                     <div className="flex items-center gap-2 p-2 rounded-full bg-vox-secondary/10 border border-vox-secondary/20 backdrop-blur-md">
                        <div className="w-1 h-1 rounded-full bg-vox-secondary animate-pulse" />
                        <span className="text-[8px] font-black text-vox-secondary uppercase tracking-widest">{ev.type}</span>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>

      {/* Mesh Status Overlays - Hidden on small screens */}
      <div className="hidden xl:block absolute right-12 top-32 w-72 space-y-8 z-10">
         <DigitalSection title="Agent Mesh Coordination">
            <div className="grid grid-cols-2 gap-2">
               {agents.map(agent => (
                  <div key={agent.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest truncate">{agent.name}</span>
                        <div className={cn(
                           "w-1 h-1 rounded-full",
                           agent.status === 'executing' ? "bg-vox-primary" : "bg-white/10"
                        )} />
                     </div>
                     <p className="text-[8px] font-bold text-vox-primary truncate uppercase">{agent.lastAction}</p>
                  </div>
               ))}
            </div>
         </DigitalSection>

         <DigitalSection title="Active Simulations">
            <div className="space-y-3">
               <div className="p-4 rounded-2xl bg-vox-secondary/5 border border-vox-secondary/10 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">Sovereign Recovery</p>
                     <p className="text-[8px] font-bold text-vox-secondary uppercase">Scenario_Delta active</p>
                  </div>
                  <Zap size={14} className="text-vox-secondary animate-pulse" />
               </div>
            </div>
         </DigitalSection>
      </div>
    </div>
  );
};

const HUDStat = ({ label, value }: any) => (
  <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block mb-1">{label}</span>
     <span className="text-xl font-black text-white tracking-tighter uppercase">{value}</span>
  </div>
);

const DigitalSection = ({ title, children }: any) => (
  <div className="space-y-4">
     <div className="flex items-center gap-2">
        <Network size={12} className="text-vox-primary" />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">{title}</span>
     </div>
     {children}
  </div>
);
