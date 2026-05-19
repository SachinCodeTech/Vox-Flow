import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Activity, Radio, Binary } from 'lucide-react';
import { cn } from '../lib/utils';

export const BootScreen = () => {
  const [complete, setComplete] = useState(false);
  const [stage, setStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const stages = [
    "Allocating Neural Buffers...",
    "Handshaking Cloud Gateway...",
    "Loading Cognitive Modules...",
    "Initializing Vox_OS Kernel...",
    "Authenticating Architect...",
    "Synchronizing Workspace..."
  ];

  useEffect(() => {
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage >= stages.length) {
        clearInterval(interval);
        setTimeout(() => setComplete(true), 800);
        return;
      }
      setLogs(prev => [...prev.slice(-3), stages[currentStage]]);
      setStage(currentStage);
      currentStage++;
    }, 600);

    return () => clearInterval(interval);
  }, []);

  if (complete) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "circIn" }}
      className="fixed inset-0 z-[1000] bg-vox-bg flex items-center justify-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vox-primary/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(0,180,216,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative flex flex-col items-center gap-12 max-w-sm w-full">
        {/* Core Animation */}
        <div className="relative w-32 h-32 flex items-center justify-center">
           <motion.div 
             animate={{ 
               rotate: [0, 90, 180, 270, 360],
               scale: [1, 1.1, 1],
               borderColor: ['rgba(0,229,255,0.4)', 'rgba(93,169,255,0.4)', 'rgba(0,229,255,0.4)']
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 border border-vox-primary/20 rounded-[2.5rem]"
           />
           <motion.div 
             animate={{ 
               rotate: [360, 270, 180, 90, 0],
               scale: [0.9, 1, 0.9],
             }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute inset-2 border border-vox-secondary/30 rounded-[2rem] border-dashed"
           />
           <div className="relative z-10 w-16 h-16 bg-vox-primary/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              <Cpu className="text-vox-primary animate-pulse" size={32} />
           </div>
           
           {/* Pulsing Particles */}
           {[0, 90, 180, 270].map((angle, i) => (
             <motion.div
               key={i}
               animate={{ 
                 opacity: [0, 1, 0],
                 scale: [0.5, 1.5, 0.5],
                 x: [Math.cos(angle * Math.PI / 180) * 40, Math.cos(angle * Math.PI / 180) * 80],
                 y: [Math.sin(angle * Math.PI / 180) * 40, Math.sin(angle * Math.PI / 180) * 80],
               }}
               transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
               className="absolute w-1.5 h-1.5 rounded-full bg-vox-primary/60 blur-[1px]"
             />
           ))}
        </div>

        {/* Textual Diagnostics */}
        <div className="w-full space-y-6 text-center">
          <div className="space-y-1">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-[8px] font-black text-vox-primary uppercase tracking-[0.6em]"
             >
               Neuro_Link_Active
             </motion.div>
             <h2 className="text-3xl font-black italic tracking-tighter text-white">
               VOX_OS <span className="text-white/20">BOOT_V4.2</span>
             </h2>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage + 1) * (100 / stages.length)}%` }}
                  className="h-full bg-gradient-to-r from-vox-primary to-vox-secondary shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                />
             </div>
             
             {/* Scrolling Logs */}
             <div className="h-12 overflow-hidden flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.p
                      key={log + i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-loose"
                    >
                      {log}
                    </motion.p>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="absolute bottom-12 flex flex-col items-center gap-2">
           <div className="flex items-center gap-3 opacity-30">
              <Binary size={12} />
              <Radio size={12} className="animate-pulse text-vox-primary" />
              <Zap size={12} />
           </div>
           <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.5em]">
             Authorized Personal Use Only // drs52ss19
           </p>
        </div>
      </div>

      {/* Edge Scanlines */}
      <div className="absolute inset-0 pointer-events-none border-[40px] border-vox-bg z-[1001]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_2px,3px_100%] z-[1002]" />
    </motion.div>
  );
};
