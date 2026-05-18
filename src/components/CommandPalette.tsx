import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  Zap, 
  Settings, 
  User, 
  Layers, 
  FileText, 
  Shield, 
  Workflow,
  Command,
  ArrowRight,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setViewMode, executeSequence, resetWorkflow, undo, redo, workspaces, switchWorkspace } = useWorkflowStore();

  const commands = [
    { id: 'exec', title: 'Execute Sequence', icon: Zap, action: () => executeSequence(), shortcut: 'E' },
    { id: 'undo', title: 'Undo Last Action', icon: ArrowRight, action: () => undo(), shortcut: 'Z', rotate: 180 },
    { id: 'redo', title: 'Redo Action', icon: ArrowRight, action: () => redo(), shortcut: 'Y' },
    { id: 'reset', title: 'Reset Active Workspace', icon: RefreshCw, action: () => resetWorkflow(), shortcut: 'R' },
    { id: 'canvas', title: 'Switch to Canvas View', icon: Workflow, action: () => setViewMode('canvas'), shortcut: '1' },
    { id: 'dash', title: 'Switch to Dashboard', icon: Layers, action: () => setViewMode('dashboard'), shortcut: '2' },
    { id: 'advisor', title: 'Switch to Executive Advisor', icon: Cpu, action: () => setViewMode('advisor'), shortcut: '3' },
    { id: 'privacy', title: 'Privacy Protocols', icon: Shield, action: () => setViewMode('privacy'), shortcut: 'P' },
    { id: 'guide', title: 'Open Pilot\'s Manual', icon: FileText, action: () => setViewMode('guide'), shortcut: 'H' },
    ...workspaces.map(ws => ({
      id: `ws-${ws.id}`,
      title: `Switch Workspace: ${ws.name}`,
      icon: Terminal,
      action: () => switchWorkspace(ws.id),
      shortcut: 'W'
    }))
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleAction = (cmd: any) => {
    cmd.action();
    setIsOpen(false);
    setQuery('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      if (filteredCommands[selectedIndex]) {
        handleAction(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] cursor-default"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 w-full max-w-xl bg-vox-bg border border-vox-primary/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,242,255,0.15)] z-[10001] overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-vox-primary/10 flex items-center justify-center">
                 <Command size={20} className="text-vox-primary" />
              </div>
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="EXECUTE_COMMAND_OR_SEARCH_OPERATIONS..."
                className="flex-1 bg-transparent border-none outline-none text-lg font-black italic text-white placeholder:text-white/10 uppercase tracking-tight"
              />
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">ESC</span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mx-auto flex items-center justify-center">
                      <Search size={24} className="text-red-400" />
                   </div>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">No matching logic found</p>
                </div>
              ) : (
                filteredCommands.map((cmd, i) => (
                  <button 
                    key={cmd.id}
                    onClick={() => handleAction(cmd)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "w-full p-4 flex items-center justify-between rounded-2xl transition-all group",
                      i === selectedIndex ? "bg-vox-primary shadow-[0_0_20px_rgba(0,242,255,0.3)]" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                       <div className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                         i === selectedIndex ? "bg-black/20 text-black" : "bg-white/5 text-white/40 group-hover:text-vox-primary"
                       )}>
                          <cmd.icon size={20} style={cmd.rotate ? { transform: `rotate(${cmd.rotate}deg)` } : {}} />
                       </div>
                       <span className={cn(
                         "text-[11px] font-black uppercase tracking-widest",
                         i === selectedIndex ? "text-vox-bg" : "text-white/60"
                       )}>
                         {cmd.title}
                       </span>
                    </div>
                    {cmd.shortcut && (
                      <div className={cn(
                        "px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all",
                        i === selectedIndex ? "bg-black/20 text-vox-bg" : "bg-white/5 text-white/20"
                      )}>
                         {cmd.shortcut}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[8px] font-black text-white/40">↑↓</div>
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-4 rounded bg-white/5 flex items-center justify-center text-[8px] font-black text-white/40">ENTER</div>
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Select</span>
                  </div>
               </div>
               <span className="text-[8px] font-black text-vox-primary/40 uppercase tracking-widest italic">Sentient Search Active</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
