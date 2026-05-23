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
  const [lastGenResult, setLastGenResult] = useState<string | null>(null);
  const { setNodes, setEdges } = useWorkflowStore();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setLastGenResult(null);
      }
    };
    const handleToggle = (e: any) => { setIsOpen(e.detail?.open ?? true); setLastGenResult(null); }; window.addEventListener('keydown', handleKeyDown); window.addEventListener('toggle-ai-architect', handleToggle);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('toggle-ai-architect', handleToggle); };
  }, []);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setLastGenResult(null);
    try {
      const workflow = await generateWorkflow(aiPrompt);
      if (workflow.nodes && workflow.nodes.length > 0) {
        setNodes(workflow.nodes);
        setEdges(workflow.edges || []);
        setLastGenResult(`Success: Generated ${workflow.nodes.length} nodes and ${workflow.edges?.length || 0} edges.`);
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setLastGenResult('Error: Could not synthesize valid logic.');
      }
      setAiPrompt('');
    } catch (error) {
      console.error('AI Flow error:', error);
      setLastGenResult('Critical Error: Neural link failure.');
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
            className="w-full max-w-2xl bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group"
          >
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-vox-secondary/5 opacity-50 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-vox-primary/10 blur-[60px] rounded-full" />
            
            <div className="relative space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-vox-secondary/20">
                    <Sparkles size={16} className="text-vox-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">AI OS Architect</h3>
                    <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest mt-0.5">Synthesizing System Logic</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <Zap size={10} className="text-vox-primary" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">GPT-4.0 Equivalent</span>
                   </div>
                   <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/20 transition-all"
                   >
                     <Zap className="rotate-45" size={14} />
                   </button>
                </div>
              </div>

              <div className="relative">
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
                  placeholder="Describe the sovereign intelligence network to be synthesized..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-vox-secondary/50 resize-none h-32 transition-all font-medium leading-relaxed"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-4">
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-widest hidden sm:block">Press Enter to Synthesize</span>
                   <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className={cn(
                      "p-3 rounded-xl transition-all shadow-lg",
                      isGenerating || !aiPrompt.trim() 
                        ? "bg-white/5 text-white/20 cursor-not-allowed" 
                        : "bg-vox-secondary text-vox-bg hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(112,0,255,0.4)]"
                    )}
                  >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </div>
              
              {lastGenResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex flex-col gap-1 border shadow-xl backdrop-blur-md",
                    lastGenResult.startsWith('Success') 
                      ? "bg-vox-primary/10 text-vox-primary border-vox-primary/30" 
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", lastGenResult.startsWith('Success') ? "bg-vox-primary" : "bg-red-500")} />
                    <span className="opacity-60">Synthesis Engine:</span>
                    <span>{lastGenResult}</span>
                  </div>
                  {lastGenResult.startsWith('Success') && (
                    <div className="text-[8px] font-bold text-white/40 tracking-tighter mt-1 italic">
                      Neural logic mesh integrated into current workspace repository.
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex flex-wrap gap-2 px-2">
                 {['Sovereign CAD Sync', 'Auto-Governance Mesh', 'Neural Load Balancer'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => setAiPrompt(tag)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-widest hover:bg-vox-primary/10 hover:text-vox-primary hover:border-vox-primary/30 transition-all"
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-2.5 sm:py-4 bg-vox-bg/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-vox-secondary/50 transition-all font-sans"
        >
          <div className="p-1.5 sm:p-2 rounded-lg bg-vox-secondary/20 group-hover:bg-vox-secondary/40 transition-all">
            <Sparkles size={14} className="text-vox-secondary" />
          </div>
          <div className="flex flex-col items-start pr-0 sm:pr-4">
             <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none">AI Architect</span>
             <span className="text-[7px] sm:text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1">Synthesize</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/10 mx-2" />
          <div className="hidden sm:flex items-center gap-1 text-white/20">
             <kbd className="text-[9px] font-mono tracking-tighter bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase">Cmd</kbd>
             <span className="text-[9px]">+</span>
             <kbd className="text-[9px] font-mono tracking-tighter bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase">K</kbd>
          </div>
        </motion.button>
      )}
    </div>
  );
};
