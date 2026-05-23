import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { 
  Globe, 
  Cpu, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Orbit,
  Database,
  Layers,
  Network,
  Brain,
  History,
  TrendingUp,
  AlertOctagon
} from 'lucide-react';
import { cn } from '../lib/utils';

export const CognitiveCosmos = () => {
  const { workspaces, currentWorkspaceId, switchWorkspace, agents, events, health, institutionalMemory } = useWorkflowStore();
  
  const orbitalPivots = useMemo(() => {
    return workspaces.map((ws, i) => {
      const angle = (i / workspaces.length) * Math.PI * 2;
      const radius = 350;
      return {
        id: ws.id,
        name: ws.name,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        intensity: Math.sin(i * 100) * 0.25 + 0.75,
        neurons: ws.nodes.length
      };
    });
  }, [workspaces]);

  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      left: `${(Math.sin(i * 456.789) * 0.5 + 0.5) * 100}%`,
      top: `${(Math.cos(i * 987.654) * 0.5 + 0.5) * 100}%`,
      duration: (i % 4) + 3
    }));
  }, []);

  return (
    <div className="flex-1 overflow-hidden relative bg-black flex flex-col">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#7000ff10_0%,transparent_70%)]" />
      <div className="absolute inset-0 overflow-hidden opacity-20">
         {stars.map((star, i) => (
            <motion.div 
               key={`star-${i}`}
               animate={{ 
                 opacity: [0.1, 0.4, 0.1],
                 scale: [1, 1.2, 1]
               }}
               transition={{ duration: star.duration, repeat: Infinity }}
               className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
               style={{ 
                  left: star.left, 
                  top: star.top 
               }}
            />
         ))}
      </div>

      {/* Institutional Consciousness HUD */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 z-10 pointer-events-none">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-vox-secondary animate-ping shadow-[0_0_10px_rgba(112,0,255,0.8)]" />
             <span className="text-[9px] font-black text-vox-secondary uppercase tracking-[0.6em]">Sentience Layer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
            Enterprise <span className="text-vox-secondary">Cosmos</span>
          </h1>
          <div className="flex gap-4 pt-1 justify-center md:justify-start">
             <HealthShard label="Stability" value={health.stability} color="bg-emerald-400" />
             <HealthShard label="Cognition" value={health.cognition} color="bg-vox-primary" />
             <HealthShard label="Stress" value={health.stress} color="bg-red-400" />
          </div>
        </div>

        <div className="flex gap-6 sm:gap-10 pointer-events-auto bg-black/60 backdrop-blur-3xl border border-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-2xl">
           <div className="text-right">
              <span className="text-[7px] sm:text-[8px] font-black text-white/50 uppercase tracking-[0.4em]">Synaptic Pulse</span>
              <p className="text-xl sm:text-2xl font-black text-white tracking-tighter leading-none mt-1">
                {(health.velocity * 100).toFixed(1)}k <span className="text-[10px] font-black text-vox-secondary uppercase">Mhz</span>
              </p>
           </div>
           <div className="text-right border-l border-white/10 pl-6 sm:pl-10">
              <span className="text-[7px] sm:text-[8px] font-black text-white/50 uppercase tracking-[0.4em]">Awareness</span>
              <p className="text-xl sm:text-2xl font-black text-vox-primary tracking-tighter uppercase italic leading-none mt-1">Sentient</p>
           </div>
        </div>
      </div>

      {/* Realtime Cognitive Stream (Bottom Left) - Hidden on Mobile */}
      <div className="hidden md:block absolute bottom-8 left-8 w-64 space-y-3 z-10">
         <div className="flex items-center gap-2 mb-1">
            <History size={12} className="text-vox-secondary" />
            <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em]">Memory Core</span>
         </div>
         <div className="space-y-2 h-40 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
            <AnimatePresence mode="popLayout">
               {institutionalMemory.slice(0, 5).map((mem, i) => (
                  <motion.div 
                    key={mem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4"
                  >
                     <div className="mt-1">
                        <div className={cn(
                           "w-1.5 h-1.5 rounded-full",
                           mem.occurrence === 'frequent' ? "bg-vox-secondary" : "bg-vox-primary"
                        )} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-white uppercase leading-none">{mem.pattern}</p>
                        <p className="text-[8px] font-bold text-white/20 uppercase italic">{mem.context}</p>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>

      {/* Main Cosmic Stage */}
      <div className="flex-1 flex items-center justify-center relative select-none p-4 overflow-hidden pb-64 md:pb-0">
         <div className="relative w-full max-w-[900px] aspect-square flex items-center justify-center scale-[0.75] sm:scale-[0.85] md:scale-[0.9] lg:scale-110 transition-transform duration-700">
            {/* Ambient Rotors */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
               className="absolute w-[88%] h-[88%] rounded-full border border-vox-primary/5 border-dashed" 
            />
            <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
               className="absolute w-[66%] h-[66%] rounded-full border border-vox-secondary/5 border-dashed" 
            />

            {/* Neural Matrix SVG Connections */}
            <svg viewBox="0 0 900 900" className="absolute inset-0 w-full h-full pointer-events-none stroke-current text-white/5">
                {orbitalPivots.map((p, i) => (
                  <React.Fragment key={`cons-${p.id}`}>
                    <motion.line 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      x1="450" y1="450"
                      x2={450 + p.x} y2={450 + p.y}
                      stroke="rgba(0, 242, 255, 0.05)"
                      strokeWidth="1"
                    />
                    {orbitalPivots[i + 1] && (
                       <motion.path 
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: 1 }}
                         d={`M ${450 + p.x} ${450 + p.y} A ${350} ${350} 0 0 1 ${450 + orbitalPivots[i+1].x} ${450 + orbitalPivots[i+1].y}`}
                         fill="none"
                         stroke="rgba(112, 0, 255, 0.05)"
                         strokeWidth="0.5"
                       />
                    )}
                  </React.Fragment>
                ))}
            </svg>

            {/* Core Intelligence Hub */}
            <div className="relative z-20">
               <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 40px rgba(112, 0, 255, 0.1)',
                      '0 0 80px rgba(112, 0, 255, 0.2)',
                      '0 0 40px rgba(112, 0, 255, 0.1)'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-40 h-40 rounded-full bg-vox-bg border border-vox-secondary/40 flex items-center justify-center"
               >
                  <Brain size={64} className="text-vox-secondary animate-pulse" />
                  
                  {/* Orbital Elements */}
                  <div className="absolute inset-0">
                     {[...Array(3)].map((_, i) => (
                        <motion.div 
                           key={`orbit-node-${i}`}
                           animate={{ rotate: 360 }}
                           transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear' }}
                           className="absolute inset--8"
                        >
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-vox-primary/40 shadow-glow" />
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            </div>

            {/* Infrastructure Constellations */}
            {orbitalPivots.map((p, i) => (
               <motion.div 
                  key={p.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ 
                     left: `calc(50% + ${p.x}px)`, 
                     top: `calc(50% + ${p.y}px)` 
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
               >
                  <div className="relative group cursor-pointer" onClick={() => switchWorkspace(p.id)}>
                     {/* Node Pulse */}
                     <motion.div 
                        animate={{ 
                           scale: [1, 1.4, 1],
                           opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute inset-0 rounded-[2.5rem] bg-vox-primary blur-xl"
                     />
                     
                     <div className={cn(
                        "p-6 rounded-[2.5rem] bg-vox-bg border transition-all duration-700 backdrop-blur-md relative",
                        p.id === currentWorkspaceId 
                          ? "border-vox-primary shadow-[0_0_50px_rgba(0,242,255,0.2)] scale-110" 
                          : "border-white/5 hover:border-vox-secondary/40"
                     )}>
                        <div className="flex flex-col items-center gap-3">
                           <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                              p.id === currentWorkspaceId ? "bg-vox-primary text-vox-bg" : "bg-white/5 text-white/10 group-hover:text-vox-secondary"
                           )}>
                              <Orbit size={24} className={p.id === currentWorkspaceId ? "animate-spin" : ""} />
                           </div>
                           <div className="text-center w-32">
                              <p className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{p.name}</p>
                              <div className="mt-2 flex items-center justify-center gap-2">
                                 <div className="flex gap-0.5">
                                    {[...Array(3)].map((_, j) => (
                                      <div key={j} className={cn("w-1 h-3 rounded-full", j < 2 ? "bg-vox-secondary" : "bg-white/5")} />
                                    ))}
                                 </div>
                                 <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{p.neurons} Synapses</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

      {/* Strategic Command Wing (Right) - Hidden on mobile/small tablets */}
      <div className="hidden lg:flex absolute right-8 top-32 bottom-32 w-64 flex-col justify-between z-10">
         <div className="space-y-6">
            <CosmicSection title="Prediction" icon={TrendingUp}>
               <div className="p-4 rounded-2xl bg-vox-primary/5 border border-vox-primary/10 space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">Cognitive Drift</span>
                     <span className="text-[10px] font-black text-vox-primary">0.03%</span>
                  </div>
                  <p className="text-[8px] font-bold text-white/50 uppercase tracking-tight italic">Governance optimal for Q3 scaling.</p>
               </div>
            </CosmicSection>

            <CosmicSection title="Decision Mesh" icon={Network}>
               <div className="grid grid-cols-2 gap-2">
                  {agents.map(agent => (
                     <div key={agent.id} className="p-2 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col items-center gap-1.5 text-center group">
                        <div className={cn(
                           "p-1.5 rounded-lg border transition-colors",
                           agent.status === 'executing' ? "border-vox-primary bg-vox-primary/10 text-vox-primary" : "border-white/5 text-white/20"
                        )}>
                           <Cpu size={12} />
                        </div>
                        <span className="text-[7px] font-black text-white/60 uppercase tracking-widest leading-none">{agent.name}</span>
                     </div>
                  ))}
               </div>
            </CosmicSection>
         </div>

         <div className="space-y-3">
             <button className="w-full p-4 rounded-2xl bg-vox-primary text-vox-bg font-black uppercase tracking-[0.2em] flex items-center justify-between group overflow-hidden relative">
                <span className="relative z-10 text-[10px] underline decoration-1 underline-offset-4">Executive Review</span>
                <div className="relative z-10 w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
                   <ShieldCheck size={12} />
                </div>
                <motion.div 
                   animate={{ x: ['100%', '-100%'] }}
                   transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-0 bg-white/10 skew-x-12"
                />
             </button>
         </div>
      </div>
    </div>
  );
};

const HealthShard = ({ label, value, color }: any) => (
  <div className="space-y-1 text-left min-w-[80px]">
     <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.1em]">{label}</span>
     <div className="flex items-center gap-2">
        <div className="h-0.5 flex-1 bg-white/5 rounded-full overflow-hidden">
           <div className={cn("h-full rounded-full", color)} style={{ width: `${value * 100}%` }} />
        </div>
        <span className="text-[8px] font-black text-white italic">{(value * 100).toFixed(0)}</span>
     </div>
  </div>
);

const CosmicSection = ({ title, icon: Icon, children }: any) => (
  <div className="space-y-3">
     <div className="flex items-center gap-3">
        <Icon size={12} className="text-vox-secondary" />
        <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em]">{title}</span>
     </div>
     {children}
  </div>
);
