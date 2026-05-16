import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, Shield, ArrowRight } from 'lucide-react';

export const StartScreen = ({ onStart }: { onStart: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050816] flex items-center justify-center p-6 overflow-hidden"
    >
      {/* Ambient HUD Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-vox-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-vox-secondary/10 blur-[150px] rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="w-40 h-40 bg-vox-panel/40 backdrop-blur-3xl rounded-[3rem] mb-16 flex items-center justify-center border border-vox-primary/30 shadow-[0_0_80px_rgba(0,229,255,0.2)] relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-vox-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Cpu className="text-vox-primary text-glow-primary group-hover:scale-110 transition-transform duration-700" size={80} />
          {/* Animated corner accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-vox-primary/40 rounded-tl-lg" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-vox-primary/40 rounded-br-lg" />
        </motion.div>

        <div className="space-y-6 mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, tracking: '0em' }}
            animate={{ opacity: 1, tracking: '1em' }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="flex items-center justify-center gap-6 text-vox-primary/40 mb-2 italic px-4"
          >
             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-vox-primary/20 to-transparent" />
             <span className="text-[11px] font-black uppercase tracking-[1em] italic whitespace-nowrap ml-[1em]">Neural_Infrastructure_v4</span>
             <div className="h-px flex-1 bg-gradient-to-r from-vox-primary/20 via-vox-primary/20 to-transparent" />
          </motion.div>
          <motion.h1
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: "circOut" }}
            className="text-8xl sm:text-9xl font-black tracking-[-0.05em] text-white uppercase italic leading-[0.8] font-display text-glow-white selection:bg-vox-primary/50"
          >
            VOX<span className="text-vox-primary text-glow-primary">FLOW</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-4 text-[12px] font-black text-white/30 uppercase tracking-[0.5em] italic font-display"
          >
            <span>Sovereign_OS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-vox-primary/20" />
            <span>Autonomous_Logic</span>
            <span className="w-1.5 h-1.5 rounded-full bg-vox-primary/20" />
            <span>Neural_Governance</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 w-full px-4">
          {[
            { icon: Zap, label: 'Neural_Parity', desc: 'Sovereign Real-time Sync' },
            { icon: Activity, label: 'Cognitive_Flow', desc: 'AI Synthesis Engine' },
            { icon: Shield, label: 'Secure_Vault', desc: 'Governed Computation' }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-10 rounded-[3rem] bg-vox-panel/40 backdrop-blur-3xl border border-vox-border group hover:border-vox-primary/30 transition-all text-center md:text-left shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden relative"
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-vox-primary/5 blur-2xl rounded-full" />
              <item.icon size={32} className="text-vox-primary mb-8 mx-auto md:mx-0 group-hover:scale-110 group-hover:text-glow-primary transition-all duration-500" />
              <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-3 italic font-display">{item.label}</p>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] italic leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-lg space-y-10">
          <motion.button
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8, ease: "circOut" }}
            onClick={onStart}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-8 bg-vox-primary text-vox-bg font-black uppercase tracking-[0.8em] rounded-3xl flex items-center justify-center gap-6 shadow-[0_0_60px_rgba(0,229,255,0.4)] hover:shadow-[0_0_100px_rgba(0,229,255,0.6)] transition-all italic font-display overflow-hidden relative group/btn"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 ml-[0.8em]">Initialize_Sovereign_OS</span> <ArrowRight size={28} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-[11px] text-white/10 font-black uppercase tracking-[0.6em] italic mb-1 flex items-center gap-4">
              <span className="h-px w-10 bg-white/5" />
              Authored by CodeTech Synthesis
              <span className="h-px w-10 bg-white/5" />
            </p>
            <div className="flex items-center gap-10">
               <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] text-vox-primary/30 font-black uppercase tracking-[0.3em] font-display italic">Lead Architect</p>
                  <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.1em] italic">Sachin Sheth</p>
               </div>
               <div className="w-px h-8 bg-white/5" />
               <div className="flex flex-col items-center gap-1">
                  <p className="text-[9px] text-vox-primary/30 font-black uppercase tracking-[0.3em] font-display italic">System Core</p>
                  <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.1em] italic">Omega v4.0</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
