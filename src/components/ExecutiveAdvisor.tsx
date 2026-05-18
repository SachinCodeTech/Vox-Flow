import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflowStore, StrategicAdvice, MemoryPattern } from '../store/useWorkflowStore';
import { 
  Brain, 
  TrendingUp, 
  History, 
  Target, 
  ShieldCheck, 
  Zap, 
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  BarChart3,
  Scale,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';

export const ExecutiveAdvisor = () => {
  const { strategicAdvice, institutionalMemory, health, analyzeWorkflow, objectives } = useWorkflowStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMemories = institutionalMemory.filter(m => 
    m.pattern.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.context.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-6 lg:p-10 space-y-12 pb-48 sm:pb-28">
      {/* Strategic HUD */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-vox-primary shadow-[0_0_15px_rgba(0,242,255,0.5)]" />
             <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.6em]">Executive Strategic Layer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter italic uppercase leading-[0.85]">
            Institutional <br /><span className="text-vox-primary">Cognition</span>
          </h1>
          <button 
            onClick={analyzeWorkflow}
            className="mt-4 px-6 py-3 rounded-2xl bg-vox-primary/10 border border-vox-primary/30 text-[10px] font-black text-vox-primary uppercase tracking-[0.3em] hover:bg-vox-primary hover:text-vox-bg transition-all flex items-center gap-3 shadow-lg shadow-vox-primary/5 group"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /> Engage AI Architect
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto">
           <StatusBox label="Stability" value={health.stability} color="text-vox-primary" />
           <StatusBox label="Cognition" value={health.cognition} color="text-vox-secondary" />
           <StatusBox label="Velocity" value={health.velocity} color="text-emerald-400" />
           <StatusBox label="Risk" value={health.stress} color="text-red-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Strategic Intelligence Feed */}
        <div className="xl:col-span-2 space-y-10">
           <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] flex items-center gap-3">
                  <Lightbulb size={12} className="text-vox-primary" />
                  Strategic Intelligence Core
                </h2>
              </div>

              <div className="space-y-4">
                 {strategicAdvice.length === 0 ? (
                   <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 flex flex-col items-center gap-3 text-center">
                      <Sparkles size={24} className="text-vox-primary animate-pulse" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic max-w-xs">Synthesizing institutional data...</p>
                   </div>
                 ) : (
                   strategicAdvice.map((advice, i) => (
                     <motion.div 
                       key={advice.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-vox-primary/30 transition-all group relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 p-6">
                           <div className="flex flex-col items-end gap-1">
                              <span className="text-[8px] font-black text-vox-primary uppercase tracking-widest">Confidence</span>
                              <span className="text-xl font-black text-white tracking-tighter">{(advice.confidence * 100).toFixed(0)}%</span>
                           </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                advice.category === 'restructuring' ? "bg-vox-secondary/10 text-vox-secondary border border-vox-secondary/20" : "bg-vox-primary/10 text-vox-primary border border-vox-primary/20"
                              )}>
                                 {advice.category}
                              </div>
                           </div>

                           <div className="max-w-xl space-y-2">
                              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">{advice.title}</h3>
                              <p className="text-xs font-bold text-white/50 leading-relaxed italic">"{advice.recommendation}"</p>
                           </div>

                           <div className="pt-6 border-t border-white/5">
                              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">Rationale & Impact Analysis</p>
                              <p className="text-[10px] font-bold text-white/70 uppercase tracking-tight">{advice.rationale}</p>
                           </div>

                           {advice.actionable && (
                              <div className="pt-4">
                                 <button className="flex items-center gap-3 text-[9px] font-black text-vox-primary uppercase tracking-[0.4em] hover:text-white transition-all group/btn">
                                    Execute Strategic Shift
                                    <ArrowRight size={12} className="group-hover/btn:translate-x-2 transition-transform" />
                                 </button>
                              </div>
                           )}
                        </div>
                     </motion.div>
                   ))
                 )}
              </div>
           </section>

           {/* Institutional Memory Map */}
           <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                  <History size={14} className="text-vox-secondary" />
                  Sentient Memory Patterns
                </h2>
                <div className="relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-vox-secondary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="QUERY_MEMORIES..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-vox-secondary/40 transition-all w-48"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {institutionalMemory.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center gap-4 text-center opacity-50 grayscale">
                       <History size={24} />
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Zero historical patterns recorded</p>
                    </div>
                 ) : filteredMemories.map((mem, i) => (
                   <motion.div 
                     key={mem.id}
                     whileHover={{ y: -4 }}
                     className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-4"
                   >
                      <div className="flex items-center justify-between">
                         <div className={cn(
                           "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                           mem.occurrence === 'frequent' ? "bg-vox-secondary/10 text-vox-secondary" : "bg-white/5 text-white/20"
                         )}>
                            {mem.occurrence}
                         </div>
                         <span className="text-[8px] font-bold text-white/10">{new Date(mem.timestamp).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{mem.pattern}</h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase italic">{mem.context}</p>
                   </motion.div>
                 ))}
              </div>
           </section>
        </div>

        {/* Global Cognition Sidebar */}
        <div className="space-y-8 lg:space-y-12">
           <section className="p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] bg-vox-secondary/[0.02] border border-vox-secondary/10 space-y-8">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] flex items-center gap-3">
                 <Target size={14} className="text-vox-secondary" />
                 Institutional Objectives
              </h3>
              <div className="space-y-8">
                {objectives.map(obj => (
                  <Objective key={obj.id} label={obj.label} progress={obj.progress} />
                ))}
              </div>
           </section>

           <section className="space-y-8">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-3">
                 <Scale size={14} className="text-vox-primary" />
                 Governance Ethics
              </h3>
              <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-vox-primary/10 bg-vox-primary/[0.01] space-y-4">
                 <div className="flex items-center gap-3 text-vox-primary">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sentient Guardrails</span>
                 </div>
                 <p className="text-[10px] font-bold text-white/40 uppercase leading-loose italic">
                    AI operational limits are self-correcting based on institutional health. 
                    Zero human intervention required for safety parity.
                 </p>
              </div>
           </section>

           <section className="space-y-6">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-3">
                 <ArrowRight size={14} className="text-white/20" />
                 Predictive Analytics
              </h3>
              <div className="space-y-3">
                 <TrendItem label="Storage Exhaustion" days={11} color="text-red-400" />
                 <TrendItem label="Approval Bottlenecks" days={4} color="text-vox-secondary" />
                 <TrendItem label="Compute Saturation" days={22} color="text-emerald-400" />
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

const StatusBox = ({ label, value, color }: any) => (
  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
     <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">{label}</span>
     <p className={cn("text-xl font-black italic uppercase tracking-tighter", color)}>
        {(value * 100).toFixed(0)}%
     </p>
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

const TrendItem = ({ label, days, color }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5">
     <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{label}</span>
     <span className={cn("text-[10px] font-black uppercase italic", color)}>~{days} Days</span>
  </div>
);
