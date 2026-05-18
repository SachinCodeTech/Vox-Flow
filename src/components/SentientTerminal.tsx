import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Activity, AlertTriangle, Zap, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

export const SentientTerminal = () => {
  const { systemLogs, clearLogs } = useWorkflowStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [systemLogs]);

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-vox-primary/10 flex items-center justify-center border border-vox-primary/20">
            <Terminal size={14} className="text-vox-primary" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white italic uppercase tracking-tighter">System_Log</h3>
            <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Real-time Event Stream</p>
          </div>
        </div>
        <button 
          onClick={clearLogs}
          className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-red-400 transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono scroll-smooth custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {systemLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
              <Activity className="animate-pulse" size={24} />
              <p className="text-[8px] font-black uppercase tracking-[0.4em]">Listening for neural pulses...</p>
            </div>
          ) : (
            systemLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex gap-3 text-[9px] leading-relaxed"
              >
                <span className="text-white/20 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={cn(
                  "shrink-0 font-black px-1 rounded uppercase tracking-tighter",
                  log.level === 'sentient' && "text-vox-primary bg-vox-primary/10",
                  log.level === 'info' && "text-blue-400 bg-blue-400/10",
                  log.level === 'warn' && "text-amber-400 bg-amber-400/10",
                  log.level === 'error' && "text-red-400 bg-red-400/10"
                )}>
                  {log.level}
                </span>
                <span className="text-white/40 italic shrink-0">[{log.source}]</span>
                <span className={cn(
                  "flex-1",
                  log.level === 'sentient' ? "text-vox-primary font-bold" : "text-white/80"
                )}>
                  {log.message}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[7px] font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-vox-primary/40">
            <div className="w-1 h-1 rounded-full bg-vox-primary animate-pulse" />
            LIVE_FEED
          </div>
          <div className="text-white/10">CORE_SYNC_ACTIVE</div>
        </div>
        <div className="text-white/10 italic">L7_PROXY_ROUTING</div>
      </div>
    </div>
  );
};
