import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflowStore, StrategicAdvice, MemoryPattern } from '../store/useWorkflowStore';
import { 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  History, 
  TrendingUp, 
  ShieldAlert, 
  ChevronRight,
  Database,
  Cpu,
  BarChart2,
  Activity,
  ArrowRight,
  Target,
  Scale,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

export const ExecutiveAdvisor = () => {
  const { strategicAdvice, institutionalMemory, health } = useWorkflowStore();

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050816] p-10 lg:p-16 space-y-20 pb-48">
      {/* Cinematic Header */}
      <div className="relative">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-vox-secondary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-vox-primary">
              <BrainCircuit size={24} className="text-glow" />
              <span className="text-[10px] font-black uppercase tracking-[0.8em]">Neural Advisory Core</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter italic uppercase leading-[0.8] font-display">
              Cognitive <br className="sm:hidden" /><span className="text-vox-primary text-glow">Intelligence</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-end gap-3 px-10 py-6 bg-vox-panel/40 border border-vox-border rounded-[2.5rem] shadow-2xl">
             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em] italic">Systemic_Health</span>
             <div className="flex gap-1">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1 h-8 rounded-full transition-all duration-1000",
                      i < health.stability * 20 ? "bg-vox-primary shadow-[0_0_10px_rgba(0,229,255,0.5)]" : "bg-white/5"
                    )}
                    style={{ 
                      height: `${10 + Math.random() * 30}px`,
                      opacity: 0.3 + (i / 20) * 0.7 
                    }}
                  />
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        {/* Strategic Recommendations */}
        <div className="xl:col-span-2 space-y-12">
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] flex items-center gap-4">
                <Sparkles size={20} className="text-vox-secondary" />
                Strategic Synthesis
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
               {strategicAdvice.length === 0 ? (
                 <div className="p-16 rounded-[4rem] bg-vox-panel/40 border border-vox-border flex flex-col items-center gap-6 text-center shadow-2xl">
                    <BrainCircuit size={48} className="text-vox-primary animate-pulse blur-[1px]" />
                    <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic max-w-sm">Synthesizing institutional logic patterns...</p>
                 </div>
               ) : (
                 strategicAdvice.map((advice, i) => (
                   <motion.div 
                     key={advice.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     whileHover={{ x: 10 }}
                     className="p-10 rounded-[3.5rem] bg-vox-panel/40 border border-vox-border hover:border-vox-primary/40 transition-all group relative overflow-hidden shadow-2xl"
                   >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-vox-primary/[0.02] border-l border-b border-vox-border/10 rounded-bl-[10rem] flex items-center justify-center p-12">
                         <span className="text-8xl font-black text-white/[0.02] italic select-none">0{i+1}</span>
                      </div>

                      <div className="relative z-10 flex flex-col md:flex-row gap-12">
                         <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                               <div className={cn(
                                 "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] border",
                                 advice.category === 'restructuring' ? "border-vox-secondary/40 text-vox-secondary bg-vox-secondary/5" :
                                 advice.category === 'velocity' ? "border-vox-success/40 text-vox-success bg-vox-success/5" :
                                 "border-vox-primary/40 text-vox-primary bg-vox-primary/5"
                               )}>
                                 {advice.category}
                               </div>
                               <div className="flex items-center gap-2">
                                  <Activity size={12} className="text-white/20" />
                                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Confidence: {(advice.confidence * 100).toFixed(0)}%</span>
                               </div>
                            </div>
                            
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic font-display leading-[0.9]">{advice.title}</h3>
                            <p className="text-lg text-white/70 font-medium leading-snug max-w-2xl italic tracking-wide">"{advice.recommendation}"</p>
                         </div>

                         <div className="w-px h-auto bg-vox-border hidden md:block" />

                         <div className="md:w-64 space-y-6 flex flex-col justify-between">
                            <div>
                               <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] block mb-2">Rationale</span>
                               <p className="text-[11px] text-white/40 font-black uppercase tracking-tight leading-relaxed">{advice.rationale}</p>
                            </div>
                            {advice.actionable && (
                              <button className="w-full py-4 rounded-2xl bg-vox-primary text-vox-bg text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                                 Execute_Logic
                              </button>
                            )}
                         </div>
                      </div>
                   </motion.div>
                 ))
               )}
            </div>
          </section>

          {/* Institutional Memory Map */}
          <section className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] flex items-center gap-4">
                <History size={20} className="text-vox-secondary" />
                Persistent Patterns
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {institutionalMemory.map((mem) => (
                 <div key={mem.id} className="p-8 rounded-[2.5rem] bg-black/40 border border-vox-border hover:border-vox-secondary/40 transition-all flex items-center gap-8 shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-vox-secondary/10 flex items-center justify-center border border-vox-secondary/20">
                       <Database size={24} className="text-vox-secondary" />
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-white uppercase tracking-tighter font-display italic leading-none mb-1">{mem.pattern}</h4>
                       <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic">{mem.occurrence}</span>
                          <span className="text-[9px] font-black text-vox-primary uppercase tracking-[0.4em]">Context: System</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Global Sentience HUD */}
        <div className="space-y-12">
           <section className="space-y-8">
              <h2 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] flex items-center gap-4">
                <Activity size={20} className="text-vox-primary" />
                Sentience HUD
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                 <SentienceCard label="Stability" value={health.stability} color="text-vox-success" />
                 <SentienceCard label="Cognition" value={health.cognition} color="text-vox-primary" />
                 <SentienceCard label="Velocity" value={health.velocity} color="text-vox-secondary" />
                 <SentienceCard label="Stress" value={health.stress} color="text-red-500" inverse />
              </div>
           </section>

           <section className="p-10 rounded-[3.5rem] bg-vox-panel/40 border border-vox-border space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vox-secondary/5 blur-[80px] rounded-full" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.8em] flex items-center gap-4 relative z-10">
                 <Target size={18} className="text-vox-secondary" />
                 Institutional Vectors
              </h3>
              <div className="space-y-10 relative z-10">
                 <Objective label="Sovereign Efficiency" progress={94} />
                 <Objective label="Policy Integration" progress={82} />
                 <Objective label="Autonomous Scaling" progress={68} />
              </div>
           </section>

           <div className="p-10 rounded-[3.5rem] bg-vox-panel/60 border border-vox-border space-y-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vox-primary/5 blur-[80px] rounded-full" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-4">
                 <Cpu size={18} className="text-vox-primary" />
                 Neural Telemetry
              </h3>
              
              <div className="space-y-8">
                 {[...Array(4)].map((_, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Sector_0{i+1}_Output</span>
                         <span className="text-[11px] font-black text-white/60 tracking-widest italic">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${30 + Math.random() * 60}%` }}
                           transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                           className="h-full bg-vox-primary/40 shadow-[0_0_10px_rgba(0,229,255,0.3)]" 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SentienceCard = ({ label, value, color, inverse }: any) => (
  <div className="p-8 rounded-[2.5rem] bg-vox-panel/40 border border-vox-border space-y-4 hover:scale-105 transition-all shadow-xl">
     <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] block">{label}</span>
     <div className="flex items-end gap-3">
        <span className={cn("text-4xl font-black tracking-tighter italic font-display leading-none", color)}>
           {(value * 100).toFixed(0)}%
        </span>
        <div className={cn(
          "h-2 w-2 rounded-full mb-1 animate-pulse",
          inverse ? (value > 0.5 ? "bg-red-500" : "bg-vox-success") : (value > 0.8 ? "bg-vox-success" : "bg-vox-primary")
        )} />
     </div>
  </div>
);

const Objective = ({ label, progress }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-vox-secondary">{progress}%</span>
     </div>
     <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 2 }}
           className="h-full bg-vox-secondary shadow-[0_0_10px_rgba(112,0,255,0.5)]" 
        />
     </div>
  </div>
);
