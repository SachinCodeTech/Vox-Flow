import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Twitter, Linkedin, Github, Code, Cpu, User, ExternalLink, Mail, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export const AboutPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto w-full p-8 md:p-12 h-full overflow-y-auto"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-vox-primary hover:text-white transition-colors mb-16 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">Exit to Workspace</span>
      </button>

      <div className="grid lg:grid-cols-12 gap-16">
        {/* Left: Brand & Vision */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-6">
            <h1 className="text-7xl font-black text-white tracking-tighter italic leading-tight">
              CODETECH <br />
              <span className="text-vox-primary">LABORATORIES.</span>
            </h1>
            <p className="text-xl text-white/50 font-medium leading-relaxed max-w-2xl">
              We engineer advanced computational engines that redefine the boundaries of human-machine interaction. VoxFlow is our flagship neural OS for enterprise orchestration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-vox-primary/10 flex items-center justify-center border border-vox-primary/20">
                <Code className="text-vox-primary" size={24} />
              </div>
              <h3 className="text-lg font-black text-white italic">Foundry Protocol</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Our code is forged in high-intensity development environments, prioritizing architectural purity and sub-millisecond execution speeds.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-vox-secondary/10 flex items-center justify-center border border-vox-secondary/20">
                <Cpu className="text-vox-secondary" size={24} />
              </div>
              <h3 className="text-lg font-black text-white italic">Neural Integration</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                We specialize in bridging disparate data streams into unified cognitive meshes, allowing for seamless intelligence scaling.
              </p>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5">
             <div className="flex items-center gap-12 text-white/30 font-black uppercase tracking-[0.3em] text-[10px]">
                <div className="flex items-center gap-2"><MapPin size={14} /> Global Hub</div>
                <div className="flex items-center gap-2"><Mail size={14} /> Contact@CodeTech.io</div>
             </div>
          </div>
        </div>

        {/* Right: Leadership & Social */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-vox-primary/20 via-vox-secondary/10 to-transparent border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-vox-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:scale-150 duration-1000" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="w-20 h-20 rounded-[2rem] bg-vox-bg p-px border border-white/20 overflow-hidden shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full rounded-[2rem] bg-vox-bg flex items-center justify-center overflow-hidden">
                    {/* Placeholder for Sachin Sheth */}
                    <User size={40} className="text-vox-primary" />
                  </div>
                </div>
                <div className="flex gap-2">
                   <SocialIcon href="https://x.com/sachin_CTAS" icon={Twitter} color="vox-primary" />
                   <SocialIcon href="https://www.linkedin.com/in/sachin-sheth-1528273b2?utm_source=share_via&utm_content=profile&utm_medium=member_android" icon={Linkedin} color="vox-secondary" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">Sachin Sheth</h2>
                <p className="text-vox-primary/80 font-black uppercase tracking-[0.2em] text-xs mt-1 italic">Lead Architect & Founder</p>
                <div className="mt-6 flex flex-wrap gap-2">
                   {['Full-Stack Systems', 'AI Orchestration', 'OS Kernel Design'].map(tag => (
                     <span key={tag} className="px-3 py-1 rounded-full bg-black/40 text-[9px] font-black uppercase text-white/40 border border-white/5 tracking-widest">{tag}</span>
                   ))}
                </div>
              </div>

              <p className="text-sm text-white/60 leading-relaxed font-medium italic">
                "We don't build software. We engineer digital consciousness architectures designed to adapt, evolve, and empower the next generation of institutional leadership."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] text-white">
              <Github size={16} /> GitHub Org
            </button>
            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-vox-primary text-black hover:scale-[1.02] transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-vox-primary/20">
              Lab Report <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SocialIcon = ({ href, icon: Icon, color }: any) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 transition-all hover:scale-110",
      color === 'vox-primary' ? "hover:bg-vox-primary/20 hover:text-vox-primary" : "hover:bg-vox-secondary/20 hover:text-vox-secondary",
      "text-white/40"
    )}
  >
    <Icon size={18} />
  </a>
);
