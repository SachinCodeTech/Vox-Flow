import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Send, Cpu, Zap, Search } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { generateWorkflow } from '../services/geminiService';
import { cn } from '../lib/utils';

export const CommandBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { setNodes, setEdges } = useWorkflowStore();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const workflow = await generateWorkflow(aiPrompt);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setAiPrompt('');
      setIsOpen(false);
    } catch (error) {
      console.error('AI Flow error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 sm:gap-4 w-full px-4 sm:px-0">
      {/* Expanded Command Input */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-full max-w-3xl bg-vox-panel/60 backdrop-blur-3xl border border-vox-border rounded-[3.5rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden relative group"
          >
            {/* Ambient Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-vox-primary/10 blur-[120px] rounded-full animate-pulse" />
            
            <div className="relative space-y-10">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-vox-secondary/10 flex items-center justify-center border border-vox-secondary/30 shadow-[0_0_30px_rgba(112,0,255,0.1)]">
                    <Sparkles size={32} className="text-vox-secondary text-glow-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-[0.6em] font-display italic leading-none">System Architect</h3>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em] mt-2 italic flex items-center gap-2">
                       <Cpu size={12} className="text-vox-primary" />
                       Neural_Synthesis_v4_Omega
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                   <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-vox-border shadow-2xl">
                      <Zap size={14} className="text-vox-primary" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-none italic">Status: Cognizant</span>
                   </div>
                   <button 
                    onClick={() => setIsOpen(false)}
                    className="p-4 rounded-full bg-white/5 hover:bg-vox-primary/20 text-white/20 hover:text-vox-primary transition-all border border-vox-border group/close"
                   >
                     <Zap className="rotate-45 group-hover/close:rotate-90 transition-transform" size={20} />
                   </button>
                </div>
              </div>

              <div className="relative group/area">
                <textarea
                  autoFocus
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder="Define neural logic directive..."
                  className="w-full bg-black/40 border border-vox-border rounded-[2rem] p-10 text-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-vox-primary/40 focus:ring-1 focus:ring-vox-primary/20 resize-none h-48 transition-all font-medium leading-tight tracking-tighter"
                />
                
                <div className="absolute bottom-8 right-8 flex items-center gap-8">
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] hidden sm:block italic font-display">Neural_Ready</span>
                   <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className={cn(
                      "w-20 h-20 rounded-3xl transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center",
                      isGenerating || !aiPrompt.trim() 
                        ? "bg-white/5 text-white/20 cursor-not-allowed" 
                        : "bg-vox-primary text-vox-bg hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(0,229,255,0.4)]"
                    )}
                  >
                    {isGenerating ? <Loader2 size={32} className="animate-spin" /> : <Send size={32} className="ml-1" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 px-2">
                 {['Autonomous_Mesh', 'Neural_Pipeline', 'Logic_HUD_Synthesis'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => setAiPrompt(tag.replace(/_/g, ' '))}
                    className="px-6 py-2.5 rounded-2xl bg-white/[0.01] border border-vox-border text-[9px] font-black text-white/30 uppercase tracking-[0.4em] hover:bg-vox-primary/10 hover:text-vox-primary hover:border-vox-primary/40 transition-all italic font-display"
                   >
                     {tag}
                   </button>
                 ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {!isOpen && (
        <motion.button
          layoutId="command-bar"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-10 px-12 py-6 bg-vox-panel/60 backdrop-blur-3xl border border-vox-border rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] group hover:border-vox-primary/40 transition-all relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-vox-primary/[0.02] to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-vox-secondary/10 group-hover:bg-vox-secondary/20 flex items-center justify-center transition-all border border-vox-secondary/20">
            <Sparkles size={24} className="text-vox-secondary text-glow-secondary" />
          </div>
          <div className="flex flex-col items-start">
             <span className="text-xl font-black text-white uppercase tracking-[0.4em] leading-none font-display italic">Initialize_Command</span>
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] leading-none mt-2 italic">Neural OS v4_Omega</span>
          </div>
          <div className="w-px h-12 bg-vox-border mx-4" />
          <div className="flex items-center gap-3 text-white/20">
             <kbd className="text-[11px] font-black tracking-[0.2em] bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 uppercase">Cmd</kbd>
             <span className="text-[12px] opacity-20 italic">/</span>
             <kbd className="text-[11px] font-black tracking-[0.2em] bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 uppercase">K</kbd>
          </div>
        </motion.button>
      )}
    </div>
  );
};
