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
  Cpu,
  Target,
  Brain as BrainCircuit
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
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050816] p-10 lg:p-16 space-y-20 pb-48">
      {/* Cinematic Header */}
      <div className="relative">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-vox-secondary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-vox-secondary">
              <ShieldCheck size={24} className="text-glow-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.8em]">Sovereignty Authority Matrix</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter italic uppercase leading-[0.8] font-display">
              Autonomous <br className="sm:hidden" /><span className="text-vox-secondary text-glow-secondary">Governance</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-vox-panel/40 p-2 rounded-[2.5rem] border border-vox-border shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-vox-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="px-6 py-4 flex items-center gap-4 relative z-10">
               <div className="w-3 h-3 rounded-full bg-vox-success animate-pulse shadow-[0_0_20px_rgba(0,255,163,0.5)]" />
               <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em]">Sovereign_Active</span>
            </div>
            <div className="px-8 py-4 bg-vox-secondary text-vox-bg rounded-[2rem] shadow-[0_0_30px_rgba(112,0,255,0.3)]">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] italic font-display">Protocol_094_V</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        {/* Policy Engine */}
        <div className="xl:col-span-2 space-y-12">
          <section className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] flex items-center gap-4">
                <FileLock2 size={24} className="text-vox-secondary" />
                Active Directives
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {policies && policies.map((policy, i) => (
                 <motion.div 
                    key={policy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="p-10 rounded-[3.5rem] bg-vox-panel/40 border border-vox-border hover:border-vox-secondary/40 transition-all group relative overflow-hidden shadow-2xl"
                 >
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-vox-secondary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-10 relative z-10">
                       <div className={cn(
                         "w-16 h-16 rounded-2xl flex items-center justify-center transition-all border",
                         policy.status === 'active' ? "bg-vox-success/10 text-vox-success border-vox-success/20 shadow-[0_0_40px_rgba(0,255,163,0.1)]" : "bg-white/5 text-white/20 border-vox-border"
                       )}>
                         <ShieldCheck size={28} />
                       </div>
                       <div className={cn(
                         "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] border",
                         policy.severity === 'critical' ? "border-red-500/30 text-red-500 bg-red-500/5 shadow-[0_0_30px_rgba(255,0,0,0.1)]" : "border-white/10 text-white/40 bg-white/5"
                       )}>
                         {policy.severity}_THREAT
                       </div>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic font-display mb-6 leading-none">{policy.name}</h3>
                    <div className="space-y-4 mb-12 relative z-10">
                       {policy.rules && policy.rules.map((rule, ri) => (
                         <div key={ri} className="flex items-start gap-4 text-[10px] text-white/50 font-black uppercase tracking-[0.2em] leading-relaxed">
                            <div className="w-2 h-2 rounded-full bg-vox-secondary/30 mt-1" />
                            {rule}
                         </div>
                       ))}
                    </div>
                    <div className="flex items-center justify-between pt-10 border-t border-vox-border relative z-10">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em] italic">Directive_Cycle: 400ms</span>
                       <button 
                         onClick={() => updatePolicyStatus(policy.id, policy.status === 'active' ? 'evaluating' : 'active')}
                         className={cn(
                           "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] transition-all",
                           policy.status === 'active' ? "bg-white/5 text-white/30 hover:bg-white/10" : "bg-vox-secondary text-vox-bg shadow-[0_0_20px_rgba(112,0,255,0.3)]"
                         )}
                       >
                         {policy.status === 'active' ? 'Standby' : 'Initialize'}
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* Simulation Engine */}
          <section className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] flex items-center gap-4">
                <BrainCircuitComponent size={24} className="text-vox-primary" />
                Evolutionary Simulations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Sim Generators */}
               <div className="space-y-6">
                  <SimTrigger 
                    title="Cognitive Overload" 
                    desc="Massive workload concurrency surge"
                    onClick={handleSimulateStaffing}
                  />
                  <SimTrigger 
                    title="Neural Storage Drift" 
                    desc="Historical logic retention audit"
                    onClick={handleSimulateStorage}
                  />
                  <div className="p-8 rounded-[2.5rem] bg-vox-panel/20 border border-vox-border border-dashed flex flex-col items-center justify-center gap-4 text-center">
                     <Play size={24} className="text-white/10" />
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em]">New_Scenario_Module</p>
                  </div>
               </div>

               {/* Sim Results UI */}
               <div className="bg-vox-panel/40 border border-vox-border rounded-[4rem] p-12 space-y-10 overflow-hidden relative shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-vox-primary/5 blur-[100px] rounded-full" />
                  <AnimatePresence mode="wait">
                    {(simulations && simulations.length > 0) ? (
                      <motion.div 
                        key={simulations[0].id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10 relative z-10"
                      >
                         <div className="flex items-center justify-between">
                            <div className="space-y-2">
                               <span className="text-[10px] font-black text-vox-primary uppercase tracking-[0.8em] italic block">Prediction_Output</span>
                               <h4 className="text-3xl font-black text-white tracking-tighter uppercase font-display italic leading-none">{simulations[0].target}</h4>
                            </div>
                            <div className={cn(
                               "w-20 h-20 rounded-[2.5rem] flex items-center justify-center font-black text-2xl italic font-display border-2 shadow-[0_0_40px_rgba(0,0,0,0.5)]",
                               simulations[0].outcome === 'negative' ? "bg-red-500/10 text-red-500 border-red-500/40" : "bg-vox-success/10 text-vox-success border-vox-success/40"
                            )}>
                               {(simulations[0].confidence * 100).toFixed(0)}%
                            </div>
                         </div>
                         <div className="space-y-4">
                            {simulations[0].results && simulations[0].results.map((res, i) => (
                              <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-black/40 border border-vox-border group hover:border-vox-primary/20 transition-all">
                                 <span className="text-[11px] font-black text-white/70 uppercase tracking-[0.1em]">{res}</span>
                                 <CheckCircle2 size={16} className={simulations[0].outcome === 'negative' ? "text-red-500" : "text-vox-success"} />
                              </div>
                            ))}
                         </div>
                         <div className="pt-6">
                            <button className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-vox-primary transition-all underline underline-offset-8">Download_Full_Neural_Trace</button>
                         </div>
                      </motion.div>
                    ) : (
                      <div className="h-80 flex flex-col items-center justify-center text-center gap-6">
                        <Cpu className="text-white/5 animate-pulse" size={64} />
                        <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em] italic max-w-[200px]">Awaiting predictive trigger from labs...</p>
                      </div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </section>
        </div>

        {/* Global Event Stream */}
        <div className="space-y-12">
           <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-[12px] font-black text-white/30 uppercase tracking-[0.6em] flex items-center gap-4">
                  <Activity size={24} className="text-vox-primary" />
                  Neural Trace
                </h2>
                <div className="px-3 py-1 rounded-full bg-vox-primary/10 border border-vox-primary/30 text-[9px] font-black text-vox-primary animate-pulse tracking-[0.2em] italic font-display">LIVE</div>
              </div>

              <div className="space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar pr-6">
                 {(!events || events.length === 0) ? (
                   <div className="p-16 text-center bg-vox-panel/20 border border-vox-border rounded-[4rem]">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-loose">Synchronizing institutional <br /> event vectors...</p>
                   </div>
                 ) : (
                   events && events.map((event, i) => (
                     <motion.div 
                       key={event.id}
                       initial={{ x: 20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ delay: i * 0.05 }}
                       className="p-8 rounded-[2.5rem] bg-vox-panel/40 border border-vox-border hover:border-vox-primary/30 transition-all group overflow-hidden relative shadow-xl"
                     >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-vox-primary/[0.03] blur-2xl rounded-full" />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                           <span className={cn(
                             "text-[9px] font-black uppercase tracking-[0.4em]",
                             event.type === 'Security' ? "text-red-500" : "text-vox-primary"
                           )}>{event.type}</span>
                           <span className="text-[10px] font-black text-white/10 font-mono tracking-tighter">{new Date(event.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[13px] font-black text-white/80 mb-6 uppercase tracking-tight leading-[1.2] relative z-10 italic">"{event.payload}"</p>
                        <div className="flex items-center justify-between pt-6 border-t border-vox-border relative z-10">
                           <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Node: {event.source}</span>
                           <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${event.impact * 100}%` }}
                                 className={cn(
                                   "h-full rounded-full transition-all duration-1000",
                                   event.impact > 0.7 ? "bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]" : "bg-vox-primary shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                                 )} 
                              />
                           </div>
                        </div>
                     </motion.div>
                   ))
                 )}
              </div>
           </section>

           {/* Metrics Hud */}
           <div className="p-12 rounded-[4rem] bg-vox-panel/60 border border-vox-border border-l-vox-secondary border-l-4 space-y-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vox-secondary/5 blur-[80px] rounded-full" />
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.8em] flex items-center gap-4 relative z-10">
                 <Target size={20} className="text-vox-secondary" />
                 Sentient_HUD
              </h3>
              <div className="space-y-10 relative z-10">
                 <MetricLine label="Policy Integrity" value="98.4%" progress={98.4} color="bg-vox-success shadow-[0_0_20px_rgba(0,255,163,0.4)]" />
                 <MetricLine label="Autonomous Enforcement" value="94.2%" progress={94.2} color="bg-vox-secondary shadow-[0_0_20px_rgba(112,0,255,0.4)]" />
                 <MetricLine label="Latency Variance" value="0.02ms" progress={12} color="bg-vox-primary shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
                 <MetricLine label="Systemic Drift" value="0.04%" progress={4} color="bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.4)]" />
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
    className="w-full p-8 rounded-[2.5rem] bg-vox-panel/40 border border-vox-border hover:border-vox-primary hover:bg-vox-primary/5 transition-all flex items-center justify-between text-left group shadow-xl relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-1 h-full bg-vox-primary/20 group-hover:bg-vox-primary transition-all" />
    <div className="flex-1">
       <h4 className="text-[11px] font-black text-white uppercase tracking-[0.6em] leading-none mb-3 italic font-display">{title}</h4>
       <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] italic">{desc}</p>
    </div>
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:scale-110 group-hover:bg-vox-primary group-hover:text-vox-bg transition-all shadow-xl">
       <Play size={18} fill="currentColor" />
    </div>
  </button>
);

const MetricLine = ({ label, value, progress, color }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.6em] italic">{label}</span>
      <span className="text-[11px] font-black text-white tracking-widest italic">{value}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 2, ease: "circOut" }}
        className={cn("h-full", color)} 
      />
    </div>
  </div>
);

const BrainCircuitComponent = ({ size, className }: any) => (
  <BrainCircuit size={size} className={className} />
);
