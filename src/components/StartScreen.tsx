import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Activity, Shield, ArrowRight } from 'lucide-react';

export const StartScreen = ({ onStart }: { onStart: () => void }) => {
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('Initializing Neural Engine...');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoading(false);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const statusUpdates = [
      { p: 20, t: 'Synchronizing Cognitive Mesh...' },
      { p: 45, t: 'Optimizing for High-Fidelity OS...' },
      { p: 70, t: 'Calibrating Foundational Protocols...' },
      { p: 90, t: 'Handshaking with CodeTech Cloud...' }
    ];

    const statusInterval = setInterval(() => {
      const update = statusUpdates.find(u => progress >= u.p && progress < u.p + 5);
      if (update) setStatusText(update.t);
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(statusInterval);
    };
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-vox-bg flex items-center justify-center p-6 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-vox-primary/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-vox-secondary/5 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-xl w-full glass-panel p-12 rounded-[3rem] border-white/10 relative z-10 text-center shadow-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-28 h-28 bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] mx-auto mb-10 flex items-center justify-center border border-vox-primary/30 shadow-[0_0_50px_rgba(0,242,255,0.15)] relative group"
        >
          <Cpu className="text-vox-primary relative z-10" size={56} />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-vox-primary/20 rounded-[2.5rem] scale-110"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-12"
        >
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-vox-primary uppercase tracking-[0.6em] leading-none mb-2">Neural Orchestration</span>
            <h1 className="text-6xl font-black tracking-tighter text-white italic">
              VOX<span className="text-vox-primary">FLOW</span>
            </h1>
          </div>
          <p className="text-white/40 text-sm leading-relaxed font-medium max-w-sm mx-auto">
            Experience the next evolution of intelligent workspace automation. Engineering institutional clarity through cognitive node pipelines.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="w-full h-1.5 bg-white/5 rounded-full border border-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-vox-primary to-vox-secondary shadow-[0_0_15px_rgba(0,242,255,0.5)]"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-vox-primary/60 uppercase tracking-widest">{statusText}</span>
                <span className="text-[10px] font-black text-white italic">{progress}%</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-3 gap-3 text-left">
                {[
                  { icon: Zap, label: 'Fast', desc: '0.1ms Sync' },
                  { icon: Activity, label: 'Neural', desc: 'AI Active' },
                  { icon: Shield, label: 'Secure', desc: 'Local L3' }
                ].map((item, i) => (
                  <div key={item.label} className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                    <item.icon size={16} className="text-vox-primary mb-2" />
                    <p className="text-[9px] font-black text-white/90 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-[8px] text-white/30 font-bold">{item.desc}</p>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={onStart}
                whileHover={{ scale: 1.02, shadow: "0 0 40px rgba(0,242,255,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4.5 bg-vox-primary text-vox-bg font-black uppercase tracking-[0.25em] rounded-[1.25rem] flex items-center justify-center gap-3 transition-all relative overflow-hidden group mb-4"
              >
                <span className="relative z-10 flex items-center gap-3">INITIALIZE SYSTEM <ArrowRight size={20} /></span>
                <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 opacity-20" />
              </motion.button>
              
              <div className="flex flex-col items-center gap-1.5 opacity-50">
                <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">CodeTech Research Lab</p>
                <div className="h-px w-12 bg-white/10" />
                <p className="text-[8px] text-vox-primary/60 font-black uppercase tracking-[0.15em]">Lead: Sachin Sheth</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

};
