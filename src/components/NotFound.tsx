import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export const NotFound = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            className="w-24 h-24 mx-auto bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-center"
          >
            <AlertTriangle size={48} className="text-red-400" />
          </motion.div>
          <div className="absolute inset-0 bg-red-500/20 blur-[60px] -z-10 rounded-full" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            Pathway <span className="text-red-400">Severed.</span>
          </h1>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">Error 404 :: Logic Loop Detected</p>
        </div>

        <p className="text-sm text-white/60 leading-relaxed font-medium">
          The requested neural vector does not exist in the active repository. The system has automatically isolated this connection to prevent mesh contamination.
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Home size={16} /> Central Hub
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-vox-primary text-black hover:scale-[1.02] active:scale-98 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <RotateCcw size={16} /> Reboot Sync
          </button>
        </div>
      </motion.div>
    </div>
  );
};
