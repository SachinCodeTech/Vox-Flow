import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWorkflowStore, Policy, Simulation, EnterpriseEvent } from '../store/useWorkflowStore';
import { 
  ShieldCheck, 
  FileLock2, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  Database,
  Search,
  CheckCircle2,
  Activity,
  Play,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

export const GovernanceHub = () => {
  const { policies, simulations, events, updatePolicyStatus, runSimulation } = useWorkflowStore();

  const handleSimulateStaffing = () => {
    runSimulation({
      target: 'Staffing Capacity',
      scenario: '40% Workload Increase',
      outcome: 'negative',
      confidence: 0.88,
      results: ['Project Sigma delay: 12 days', 'Resource burnout risk: Critical', 'Overtaxed: Arch Dept']
    });
  };

  const handleSimulateStorage = () => {
    runSimulation({
      target: 'Storage Infrastructure',
      scenario: '30-day Retention Policy',
      outcome: 'positive',
      confidence: 0.94,
      results: ['Saves 4.2TB monthly', 'Performance increase: 12%', 'No compliance drift']
    });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#030303] p-6 lg:p-10 space-y-12 pb-48 sm:pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-vox-secondary">
            <ShieldCheck size={16} className="sm:w-5 sm:h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Enterprise Sovereignty Layer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter italic uppercase leading-[0.85]">
            Governance <br className="sm:hidden" /><span className="text-vox-secondary">Core</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
          <div className="px-3 py-1.5 flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-emerald-400" />
             <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Compliance Status</span>
          </div>
          <div className="px-5 py-1.5 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Policy Engine */}
        <div className="xl:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] flex items-center gap-3">
                <FileLock2 size={12} className="text-vox-secondary" />
                Sovereign Policy Engine
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {policies.map(policy => (
                 <motion.div 
                   key={policy.id}
                   whileHover={{ y: -1 }}
                   className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-vox-secondary/30 transition-all group"
                 >
                    <div className="flex items-center justify-between mb-3">
                       <div className={cn(
                         "p-2.5 rounded-xl bg-white/5",
                         policy.status === 'active' ? "text-emerald-400" : "text-vox-secondary"
                       )}>
                         <ShieldCheck size={18} />
                       </div>
                       <div className={cn(
                         "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border",
                         policy.severity === 'critical' ? "border-red-400/20 text-red-400 bg-red-400/5" : "border-white/10 text-white/60 bg-white/5"
                       )}>
                         {policy.severity}
                       </div>
                    </div>
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{policy.name}</h3>
                    <div className="space-y-1 mb-4">
                       {policy.rules.map((rule, ri) => (
                         <div key={ri} className="flex items-center gap-2 text-[8px] text-white/40 font-bold uppercase tracking-tight">
                            <div className="w-1 h-1 rounded-full bg-vox-secondary opacity-60" />
                            {rule}
                         </div>
                       ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                       <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Enforcement: Auto</span>
                       <button 
                         onClick={() => updatePolicyStatus(policy.id, policy.status === 'active' ? 'evaluating' : 'active')}
                         className="text-[8px] font-black text-vox-secondary uppercase tracking-[0.2em] hover:text-white transition-colors"
                       >
                         {policy.status === 'active' ? 'Deactivate' : 'Enable'}
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* Simulation Engine */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] flex items-center gap-3">
                <Brain size={12} className="text-vox-primary" />
                Simulation Terminal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Sim Generators */}
               <div className="space-y-2">
                  <SimTrigger 
                    title="Staffing Impact" 
                    desc="Calculate burnout vs velocity"
                    onClick={handleSimulateStaffing}
                  />
                  <SimTrigger 
                    title="Infrastructure Load" 
                    desc="Analyze latency thresholds"
                    onClick={handleSimulateStorage}
                  />
               </div>

               {/* Sim Results */}
               <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-6 space-y-4 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-vox-primary/5 blur-3xl" />
                  <AnimatePresence mode="wait">
                    {simulations.length > 0 ? (
                      <motion.div 
                        key={simulations[0].id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="space-y-4"
                      >
                         <div className="flex items-center justify-between">
                            <div>
                               <span className="text-[8px] font-black text-vox-primary uppercase tracking-[0.4em]">Success</span>
                               <h4 className="text-sm font-black text-white tracking-tighter uppercase">{simulations[0].target}</h4>
                            </div>
                            <div className={cn(
                               "w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px]",
                               simulations[0].outcome === 'negative' ? "bg-red-400 text-black" : "bg-emerald-400 text-black"
                            )}>
                               {(simulations[0].confidence * 100).toFixed(0)}%
                            </div>
                         </div>
                         <div className="space-y-1.5">
                            {simulations[0].results.map((res, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                                 <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">{res}</span>
                                 <CheckCircle2 size={10} className={simulations[0].outcome === 'negative' ? "text-red-400" : "text-emerald-400"} />
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center text-center gap-2">
                        <Cpu className="text-white/10 animate-pulse" size={24} />
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Awaiting Trigger</p>
                      </div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </section>
        </div>

        {/* Global Event Stream */}
        <div className="space-y-8">
           <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Activity size={12} className="text-vox-primary" />
                  Live Event Stream
                </h2>
                <div className="px-2 py-0.5 rounded bg-vox-primary/10 border border-vox-primary/20 text-[7px] font-black text-vox-primary">LIVE</div>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                 {events.length === 0 ? (
                   <div className="p-6 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest italic">Awaiting organizational events...</p>
                   </div>
                 ) : (
                   events.map((event, i) => (
                     <motion.div 
                       key={event.id}
                       initial={{ x: 20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ delay: i * 0.05 }}
                       className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-vox-primary/20 transition-all group"
                     >
                        <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[7px] font-black text-vox-primary uppercase tracking-widest">{event.type}</span>
                           <span className="text-[7px] font-bold text-white/20">{new Date(event.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9px] font-bold text-white/80 mb-2 uppercase tracking-tight">{event.payload}</p>
                        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                           <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Src: {event.source}</span>
                           <div className="flex items-center gap-1">
                              <div className="w-10 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-vox-primary" style={{ width: `${event.impact * 100}%` }} />
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   ))
                 )}
              </div>
           </section>

           {/* Governance Stats */}
           <div className="p-6 rounded-[2rem] bg-vox-secondary/[0.02] border border-vox-secondary/10 space-y-5">
              <h3 className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em] flex items-center gap-2">
                 <Zap size={10} className="text-vox-secondary" />
                 Decision Metrics
              </h3>
              <div className="space-y-3">
                 <MetricLine label="Autonomous Enforcement" value="94.2%" color="bg-vox-secondary" />
                 <MetricLine label="Compliance Stability" value="0.99" color="bg-emerald-400" />
                 <MetricLine label="Infrastructure Drift" value="0.04%" color="bg-red-400" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SimTrigger = ({ title, desc, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-vox-primary transition-all flex items-center justify-between text-left group"
  >
    <div className="flex-1">
       <h4 className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">{title}</h4>
       <p className="text-[8px] text-white/40 font-black uppercase tracking-tight italic">{desc}</p>
    </div>
    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-vox-primary group-hover:text-vox-bg transition-all">
       <Play size={10} fill="currentColor" />
    </div>
  </button>
);

const MetricLine = ({ label, value, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[7px] font-black uppercase tracking-widest">
      <span className="text-white/50">{label}</span>
      <span className="text-white">{value}</span>
    </div>
    <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={cn("h-full", color)} style={{ width: value }} />
    </div>
  </div>
);

const Brain = ({ size, className }: any) => (
  <Cpu size={size} className={className} />
);
