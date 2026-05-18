import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ChevronDown, Zap, Globe, Shield, Info, HelpCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useWorkflowStore } from '../store/useWorkflowStore';

interface HeaderProps {
  currentWorkspace: string;
  onSwitchWorkspace: (id: string) => void;
  workspaces: any[];
  onSetViewMode: (mode: string) => void;
  viewMode: string;
}

export const Header = ({ 
  currentWorkspace, 
  onSwitchWorkspace, 
  workspaces, 
  onSetViewMode, 
  viewMode,
}: HeaderProps) => {
  const { executeSequence, isExecuting, logout, currentUser } = useWorkflowStore();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="h-10 flex items-center justify-between px-6 border-b border-vox-border bg-vox-panel/60 backdrop-blur-3xl z-[60] shrink-0 sticky top-0"
    >
      {/* OS Logo & Name */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => onSetViewMode('canvas')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Terminal className="text-vox-primary" size={14} />
          <span className="text-[11px] font-black text-white tracking-widest leading-none">VoxOS</span>
        </div>

        <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-4">
           {['File', 'Edit', 'Kernel', 'Mesh', 'Window', 'Help'].map(item => (
             <button key={item} className="text-[10px] font-medium text-white/40 hover:text-white transition-colors">{item}</button>
           ))}
        </div>
      </div>

      {/* Center Logic: Clock */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center select-none">
         <span className="text-[10px] font-black text-white/80 tabular-nums">{formattedTime}</span>
         <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] -mt-0.5">{formattedDate}</span>
      </div>

      {/* System Actions & Tray */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={executeSequence}
            disabled={isExecuting}
            className={cn(
              "px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
              isExecuting 
                ? "bg-amber-400 text-black border-amber-500 animate-pulse" 
                : "bg-vox-primary/10 border-vox-primary/30 text-vox-primary hover:bg-vox-primary hover:text-vox-bg"
            )}
          >
            {isExecuting ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} className="fill-current" />}
            {isExecuting ? 'SEQ_ACTIVE' : 'PULSE'}
          </motion.button>

          <div className="w-px h-4 bg-white/10" />

          <div className="flex items-center gap-2 pr-3">
             <Globe size={13} className="text-white/20" />
             <Shield size={13} className="text-vox-success" />
             <Zap size={13} className="text-vox-secondary" />
          </div>

          <div 
            onClick={() => {
              if (confirm('Decommission operational vector and terminate session?')) {
                logout();
              }
            }}
            className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-all"
          >
             <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-vox-primary/40 to-vox-secondary/40 flex items-center justify-center overflow-hidden">
                <span className="text-[8px] font-black text-white uppercase">
                   {currentUser?.name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                </span>
             </div>
             <span className="text-[10px] font-black text-white/40 group-hover:text-white transition-colors">{currentUser?.name || 'VOX_AGENT'}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const NavGroup = ({ title, children }: any) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] ml-4">{title}</span>
    <div className="flex items-center gap-1">
      {children}
    </div>
  </div>
);

const HeaderNavButton = ({ active, children, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group overflow-hidden",
      active ? "text-vox-primary" : "text-white/40 hover:text-white"
    )}
  >
    <span className="relative z-10">{children}</span>
    {active && (
      <motion.div 
        layoutId="activeHeaderTab"
        className="absolute inset-0 bg-vox-primary/10 border border-vox-primary/20 rounded-xl"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {!active && (
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors" />
    )}
  </button>
);

const HeaderIconButton = ({ icon: Icon, onClick, tooltip }: any) => (
  <button 
    onClick={onClick}
    className="p-2.5 rounded-xl text-white/30 hover:text-vox-primary hover:bg-vox-primary/10 transition-all relative group"
  >
    <Icon size={18} />
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-vox-bg border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-90 group-hover:scale-100 shadow-2xl">
      {tooltip}
    </span>
  </button>
);
