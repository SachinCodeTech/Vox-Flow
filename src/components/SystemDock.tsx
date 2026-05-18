import React from 'react';
import { motion } from 'motion/react';
import { 
  Workflow, 
  LayoutDashboard, 
  Cpu, 
  Shield, 
  Info, 
  Search,
  Settings,
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

export const SystemDock = () => {
  const { viewMode, setViewMode } = useWorkflowStore();

  const dockItems = [
    { id: 'canvas', icon: Workflow, label: 'Mesh_Canvas' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Ops_Center' },
    { id: 'advisor', icon: Cpu, label: 'Cog_Advisor' },
    { id: 'mission', icon: Activity, label: 'Transmission' },
    { id: 'privacy', icon: Shield, label: 'Security' },
    { id: 'neural', icon: Sparkles, label: 'Neural_Sys' },
    { id: 'about', icon: Info, label: 'Kernel_Info' }
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] hidden sm:block">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-1.5 p-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {dockItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id as any)}
            className="group relative"
          >
            <div className={cn(
               "w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 relative overflow-hidden",
               viewMode === item.id 
                 ? "bg-vox-primary text-vox-bg shadow-[0_0_20px_rgba(0,242,255,0.4)]" 
                 : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            )}>
               <item.icon size={20} />
               {viewMode === item.id && (
                  <motion.div 
                    layoutId="dock-active"
                    className="absolute inset-0 bg-white/20"
                  />
               )}
            </div>
            
            {/* Label Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none scale-90 group-hover:scale-100">
               <span className="text-[8px] font-black uppercase tracking-widest text-white whitespace-nowrap">{item.label}</span>
               <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90" />
            </div>
          </button>
        ))}
        
        <div className="w-px h-8 bg-white/10 mx-2" />
        
        <button className="w-12 h-12 rounded-[1.25rem] bg-white/5 text-white/20 flex items-center justify-center hover:bg-white/10 hover:text-vox-primary transition-all">
           <Search size={20} />
        </button>
      </motion.div>
    </div>
  );
};
