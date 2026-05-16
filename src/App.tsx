import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { FlowCanvas } from './components/FlowCanvas';
import { Dashboard } from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Zap, ChevronLeft, ChevronRight, Menu, Info, FilePlus, ChevronDown, Plus, Globe, Layers } from 'lucide-react';
import { StartScreen } from './components/StartScreen';
import { InfoModal } from './components/InfoModal';
import { NeuralMap } from './components/NeuralMap';
import { CognitiveCosmos } from './components/CognitiveCosmos';
import { ExecutiveAdvisor } from './components/ExecutiveAdvisor';
import { DigitalTwin } from './components/DigitalTwin';
import { GovernanceHub } from './components/GovernanceHub';
import { IntelligenceEngine } from './components/IntelligenceEngine';
import { useWorkflowStore } from './store/useWorkflowStore';
import { cn } from './lib/utils';
import { CommandBar } from './components/CommandBar';

export default function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { 
    nodes, 
    edges, 
    resetWorkflow, 
    viewMode, 
    setViewMode,
    workspaces,
    currentWorkspaceId,
    switchWorkspace,
    isSidebarOpen,
    toggleSidebar
  } = useWorkflowStore();
  
  const activeWorkspace = workspaces.find(w => w.id === currentWorkspaceId);

  const handleNewFlow = () => {
    if (nodes.length > 1 || edges.length > 0) {
      if (confirm('Clear current workspace and start a new flow?')) {
        resetWorkflow();
      }
    } else {
      resetWorkflow();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const hasSeenStart = localStorage.getItem('voxflow_initialized');
    if (hasSeenStart) {
      setShowStartScreen(false);
    }
  }, []);

  const handleStart = () => {
    setShowStartScreen(false);
    localStorage.setItem('voxflow_initialized', 'true');
  };

  return (
    <div className="flex h-svh w-screen bg-[#050816] text-white font-sans selection:bg-vox-primary/30 selection:text-vox-primary overflow-hidden">
      <AnimatePresence>
        {showStartScreen && <StartScreen onStart={handleStart} />}
      </AnimatePresence>

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <IntelligenceEngine />

      {/* Cinematic Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vox-primary/5 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vox-secondary/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#050816_100%)] opacity-80" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden z-10">
        {/* Top bar status indicators */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.header 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="h-16 flex items-center justify-between px-8 border-b border-vox-border bg-vox-panel/30 backdrop-blur-3xl z-[60] shrink-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Left: Organization & Workspace */}
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-8 h-8 rounded-xl bg-vox-primary/10 flex items-center justify-center border border-vox-primary/20 group-hover:bg-vox-primary/40 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all">
                    <Terminal className="text-vox-primary" size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-vox-primary/60 uppercase tracking-[0.5em] leading-none mb-1 font-display italic">Neural_OS_v4</span>
                    <div className="flex items-center gap-3">
                       <select 
                        value={currentWorkspaceId} 
                        onChange={(e) => switchWorkspace(e.target.value)}
                        className="bg-transparent text-sm font-black text-white uppercase tracking-tighter cursor-pointer appearance-none pr-4 focus:outline-none italic hover:text-vox-primary transition-colors"
                      >
                        {workspaces.map(w => (
                          <option key={w.id} value={w.id} className="bg-vox-panel text-white">{w.name.replace(/ /g, '_').toUpperCase()}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="text-white/20" />
                    </div>
                  </div>
                </div>

                <div className="h-8 w-px bg-vox-border hidden lg:block" />

                <nav className="hidden lg:flex items-center gap-2">
                  <TopNavButton active={viewMode === 'canvas'} onClick={() => setViewMode('canvas')}>INFRASTRUCTURE</TopNavButton>
                  <TopNavButton active={viewMode === 'cosmos'} onClick={() => setViewMode('cosmos')}>COGNITIVE_COSMOS</TopNavButton>
                  <TopNavButton active={viewMode === 'advisor'} onClick={() => setViewMode('advisor')}>EXECUTIVE_ADVISOR</TopNavButton>
                  <TopNavButton active={viewMode === 'governance'} onClick={() => setViewMode('governance')}>SOVEREIGN_VAULT</TopNavButton>
                </nav>
              </div>

              {/* Center: Global Search / Command Bar Trigger */}
              <div className="hidden md:flex flex-1 max-w-lg mx-12">
                <button 
                  onClick={() => {}}
                  className="w-full h-10 px-6 flex items-center justify-between bg-black/40 border border-vox-border rounded-2xl hover:bg-black/60 hover:border-vox-primary/30 transition-all group overflow-hidden relative shadow-inner"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-vox-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 text-white/20 text-[11px] font-black uppercase tracking-[0.3em] relative z-10 italic">
                    <Plus size={14} className="text-vox-primary" />
                    State Strategy Control...
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-white/30 uppercase tracking-[0.1em] relative z-10 shadow-lg">
                    ⌘ K
                  </div>
                </button>
              </div>
              
              {/* Right: System Status */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-8 pr-6 border-r border-vox-border">
                  <StatusIndicator label="SYSTEM_SYNC" status="active" />
                  <StatusIndicator label="NEURAL_LATENCY" value="0.04ms" />
                  <StatusIndicator label="CORTEX_LOAD" value="12%" />
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsFocusMode(true)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-vox-primary/20 text-white/30 hover:text-vox-primary transition-all shadow-xl"
                  >
                    <Zap size={18} className="text-glow" />
                  </button>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-vox-primary to-vox-secondary p-px shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                     <div className="w-full h-full rounded-[14px] bg-[#050816] overflow-hidden flex items-center justify-center border border-white/10">
                        <span className="text-[11px] font-black text-white tracking-widest italic">DZ_OS</span>
                     </div>
                  </div>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Mode-based Content */}
        <div className="flex-1 flex overflow-hidden relative bg-[#050816]">
          <AnimatePresence mode="wait">
            {viewMode === 'canvas' && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: isSidebarOpen ? 280 : 64, 
                  opacity: 1 
                }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="relative z-[50] h-full shrink-0 border-r border-vox-border bg-vox-panel/40 backdrop-blur-3xl overflow-hidden"
              >
                 <Sidebar isCollapsed={!isSidebarOpen} onToggle={toggleSidebar} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 relative flex flex-col overflow-hidden">
            {/* Ambient Animated Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(93,169,255,0.05)_0%,transparent_70%)] pointer-events-none" />
            
            {viewMode === 'canvas' ? (
              <ReactFlowProvider>
                <FlowCanvas />
              </ReactFlowProvider>
            ) : viewMode === 'dashboard' ? (
              <Dashboard />
            ) : viewMode === 'neural' ? (
              <DigitalTwin />
            ) : viewMode === 'cosmos' ? (
              <CognitiveCosmos />
            ) : viewMode === 'advisor' ? (
              <ExecutiveAdvisor />
            ) : (
              <GovernanceHub />
            )}
          </div>
        </div>

        {/* Floating Command Bar */}
        {!isFocusMode && (
          <div className="fixed bottom-24 sm:bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 z-[45] w-full px-4 sm:px-0 pointer-events-none">
            <div className="pointer-events-auto">
              <CommandBar />
            </div>
          </div>
        )}

        {/* Exit Focus Mode Button */}
        {isFocusMode && (
          <button 
            onClick={() => setIsFocusMode(false)}
            className="fixed top-6 right-6 md:top-8 md:left-1/2 md:-translate-x-1/2 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full bg-vox-bg/90 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:border-vox-primary/50 hover:bg-vox-bg transition-all z-[100] flex items-center gap-2 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <Zap size={14} className="text-vox-primary fill-vox-primary/20" /> 
            <span className="hidden md:inline">Exit Focus Mode</span>
            <span className="md:hidden">Exit</span>
          </button>
        )}

        {/* Mobile Nav Bar */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="md:hidden fixed bottom-0 left-0 right-0 h-20 pb-4 bg-black/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 z-[50] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
            >
               <MobileNavButton active={viewMode === 'canvas'} onClick={() => setViewMode('canvas')} icon={Layers} label="Build" />
               <MobileNavButton active={viewMode === 'cosmos'} onClick={() => setViewMode('cosmos')} icon={Globe} label="Cosmos" />
               <MobileNavButton active={viewMode === 'advisor'} onClick={() => setViewMode('advisor')} icon={Zap} label="Exec" />
               <MobileNavButton active={viewMode === 'governance'} onClick={() => setViewMode('governance')} icon={Shield} label="Vault" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Orbs */}
      <div className="fixed top-1/4 -right-20 w-96 h-96 bg-vox-primary/10 blur-[120px] -z-10 rounded-full animate-pulse" />
      <div className="fixed -bottom-20 -left-20 w-96 h-96 bg-vox-secondary/10 blur-[120px] -z-10 rounded-full animate-pulse" />
    </div>
  );
}

const TopNavButton = ({ active, children, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all relative group font-display italic",
      active ? "text-vox-primary" : "text-white/30 hover:text-white"
    )}
  >
    {children}
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="absolute inset-0 bg-vox-primary/10 border border-vox-primary/30 rounded-2xl -z-10 shadow-[0_0_20px_rgba(0,229,255,0.1)]"
        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
      />
    )}
  </button>
);

const StatusIndicator = ({ label, value, status }: { label: string, value?: string, status?: 'active' | 'idle' }) => (
  <div className="flex flex-col items-start gap-1">
    <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.5em] leading-none italic">{label}</span>
    <div className="flex items-center gap-2 min-w-[50px]">
      {status === 'active' && (
        <div className="relative">
          <div className="w-1.5 h-1.5 rounded-full bg-vox-success animate-ping absolute inset-0 opacity-50" />
          <div className="w-1.5 h-1.5 rounded-full bg-vox-success shadow-[0_0_10px_rgba(0,255,163,0.5)]" />
        </div>
      )}
      <span className="text-[11px] font-black text-white/70 uppercase tracking-tighter italic">{value || (status === 'active' ? 'Live' : 'Standby')}</span>
    </div>
  </div>
);

const NavButton = ({ active, children, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all",
      active ? "bg-white text-vox-bg" : "text-white/60 hover:text-white"
    )}
  >
    {children}
  </button>
);

const MobileNavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 transition-all",
      active ? "text-vox-primary" : "text-white/40"
    )}
  >
    <Icon size={16} />
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </button>
);
