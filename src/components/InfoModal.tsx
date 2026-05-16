import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, Info, Terminal, User, Code, Layers, Cpu, Zap, Activity, Shield, MousePointer2, Share2, Sparkles } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'guide'>('info');

  return (activeTab &&
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="w-full max-w-3xl bg-vox-bg glass-panel rounded-[2rem] border-white/10 relative z-10 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-vox-primary animate-pulse" />
                  <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Vox<span className="text-vox-primary">System</span></h2>
                </div>
                
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                  <button 
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-vox-primary text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    System
                  </button>
                  <button 
                    onClick={() => setActiveTab('guide')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'guide' ? 'bg-vox-primary text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    User Guide
                  </button>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
              <AnimatePresence mode="wait">
                {activeTab === 'info' ? (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-12"
                  >
                    {/* About */}
                    <section>
                      <h3 className="text-[10px] uppercase font-black text-vox-primary tracking-[0.3em] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-vox-primary/30" /> Core Overview
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        <p className="text-white/70 text-sm leading-relaxed font-medium">
                          VoxFlow is a production-grade workflow automation engine designed for the high-frequency digital ecosystem. Built on a local-first architecture, it provides an uncompromising foundation for building complex task pipelines without sacrificing privacy or performance.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Version', value: '1.0.42-stbl' },
                            { label: 'Engine', value: 'VoxV8-Turbo' },
                            { label: 'Security', value: 'Sandbox-L3' },
                            { label: 'Status', value: 'Optimal' }
                          ].map(stat => (
                            <div key={stat.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                              <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">{stat.label}</p>
                              <p className="text-xs font-bold text-vox-primary">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Features */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { icon: Zap, title: 'Real-time', desc: 'Sub-ms latency' },
                        { icon: Shield, title: 'Encrypted', desc: 'AES-256 local' },
                        { icon: Activity, title: 'Scalable', desc: 'Infinite nodes' }
                      ].map((item, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-vox-primary/20 transition-all group">
                          <item.icon size={20} className="text-vox-primary mb-3 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-black text-white uppercase tracking-tight mb-1">{item.title}</p>
                          <p className="text-[10px] text-white/40 font-medium">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Credits */}
                    <section className="p-8 rounded-[2rem] bg-gradient-to-br from-vox-primary/10 via-vox-secondary/5 to-transparent border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-vox-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
                      <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                        <div className="space-y-5 flex-1 text-center sm:text-left">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vox-primary/10 text-vox-primary text-[9px] font-black uppercase tracking-[0.2em] border border-vox-primary/20">
                            <Code size={10} /> Development Lab
                          </div>
                          <div>
                            <p className="text-3xl font-black text-white tracking-tighter italic">CODETECH</p>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Foundry of Innovation</p>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-vox-primary/20 flex items-center justify-center border border-vox-primary/30 rotate-3 shadow-lg shadow-vox-primary/10">
                              <User size={24} className="text-vox-primary" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black text-white tracking-tight">Sachin Sheth</p>
                              <p className="text-[10px] text-vox-primary/60 uppercase font-black tracking-[0.15em]">Architect & Lead</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-40 h-40 shrink-0 glass-panel rounded-[2.5rem] flex items-center justify-center border-vox-primary/20 -rotate-3 hover:rotate-0 transition-transform duration-500 group shadow-2xl shadow-vox-primary/5">
                          <Cpu size={64} className="text-vox-primary animate-pulse group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    </section>
                  </motion.div>
                ) : (
                  <motion.div
                    key="guide"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    {/* Intro */}
                    <section>
                      <h3 className="text-[10px] uppercase font-black text-vox-secondary tracking-[0.3em] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-vox-secondary/30" /> Operator Manual
                      </h3>
                      <div className="p-6 rounded-2xl bg-vox-secondary/5 border border-vox-secondary/20 border-dashed">
                        <p className="text-sm text-white/80 leading-relaxed">
                          Welcome to the VoxFlow environment. This guide will help you master the node-based pipeline engine to automate your workspace.
                        </p>
                      </div>
                    </section>

                    {/* Step-by-Step */}
                    <div className="space-y-6">
                      {[
                        { 
                          icon: MousePointer2, 
                          title: '1. Deployment', 
                          desc: 'Drag nodes from the left sidebar onto the primary workspace. Nodes are categorized by Trigger, Logic, and Action types.' 
                        },
                        { 
                          icon: Share2, 
                          title: '2. Connection', 
                          desc: 'Link nodes by clicking and dragging from an output port (right side) to an input port (left side). Outputs are purple, inputs are cyan.' 
                        },
                        { 
                          icon: Sparkles, 
                          title: '3. AI Generation', 
                          desc: 'Use the AI Architect in the sidebar to describe your workflow. The system will automatically spawn and connect the necessary nodes.' 
                        },
                        { 
                          icon: Terminal, 
                          title: '4. Validation', 
                          desc: 'Once your flow is complete, use the "Execute Flow" button at the top right to initialize the local processing sequence.' 
                        }
                      ].map((step, i) => (
                        <div key={i} className="flex gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-vox-secondary">
                            <step.icon size={22} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 italic">
                              <span className="text-vox-secondary mr-2">0{i+1}</span>{step.title}
                            </h4>
                            <p className="text-xs text-white/50 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Hotkeys */}
                    <section>
                      <h3 className="text-[10px] uppercase font-black text-white/30 tracking-[0.3em] mb-6 flex items-center gap-3">
                        <span className="w-8 h-px bg-white/10" /> Terminal Shortcuts
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { key: 'Backspace', action: 'Delete Node' },
                          { key: 'Ctrl + S', action: 'Save Flow' },
                          { key: 'Space', action: 'Pan Canvas' },
                          { key: 'Ctrl + R', action: 'Reset View' },
                          { key: 'Tab', action: 'Toggle Sidebar' },
                          { key: 'Esc', action: 'Cancel Action' }
                        ].map(hk => (
                          <div key={hk.key} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                            <span className="text-[10px] text-white/40 font-bold">{hk.action}</span>
                            <kbd className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-black font-mono text-vox-primary">{hk.key}</kbd>
                          </div>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/60 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[9px] text-white/20 uppercase font-bold tracking-[0.2em] leading-relaxed text-center sm:text-left">
                VoxFlow Pipeline Engine v1.0.42 <br /> © 2026 CodeTech Inc. Non-Commercial Deployment.
              </p>
              <div className="flex gap-4">
                 <button className="text-[10px] font-black text-vox-primary p-2 border border-vox-primary/20 rounded-lg hover:bg-vox-primary/10 transition-all uppercase tracking-widest">
                  Documentation
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

