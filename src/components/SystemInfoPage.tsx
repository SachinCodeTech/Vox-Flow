import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Cpu, Layers, Shield, Zap, ChevronLeft, Globe, Activity } from 'lucide-react';

export const SystemInfoPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto w-full p-8 md:p-12 space-y-16"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-vox-primary hover:text-white transition-colors mb-12 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">System Root</span>
      </button>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white tracking-tighter italic">VOXFLOW <br /><span className="text-vox-primary">SENTIENT OS.</span></h1>
            <p className="text-lg text-white/40 font-medium tracking-tight">The ultimate neural orchestration engine for complex ecosystem management.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Build</span>
              <span className="text-vox-primary font-black italic">v1.2.0-STABLE</span>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Status</span>
              <span className="text-vox-success font-black italic">OPTIMAL</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           <InfoCard 
            icon={Layers} 
            title="Multi-Layer Infrastructure" 
            desc="Construct infinitely complex pipelines using our proprietary node-based architecture. Parallel execution layers ensure zero-bottleneck performance."
           />
           <InfoCard 
            icon={Zap} 
            title="AI Cognitive Engine" 
            desc="Leverage integrated generative intelligence to describe and build workflows using natural language. The system evolves with your intent."
           />
           <InfoCard 
            icon={Shield} 
            title="Immutable Governance" 
            desc="Sovereign security protocols govern every data transition. Local-first computation ensures your intellectual assets never leave your control."
           />
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-12 pt-16 border-t border-white/5">
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-white italic flex items-center gap-4">
            <span className="w-10 h-px bg-vox-primary" />
            System Capabilities
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Real-time Neural Mesh Visualization', status: 'Active' },
              { label: 'Adaptive Workspace Orchestration', status: 'Active' },
              { label: 'High-Frequency Async Execution', status: 'Optimized' },
              { label: 'Distributed Cognition Protocols', status: 'Enabled' },
              { label: 'Quantum-Safe Local Encryption', status: 'Verified' }
            ].map((cap, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 relative group overflow-hidden">
                <div className="absolute inset-0 bg-vox-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <span className="text-sm font-bold text-white/70 relative z-10">{cap.label}</span>
                <span className="text-[10px] font-black text-vox-primary uppercase tracking-widest relative z-10">{cap.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-black text-white italic flex items-center gap-4 text-right justify-end">
            Institutional Specs
            <span className="w-10 h-px bg-vox-secondary" />
          </h2>
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-vox-secondary/10 to-transparent border border-white/10 space-y-6">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-vox-bg flex items-center justify-center border border-vox-secondary/30">
                  <Cpu className="text-vox-secondary" size={32} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-white">Engine Specifications</h3>
                   <p className="text-xs text-white/40 font-medium">Codetech Laboratories Foundry OS</p>
                </div>
             </div>
             <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-vox-secondary/20 pl-6">
                "VoxFlow Sentient OS is engineered to handle the most demanding organizational complexity. From global supply chain visualization to autonomous governance, the system provides total operational awareness."
             </p>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Max Nodes</p>
                   <p className="text-vox-secondary font-black">UNLIMITED</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Execution Latency</p>
                   <p className="text-vox-secondary font-black">&lt; 0.5ms</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 group hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
           <Terminal className="text-vox-primary" size={16} />
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">VoxFlow Sentient Architecture</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest">Constructed by CodeTech Solutions 2026</p>
      </footer>
    </motion.div>
  );
};

const InfoCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 hover:bg-white/[0.04] transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-vox-primary/10 flex items-center justify-center border border-white/10 group-hover:bg-vox-primary/20 group-hover:border-vox-primary/40 transition-all">
      <Icon className="text-vox-primary" size={24} />
    </div>
    <h3 className="text-lg font-black text-white italic tracking-tight">{title}</h3>
    <p className="text-sm text-white/40 leading-relaxed font-medium">{desc}</p>
  </div>
);
