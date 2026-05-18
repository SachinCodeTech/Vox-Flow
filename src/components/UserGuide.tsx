import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  MousePointer2, 
  Workflow, 
  Zap, 
  Database, 
  Shield, 
  Search, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export const UserGuide = ({ onBack }: { onBack: () => void }) => {
  const steps = [
    {
      title: 'Initialize Workspace',
      desc: 'Start by selecting a workspace from the sidebar or creating a new neural repo to house your logic meshes.',
      icon: Database,
      color: 'text-vox-primary'
    },
    {
      title: 'Craft Logic Flows',
      desc: 'Drag components from the Engine Forge into the canvas. Connect input handles (left) to output handles (right).',
      icon: Workflow,
      color: 'text-blue-400'
    },
    {
      title: 'Neural Clustering',
      desc: 'Select multiple nodes and use the context menu (Right Click) or HUD to group them into organized Neural Clusters.',
      icon: Layers,
      color: 'text-vox-secondary'
    },
    {
      title: 'Execute Sequence',
      desc: 'Engage "Execute Sequence" to run your workflow. Monitor real-time logs in the Pipeline Terminal at the bottom.',
      icon: Zap,
      color: 'text-amber-400'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-5xl mx-auto w-full p-8 md:p-12 h-full overflow-y-auto custom-scrollbar"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-vox-primary hover:text-white transition-colors mb-12 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">Back to Operational HUD</span>
      </button>

      <div className="space-y-16 pb-24">
        <header className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-vox-primary/10 border border-vox-primary/20">
                <Workflow className="text-vox-primary" size={24} />
             </div>
             <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter italic uppercase">
               Pilot's <span className="text-vox-primary">Manual.</span>
             </h1>
          </div>
          <p className="text-xl text-white/40 font-medium leading-relaxed max-w-2xl">
            Master the VOXFLOW Neural Orchestration Engine. This guide covers the core protocols for enterprise logic synthesis.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-8">
           {steps.map((step, i) => (
             <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 group hover:border-vox-primary/30 transition-all">
                <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110", step.color)}>
                   <step.icon size={28} />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{step.title}</h3>
                   <p className="text-sm text-white/50 leading-relaxed font-medium">{step.desc}</p>
                </div>
             </div>
           ))}
        </section>

        <section className="space-y-8 bg-black/40 border border-white/5 p-10 rounded-[3rem]">
           <div className="flex items-center gap-4">
              <MousePointer2 className="text-vox-secondary" />
              <h2 className="text-2xl font-black text-white italic uppercase">Control Shortcuts</h2>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { keys: 'Ctrl + S', action: 'Snapshot Workflow' },
                { keys: 'Ctrl + Z/Y', action: 'Undo / Redo' },
                { keys: 'Ctrl + R', action: 'Fit View to Canvas' },
                { keys: 'Tab', action: 'Toggle Operations Rail' },
                { keys: 'Right Click', action: 'Node Context Menu' },
                { keys: 'Del', action: 'Decommission Node' }
              ].map((cmd, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                   <span className="text-[10px] font-black text-vox-secondary uppercase tracking-[0.2em]">{cmd.action}</span>
                   <kbd className="text-[9px] font-mono text-white/60 bg-white/5 px-2 py-1 rounded inline-block self-start font-bold">{cmd.keys}</kbd>
                </div>
              ))}
           </div>
        </section>

        <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-vox-primary/20 to-transparent border border-vox-primary/20 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
               <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Need Advanced Intel?</h2>
               <p className="text-white/60 text-sm leading-relaxed">
                 Our technical support agents are synchronized with the VOXFLOW repository 24/7. Access the Global Intel network for complex integration deployments.
               </p>
               <button className="flex items-center gap-2 text-vox-primary text-[10px] font-black uppercase tracking-widest hover:gap-4 transition-all">
                  Access Support Mesh <ArrowRight size={14} />
               </button>
            </div>
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-vox-primary/20 flex items-center justify-center p-8 animate-[spin_20s_linear_infinite]">
               <Layers size={64} className="text-vox-primary/40" />
            </div>
        </div>
      </div>
    </motion.div>
  );
};
