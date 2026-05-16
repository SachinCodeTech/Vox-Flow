import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ChevronLeft, Globe, Database, Server } from 'lucide-react';

export const PrivacyPolicy = ({ onBack }: { onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full p-8 md:p-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-vox-primary hover:text-white transition-colors mb-12 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">Return to System</span>
      </button>

      <div className="space-y-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vox-primary/10 text-vox-primary text-[10px] font-black uppercase tracking-[0.2em] border border-vox-primary/20">
            <Shield size={12} /> Privacy Protocol 1.0
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">DATA SOVEREIGNTY</h1>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xl">
            In the VoxFlow Neural OS, privacy isn't just a feature—it's an architectural necessity. We operate on a zero-knowledge local-first foundation.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white italic flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-vox-primary" />
              Local-First Processing
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              VoxFlow does not transmit your workspace data, node configurations, or workflow logic to external servers. All computations and flow executions occur within your local environment's secure sandbox.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-lg font-black text-white italic flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-vox-secondary" />
              Zero-Tracking Policy
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              We do not utilize telemetry, analytics, or behavioral tracking within the core application. Your interactions with the VoxFlow interface are strictly confidential and invisible to our development team.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Lock, title: 'Encrypted Storage', desc: 'Local IndexedDB instances are AES-256 encrypted.' },
            { icon: Eye, title: 'No Visual Logging', desc: 'Interface snapshots are never captured or relayed.' },
            { icon: Globe, title: 'Air-Gap Capability', desc: 'Fully functional without an active network connection.' }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-vox-primary/20 transition-all">
              <item.icon size={24} className="text-vox-primary mb-4" />
              <h3 className="text-xs font-black text-white uppercase mb-2">{item.title}</h3>
              <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-6">
          <h2 className="text-xl font-black text-white italic">Third-Party Integrations</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            While VoxFlow core is private, users may choose to integrate third-party APIs (e.g., GPT, Slack). In these cases, data transmission is governed by those specific service providers. VoxFlow strictly acts as an encrypted conduit for these communications.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
                <Database size={14} className="text-vox-primary" />
                <span className="text-[10px] text-white/60 font-bold">SQL Lite Core</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10">
                <Server size={14} className="text-vox-secondary" />
                <span className="text-[10px] text-white/60 font-bold">Node.js Runtime</span>
             </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-white/5 flex justify-between items-center text-[10px] text-white/20 font-bold uppercase tracking-widest">
          <p>© 2026 CodeTech Sovereignty Protection</p>
          <p>Version 2.4.0 Patch</p>
        </footer>
      </div>
    </motion.div>
  );
};
