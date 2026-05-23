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
import { MissionControl } from './components/MissionControl';
import { DigitalTwin } from './components/DigitalTwin';
import { GovernanceHub } from './components/GovernanceHub';
import { IntelligenceEngine } from './components/IntelligenceEngine';
import { useWorkflowStore } from './store/useWorkflowStore';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { cn } from './lib/utils';
import { CommandBar } from './components/CommandBar';
import { Header } from './components/Header';
import { SystemInfoPage } from './components/SystemInfoPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { AboutPage } from './components/AboutPage';
import { UserGuide } from './components/UserGuide';
import { NotFound } from './components/NotFound';
import { CinematicOverlay } from './components/CinematicOverlay';
import { LoginScreen } from './components/LoginScreen';
import { CommandPalette } from './components/CommandPalette';
import { StatusBar } from './components/StatusBar';
import { NotificationSystem } from './components/NotificationSystem';
import { SystemDock } from './components/SystemDock';

export default function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
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
    toggleSidebar,
    currentUser,
    setCurrentUser,
    isSplitLayout,
    toggleSplitLayout,
    splitRightView,
    setSplitRightView,
    executeSequence,
    setDeferredPrompt
  } = useWorkflowStore();

  useEffect(() => {
    // Synchronize global PWA install event if fired early or during runtime
    if ((window as any).__deferredInstallPrompt) {
      setDeferredPrompt((window as any).__deferredInstallPrompt);
    }

    const handlePromptAvailable = () => {
      if ((window as any).__deferredInstallPrompt) {
        setDeferredPrompt((window as any).__deferredInstallPrompt);
      }
    };

    window.addEventListener('pwa-install-prompt-available', handlePromptAvailable);
    return () => window.removeEventListener('pwa-install-prompt-available', handlePromptAvailable);
  }, [setDeferredPrompt]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              id: user.uid,
              name: userData.displayName || user.email?.split('@')[0] || 'User',
              role: userData.role || 'Architect',
              deptId: userData.deptId || 'dept-01'
            });
          } else {
            setCurrentUser({
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'User',
              role: 'Architect',
              deptId: 'dept-01'
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        // Only reset if not a dev (false access) user
        const current = useWorkflowStore.getState().currentUser;
        if (!current || !current.id.startsWith('dev-')) {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, [setCurrentUser]);

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
      // Tab: Toggle Sidebar
      if (e.key === 'Tab') {
        e.preventDefault();
        toggleSidebar();
      }
      // Ctrl + \ : Toggle Split Layout Mode
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleSplitLayout();
      }
      // Ctrl + Enter : Pulse Execution Sequence
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeSequence();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleSplitLayout, executeSequence]);

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
    <div className="flex h-svh w-screen bg-vox-bg text-white font-sans selection:bg-vox-primary/30 selection:text-vox-primary overflow-hidden">
      <CommandPalette />
      <StatusBar />
      <NotificationSystem />
      <SystemDock />
      <CommandBar />
      <AnimatePresence>
        {!currentUser && <LoginScreen />}
      </AnimatePresence>
      <CinematicOverlay />
      <AnimatePresence>
        {showStartScreen && <StartScreen onStart={handleStart} />}
      </AnimatePresence>

      <IntelligenceEngine />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Ambient OS Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vox-primary/10 blur-[120px] rounded-full" />
           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-vox-secondary/5 blur-[150px] rounded-full" />
        </div>
        {/* In-app Navigation Layer (Desktop Focus) */}
        {/* Header Component */}
        <Header 
          currentWorkspace={currentWorkspaceId}
          onSwitchWorkspace={switchWorkspace}
          workspaces={workspaces}
          onSetViewMode={setViewMode}
          viewMode={viewMode}
        />

        {/* Mode-based Content */}
        <div className="flex-1 flex overflow-hidden relative bg-[#050816]">
          <AnimatePresence mode="wait">
            {['canvas', 'dashboard', 'neural', 'governance', 'cosmos', 'advisor'].includes(viewMode) && (
              <motion.div
                key="sidebar"
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

          <div className="flex-1 relative flex flex-col overflow-hidden min-w-0 min-h-0">
            {/* Ambient Animated Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(93,169,255,0.05)_0%,transparent_70%)] pointer-events-none" />
            
            {/* View Render Utility */}
            {(() => {
              const renderView = (mode: string) => {
                switch (mode) {
                  case 'canvas':
                    return (
                      <ReactFlowProvider>
                        <FlowCanvas />
                      </ReactFlowProvider>
                    );
                  case 'dashboard':
                    return <Dashboard />;
                  case 'neural':
                    return <DigitalTwin />;
                  case 'cosmos':
                    return <CognitiveCosmos />;
                  case 'advisor':
                    return <ExecutiveAdvisor />;
                  case 'governance':
                    return <GovernanceHub />;
                  case 'mission':
                    return <MissionControl />;
                  case 'info':
                    return <SystemInfoPage onBack={() => setViewMode('canvas')} />;
                  case 'privacy':
                    return <PrivacyPolicy onBack={() => setViewMode('canvas')} />;
                  case 'guide':
                    return <UserGuide onBack={() => setViewMode('canvas')} />;
                  case 'about':
                    return <AboutPage onBack={() => setViewMode('canvas')} />;
                  default:
                    return <NotFound onBack={() => setViewMode('canvas')} />;
                }
              };

              return (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode + (isSplitLayout ? '-split' : '-single')}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    className="w-full h-full"
                  >
                    {isSplitLayout ? (
                      <div className="w-full h-full flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 relative overflow-hidden bg-vox-bg">
                        {/* Left Panel - Primary */}
                        <div className="flex-1 h-full min-w-0 min-h-0 relative flex flex-col">
                          <div className="h-7 px-4 bg-black/40 border-b border-white/5 flex items-center justify-between select-none z-10 shrink-0">
                            <span className="text-[8px] font-black uppercase text-vox-primary tracking-widest flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-vox-primary rounded-full animate-ping" />
                              PRIMARY WORKSPACE :: {viewMode.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-1">
                              {['canvas', 'dashboard', 'neural', 'governance'].map((m) => (
                                <button
                                  key={m}
                                  onClick={() => setViewMode(m as any)}
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest transition-all",
                                    viewMode === m 
                                      ? "bg-vox-primary/10 text-vox-primary border border-vox-primary/20" 
                                      : "text-white/30 hover:text-white"
                                  )}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1 min-h-0 min-w-0 relative">
                            {renderView(viewMode)}
                          </div>
                        </div>

                        {/* Right Panel - Secondary */}
                        <div className="w-full lg:w-[45%] h-full shrink-0 flex flex-col border-l border-white/5 bg-vox-panel/10 min-h-0 min-w-0 overflow-hidden">
                          <div className="h-7 px-4 bg-black/60 border-b border-white/5 flex items-center justify-between select-none z-10 shrink-0">
                            <span className="text-[8px] font-black uppercase text-vox-secondary tracking-widest flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-vox-secondary rounded-full animate-pulse" />
                              COLATERAL MONITOR :: {splitRightView.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-1">
                              {['dashboard', 'neural', 'governance', 'advisor', 'cosmos'].map((m) => (
                                <button
                                  key={m}
                                  onClick={() => setSplitRightView(m as any)}
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest transition-all",
                                    splitRightView === m 
                                      ? "bg-vox-secondary/15 text-vox-secondary border border-vox-secondary/20" 
                                      : "text-white/30 hover:text-white"
                                  )}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1 min-h-0 min-w-0 relative overflow-y-auto custom-scrollbar">
                            {renderView(splitRightView)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      renderView(viewMode)
                    )}
                  </motion.div>
                </AnimatePresence>
              );
            })()}
          </div>
        </div>

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
      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group",
      active ? "text-vox-primary" : "text-white/40 hover:text-white"
    )}
  >
    {children}
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="absolute inset-0 bg-vox-primary/10 border border-vox-primary/20 rounded-full -z-10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </button>
);

const StatusIndicator = ({ label, value, status }: { label: string, value?: string, status?: 'active' | 'idle' }) => (
  <div className="flex flex-col items-start gap-0.5">
    <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em] leading-none">{label}</span>
    <div className="flex items-center gap-1.5 min-w-[40px]">
      {status === 'active' && <div className="w-1 h-1 rounded-full bg-vox-success animate-pulse shadow-[0_0_8px_rgba(0,255,163,0.5)]" />}
      <span className="text-[10px] font-black text-white/80 uppercase tracking-tight">{value || (status === 'active' ? 'Live' : 'Standby')}</span>
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
