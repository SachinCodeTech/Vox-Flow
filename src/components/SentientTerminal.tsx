import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Activity, AlertTriangle, Zap, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { cn } from '../lib/utils';

type LogLevel = 'all' | 'sentient' | 'info' | 'warn' | 'error';

export const SentientTerminal = () => {
  const { systemLogs, clearLogs } = useWorkflowStore();
  const [filter, setFilter] = useState<LogLevel>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [systemLogs, filter]);

  const filteredLogs = systemLogs.filter(log => filter === 'all' || log.level === filter);

  // Counter ratios
  const counts = systemLogs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, { sentient: 0, info: 0, warn: 0, error: 0 } as Record<string, number>);

  return (
    <div className="flex flex-col h-full bg-black/50 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-vox-primary/10 flex items-center justify-center border border-vox-primary/30">
            <Terminal size={14} className="text-vox-primary animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white italic uppercase tracking-wider">System_Log</h3>
            <p className="text-[9px] text-white/50 font-semibold uppercase tracking-widest">Real-time Event Stream</p>
          </div>
        </div>

        {/* Level Filters with micro counters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/45 p-1 rounded-xl border border-white/5">
          {(['all', 'sentient', 'info', 'warn', 'error'] as LogLevel[]).map((level) => {
            const count = level === 'all' ? systemLogs.length : counts[level];
            const isActive = filter === level;
            return (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1",
                  isActive
                    ? level === 'sentient' ? "bg-vox-primary text-black font-black"
                      : level === 'info' ? "bg-blue-500 text-white"
                      : level === 'warn' ? "bg-amber-500 text-black"
                      : level === 'error' ? "bg-red-500 text-white"
                      : "bg-white text-black"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <span>{level}</span>
                {count > 0 && (
                  <span className={cn(
                    "px-1 py-0.5 rounded text-[8px] font-mono",
                    isActive ? "bg-black/20 text-current" : "bg-white/10 text-white/50"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button 
          onClick={clearLogs}
          className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 self-end sm:self-auto transition-all"
          title="Clear Terminal Logs"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono scroll-smooth custom-scrollbar bg-black/25"
      >
        <AnimatePresence initial={false}>
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-4 py-8">
              <Activity className="animate-pulse text-vox-primary/70" size={28} />
              <p className="text-[10px] text-vox-primary/80 font-black uppercase tracking-[0.4em]">Listening for neural pulses...</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex gap-3 text-[10px] leading-relaxed border-b border-white/[0.01] pb-1 hover:bg-white/[0.01]"
              >
                <span className="text-white/30 shrink-0 select-none font-medium">[{log.timestamp}]</span>
                <span className={cn(
                  "shrink-0 font-black px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider align-middle",
                  log.level === 'sentient' && "text-vox-primary bg-vox-primary/20 border border-vox-primary/30",
                  log.level === 'info' && "text-blue-400 bg-blue-400/20 border border-blue-400/30",
                  log.level === 'warn' && "text-amber-400 bg-amber-400/20 border border-amber-400/30",
                  log.level === 'error' && "text-red-400 bg-red-400/20 border border-red-400/30"
                )}>
                  {log.level}
                </span>
                <span className="text-white/50 font-bold shrink-0">[{log.source}]</span>
                <span className={cn(
                  "flex-1 tracking-wide selection:bg-vox-primary/30",
                  log.level === 'sentient' ? "text-vox-primary font-bold shadow-vox-primary/10 drop-shadow-[0_0_2px_rgba(0,229,255,0.4)]" : "text-white/90"
                )}>
                  {log.message}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 bg-black/60 border-t border-white/15 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-vox-primary font-black">
            <div className="w-1.5 h-1.5 rounded-full bg-vox-primary shadow-[0_0_8px_#00E5FF] animate-ping" />
            LIVE_FEED
          </div>
          <div className="text-white/40">CORE_SYNC_ACTIVE</div>
        </div>
        <div className="text-white/30 italic">L7_PROXY_ROUTING</div>
      </div>
    </div>
  );
};
