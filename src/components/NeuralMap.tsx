import React from 'react';
import { motion } from 'motion/react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { 
  Briefcase, 
  Activity, 
  ArrowUpRight, 
  Cpu, 
  ShieldCheck, 
  Globe,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

export const NeuralMap = () => {
  const { workspaces, currentWorkspaceId, switchWorkspace } = useWorkflowStore();

  return (
    <div className="flex-1 overflow-hidden relative bg-[#050816]">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      
      {/* HUD Elements */}
      <div className="absolute top-8 left-10 space-y-4 z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-vox-primary animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em]">Neural Enterprise Visualization</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter italic uppercase font-display leading-none">
          Cognitive <span className="text-vox-primary">Network</span>
        </h1>
      </div>

      <div className="absolute bottom-10 right-10 text-right z-10 pointer-events-none">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] mb-2">Network Nodes Merged</p>
        <p className="text-4xl font-black text-vox-primary font-display italic tracking-tighter">
          {workspaces.reduce((acc, w) => acc + w.nodes.length, 0)} <span className="text-[10px] text-white/20 uppercase">Units</span>
        </p>
      </div>

      {/* Center Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-5xl max-h-[700px] flex items-center justify-center">
          {/* Animated SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             {workspaces.map((ws, i) => {
               const angle = (i / workspaces.length) * Math.PI * 2;
               const x = 50 + Math.cos(angle) * 35;
               const y = 50 + Math.sin(angle) * 35;
               return (
                 <motion.line
                    key={`line-${ws.id}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 2, delay: i * 0.2 }}
                    x1="50%"
                    y1="50%"
                    x2={`${x}%`}
                    y2={`${y}%`}
                    stroke="var(--color-vox-primary)"
                    strokeWidth="1"
                    strokeDasharray="10 20"
                 />
               );
             })}
          </svg>

          {/* Central AOC Hub */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute z-20"
          >
            <div className="w-48 h-48 rounded-full bg-vox-panel/40 backdrop-blur-3xl border border-vox-primary/20 flex items-center justify-center relative shadow-[0_0_100px_rgba(0,229,255,0.1)]">
               <div className="absolute inset-[-10px] rounded-full border border-vox-primary/5 animate-[spin_20s_linear_infinite]" />
               <div className="absolute inset-[-20px] rounded-full border border-vox-primary/5 animate-[spin_30s_linear_reverse_infinite] border-dashed" />
               <div className="flex flex-col items-center">
                  <Cpu className="text-vox-primary mb-2 mb-4 animate-pulse" size={48} />
                  <span className="text-[10px] font-black text-vox-primary uppercase tracking-[0.8em] leading-none mb-1">AOC_CORE</span>
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Sovereign Node</span>
               </div>
            </div>
          </motion.div>

          {/* Workspace Nodes */}
          {workspaces.map((ws, i) => {
            const angle = (i / workspaces.length) * Math.PI * 2;
            const x = 50 + Math.cos(angle) * 35;
            const y = 50 + Math.sin(angle) * 35;
            const isActive = ws.id === currentWorkspaceId;

            return (
              <motion.button
                key={ws.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => switchWorkspace(ws.id)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 p-6 rounded-[2rem] border transition-all duration-500 group",
                  isActive 
                    ? "bg-vox-primary/10 border-vox-primary/40 shadow-[0_0_50px_rgba(0,229,255,0.15)] scale-110" 
                    : "bg-vox-panel/40 border-vox-border hover:border-vox-primary/30 hover:bg-vox-panel/60"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                    isActive ? "bg-vox-primary text-vox-bg" : "bg-white/5 text-white/30 group-hover:text-vox-primary group-hover:bg-vox-primary/10"
                  )}>
                    <Briefcase size={24} />
                  </div>
                  <div className="text-left">
                    <p className={cn(
                      "text-xs font-black uppercase tracking-[0.15em] mb-1",
                      isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                    )}>{ws.name}</p>
                    <p className="text-[9px] font-black text-vox-primary/40 uppercase tracking-[0.2em] leading-none">
                      {ws.nodes.length} Synaptic Links
                    </p>
                  </div>
                  <ArrowUpRight size={16} className={cn(
                    "transition-all",
                    isActive ? "text-vox-primary" : "text-white/5 group-hover:text-vox-primary"
                  )} />
                </div>

                {/* Satellite Orbits */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[1, 2].map((s) => {
                      return (
                        <motion.div
                          key={`sat-${s}`}
                          animate={{ 
                            rotate: [0, 360],
                          }}
                          transition={{ duration: 15 + s * 5, repeat: Infinity, ease: 'linear' }}
                          className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 border border-vox-primary/10 rounded-full"
                        >
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-vox-primary shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Neural Stats Panel */}
      <motion.div 
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        className="absolute right-10 top-32 w-72 space-y-8 z-10"
      >
        <HUDPanel title="Network Pulse" icon={Zap}>
          <div className="space-y-6">
             <StatLine label="Transmission Velocity" value="84%" color="bg-vox-primary" />
             <StatLine label="Synaptic Mesh Stability" value="99%" color="bg-vox-success" />
             <StatLine label="AI Interference" value="0.2%" color="bg-vox-secondary" />
          </div>
        </HUDPanel>

        <HUDPanel title="Security Guardian" icon={ShieldCheck}>
           <div className="text-[10px] text-white/30 uppercase font-black leading-relaxed tracking-[0.2em] mb-6">
             Neural conduits encrypted via Quantum Shifting. Zero-day evasion active.
           </div>
           <div className="flex items-center gap-1">
             <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ left: ['-100%', '200%'] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute top-0 bottom-0 w-1/3 bg-vox-primary" 
               />
             </div>
           </div>
        </HUDPanel>
      </motion.div>
    </div>
  );
};

const HUDPanel = ({ title, icon: Icon, children }: any) => (
  <div className="p-8 rounded-[3rem] bg-vox-panel/60 backdrop-blur-3xl border border-vox-border relative overflow-hidden shadow-2xl">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="text-vox-primary" size={16} />
      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] leading-none">{title}</span>
    </div>
    {children}
  </div>
);

const StatLine = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.3em]">
      <span className="text-white/30">{label}</span>
      <span className="text-white">{value}</span>
    </div>
    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={cn("h-full", color)} style={{ width: value }} />
    </div>
  </div>
);
