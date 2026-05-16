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
    <div className="flex-1 overflow-hidden relative bg-[#030303]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2ff08_1px,transparent_1px)] [background-size:40px_40px]" />
      
      {/* HUD Elements */}
      <div className="absolute top-8 left-8 space-y-2 z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <Activity className="text-vox-primary animate-pulse" size={16} />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Neural Enterprise Visualization</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">
          COGNITIVE <span className="text-vox-primary">NETWORK</span>
        </h1>
      </div>

      <div className="absolute bottom-8 right-8 text-right z-10 pointer-events-none">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Nodes Synchronized</p>
        <p className="text-xl font-bold text-vox-primary">{workspaces.reduce((acc, w) => acc + w.nodes.length, 0)}</p>
      </div>

      {/* Center Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl max-h-[600px]">
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
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: i * 0.2 }}
                    x1="50%"
                    y1="50%"
                    x2={`${x}%`}
                    y2={`${y}%`}
                    stroke="rgba(0, 242, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                 />
               );
             })}
          </svg>

          {/* Central AOC Hub */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="w-32 h-32 rounded-full bg-vox-primary/5 border border-vox-primary/20 backdrop-blur-3xl flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border border-vox-primary/10 animate-[spin_10s_linear_infinite]" />
               <div className="absolute inset-4 rounded-full border border-vox-secondary/10 animate-[spin_15s_linear_reverse_infinite]" />
               <Cpu className="text-vox-primary animate-pulse" size={32} />
               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                 <span className="text-[10px] font-black text-vox-primary uppercase tracking-[0.5em]">AI_CORE_AOC</span>
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
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => switchWorkspace(ws.id)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl border transition-all group",
                  isActive 
                    ? "bg-vox-primary/10 border-vox-primary shadow-[0_0_30px_rgba(0,242,255,0.2)]" 
                    : "bg-white/[0.02] border-white/5 hover:border-vox-primary/30 hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    isActive ? "bg-vox-primary text-vox-bg" : "bg-white/5 text-white/20 group-hover:text-vox-primary group-hover:bg-vox-primary/10"
                  )}>
                    <Briefcase size={20} />
                  </div>
                  <div className="text-left">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      isActive ? "text-white" : "text-white/40"
                    )}>{ws.name}</p>
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                      {ws.nodes.length} Neural Pathways
                    </p>
                  </div>
                  <ArrowUpRight size={14} className={cn(
                    "transition-all",
                    isActive ? "text-vox-primary" : "text-white/5 group-hover:text-vox-primary"
                  )} />
                </div>

                {/* Satellite Nodes (Simulation) */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[1, 2, 3].map((s) => {
                      const sAngle = (s / 3) * Math.PI * 2;
                      return (
                        <motion.div
                          key={`sat-${s}`}
                          animate={{ 
                            rotate: [0, 360],
                          }}
                          transition={{ duration: 10 + s * 2, repeat: Infinity, ease: 'linear' }}
                          className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 border border-white/5 rounded-full"
                        >
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-vox-secondary shadow-[0_0_10px_rgba(112,0,255,0.5)]" />
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
        className="absolute right-8 top-24 w-64 space-y-6 z-10"
      >
        <HUDPanel title="System Pulse" icon={Zap}>
          <div className="space-y-3">
             <StatLine label="Network Load" value="24.8%" color="bg-vox-primary" />
             <StatLine label="Sync Stability" value="0.99" color="bg-emerald-400" />
             <StatLine label="AI Interference" value="02.1%" color="bg-vox-secondary" />
          </div>
        </HUDPanel>

        <HUDPanel title="Guardian Layer" icon={ShieldCheck}>
           <div className="text-[9px] text-white/20 uppercase font-black leading-relaxed tracking-[0.15em]">
             AES-512 Link Encrypted. Zero-day evasion protocols active.
           </div>
           <div className="flex items-center gap-1 mt-3">
             <div className="flex-1 h-1 bg-vox-primary/20 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ width: ['0%', '100%'] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="h-full bg-vox-primary" 
               />
             </div>
           </div>
        </HUDPanel>
      </motion.div>
    </div>
  );
};

const HUDPanel = ({ title, icon: Icon, children }: any) => (
  <div className="p-6 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/5 relative overflow-hidden">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="text-vox-primary" size={14} />
      <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">{title}</span>
    </div>
    {children}
  </div>
);

const StatLine = ({ label, value, color }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
      <span className="text-white/30">{label}</span>
      <span className="text-white">{value}</span>
    </div>
    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={cn("h-full", color)} style={{ width: value }} />
    </div>
  </div>
);
