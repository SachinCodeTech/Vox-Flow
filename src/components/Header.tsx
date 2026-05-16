import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ChevronDown, Zap, Globe, Shield, Info, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  currentWorkspace: string;
  onSwitchWorkspace: (id: string) => void;
  workspaces: any[];
  onSetViewMode: (mode: string) => void;
  viewMode: string;
  onFocusMode: () => void;
}

export const Header = ({ 
  currentWorkspace, 
  onSwitchWorkspace, 
  workspaces, 
  onSetViewMode, 
  viewMode,
  onFocusMode 
}: HeaderProps) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="h-14 flex items-center justify-between px-6 border-b border-vox-border bg-vox-panel/60 backdrop-blur-3xl z-[60] shrink-0 sticky top-0"
    >
      {/* App Branding & Icon */}
      <div className="flex items-center gap-8">
        <div 
          onClick={() => onSetViewMode('canvas')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-vox-primary/20 flex items-center justify-center border border-vox-primary/30 group-hover:bg-vox-primary group-hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all duration-500">
            <Terminal className="text-vox-primary group-hover:text-vox-bg transition-colors" size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-vox-primary tracking-[0.4em] leading-none mb-1 group-hover:translate-x-1 transition-transform">VOXFLOW</span>
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-black text-white italic tracking-tighter">Sentient OS</span>
              <div className="w-1.5 h-1.5 rounded-full bg-vox-success animate-pulse ml-2" />
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 hidden lg:block" />

        {/* Global Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          <NavGroup title="Operate">
            <HeaderNavButton active={viewMode === 'canvas'} onClick={() => onSetViewMode('canvas')}>Infrastructure</HeaderNavButton>
            <HeaderNavButton active={viewMode === 'cosmos'} onClick={() => onSetViewMode('cosmos')}>Cosmos</HeaderNavButton>
          </NavGroup>
          <div className="w-4" />
          <NavGroup title="Intelligence">
            <HeaderNavButton active={viewMode === 'advisor'} onClick={() => onSetViewMode('advisor')}>Advisory</HeaderNavButton>
            <HeaderNavButton active={viewMode === 'about'} onClick={() => onSetViewMode('about')}>Foundry</HeaderNavButton>
          </NavGroup>
        </nav>
      </div>

      {/* Workspace Selector */}
      <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
         <select 
          value={currentWorkspace} 
          onChange={(e) => onSwitchWorkspace(e.target.value)}
          className="bg-transparent text-[11px] font-black text-white/60 uppercase tracking-widest cursor-pointer appearance-none focus:outline-none group-hover:text-white transition-colors"
        >
          {workspaces.map(w => (
            <option key={w.id} value={w.id} className="bg-vox-panel text-white">{w.name}</option>
          ))}
        </select>
        <ChevronDown size={12} className="text-vox-primary opacity-40 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all" />
      </div>

      {/* System Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1 mr-4">
           <HeaderIconButton icon={Info} onClick={() => onSetViewMode('info')} tooltip="System Info" />
           <HeaderIconButton icon={Shield} onClick={() => onSetViewMode('privacy')} tooltip="Privacy Protocols" />
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFocusMode}
            className="px-4 py-1.5 rounded-xl bg-vox-bg border border-vox-primary/30 text-[10px] font-black text-vox-primary uppercase tracking-widest hover:bg-vox-primary hover:text-vox-bg transition-all flex items-center gap-2 shadow-lg shadow-vox-primary/5"
          >
            <Zap size={14} className="fill-current" /> FOCUS
          </motion.button>

          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-vox-primary/40 to-vox-secondary/40 p-px group cursor-pointer hover:scale-105 transition-transform shadow-xl shadow-vox-primary/10">
             <div className="w-full h-full rounded-2xl bg-vox-bg flex items-center justify-center overflow-hidden relative">
                <span className="text-[10px] font-black text-white relative z-10 tracking-tighter">DZ</span>
                <div className="absolute inset-0 bg-vox-primary/5 group-hover:bg-vox-primary/20 transition-colors" />
             </div>
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
